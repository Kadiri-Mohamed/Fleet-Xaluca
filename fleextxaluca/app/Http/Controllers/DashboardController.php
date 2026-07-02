<?php

namespace App\Http\Controllers;

use App\Enums\VehicleStatus;
use App\Models\FinancialTransaction;
use App\Models\Maintenance;
use App\Models\Reservation;
use App\Models\Vehicle;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $now = now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();
        $todayStart = $now->copy()->startOfDay();
        $todayEnd = $now->copy()->endOfDay();

        $months = collect(CarbonPeriod::create($now->copy()->subMonths(5)->startOfMonth(), '1 month', $monthStart))
            ->map(fn (Carbon $date) => $date->copy())
            ->values();

        $vehicleStatusCounts = Vehicle::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status')
            ->all();

        $financialSummary = $this->financialSummary($monthStart, $monthEnd);
        $monthlySeries = $months->map(function (Carbon $month) {
            $start = $month->copy()->startOfMonth();
            $end = $month->copy()->endOfMonth();

            $revenue = (float) FinancialTransaction::query()
                ->whereBetween('transaction_date', [$start, $end])
                ->where('status', 'posted')
                ->whereIn('direction', ['incoming', 'in', 'income', 'credit', 'revenue'])
                ->sum('amount');

            $expenses = (float) FinancialTransaction::query()
                ->whereBetween('transaction_date', [$start, $end])
                ->where('status', 'posted')
                ->whereIn('direction', ['outgoing', 'out', 'expense', 'debit', 'cost'])
                ->sum('amount');

            $maintenanceCost = (float) Maintenance::query()
                ->whereBetween('scheduled_at', [$start, $end])
                ->sum('cost');

            return [
                'month' => $month->format('M'),
                'reservations' => Reservation::query()
                    ->whereBetween('start_at', [$start, $end])
                    ->count(),
                'revenue' => round($revenue, 2),
                'maintenance_cost' => round($maintenanceCost, 2),
                'expenses' => round($expenses + $maintenanceCost, 2),
            ];
        })->all();

        $todayReservations = Reservation::query()
            ->with('vehicle:id,unit_number,plate_number')
            ->where('start_at', '<=', $todayEnd)
            ->where('end_at', '>=', $todayStart)
            ->orderBy('start_at')
            ->limit(5)
            ->get(['id', 'vehicle_id', 'reservation_number', 'status', 'start_at', 'end_at', 'purpose']);

        return Inertia::render('dashboard', [
            'metrics' => [
                [
                    'label' => 'Total Vehicles',
                    'value' => Vehicle::query()->count(),
                    'trend' => 'Fleet assets in service',
                ],
                [
                    'label' => 'Available',
                    'value' => (int) ($vehicleStatusCounts[VehicleStatus::Available->value] ?? 0),
                    'trend' => 'Ready for assignment',
                ],
                [
                    'label' => 'Reserved',
                    'value' => (int) ($vehicleStatusCounts[VehicleStatus::Reserved->value] ?? 0),
                    'trend' => 'Booked right now',
                ],
                [
                    'label' => 'Maintenance',
                    'value' => (int) ($vehicleStatusCounts[VehicleStatus::Maintenance->value] ?? 0),
                    'trend' => 'In the workshop',
                ],
                [
                    'label' => 'Revenue',
                    'value' => $this->money($financialSummary['revenue']),
                    'trend' => 'This month',
                ],
                [
                    'label' => 'Expenses',
                    'value' => $this->money($financialSummary['expenses']),
                    'trend' => 'This month, incl. maintenance',
                ],
                [
                    'label' => 'Profit',
                    'value' => $this->money($financialSummary['profit']),
                    'trend' => 'Revenue - expenses',
                    'accent' => $financialSummary['profit'] >= 0 ? 'positive' : 'negative',
                ],
                [
                    'label' => "Today's Reservations",
                    'value' => $todayReservations->count(),
                    'trend' => 'Vehicles on the road today',
                ],
            ],
            'reservationsPerMonth' => array_map(
                static fn (array $point) => ['month' => $point['month'], 'reservations' => $point['reservations']],
                $monthlySeries,
            ),
            'financeSeries' => array_map(
                static fn (array $point) => [
                    'month' => $point['month'],
                    'revenue' => $point['revenue'],
                    'maintenance_cost' => $point['maintenance_cost'],
                ],
                $monthlySeries,
            ),
            'todayReservations' => $todayReservations,
        ]);
    }

    /**
     * @return array{revenue: float, expenses: float, profit: float}
     */
    private function financialSummary(Carbon $monthStart, Carbon $monthEnd): array
    {
        $revenue = (float) FinancialTransaction::query()
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->where('status', 'posted')
            ->whereIn('direction', ['incoming', 'in', 'income', 'credit', 'revenue'])
            ->sum('amount');

        $expenses = (float) FinancialTransaction::query()
            ->whereBetween('transaction_date', [$monthStart, $monthEnd])
            ->where('status', 'posted')
            ->whereIn('direction', ['outgoing', 'out', 'expense', 'debit', 'cost'])
            ->sum('amount');

        $maintenanceCost = (float) Maintenance::query()
            ->whereBetween('scheduled_at', [$monthStart, $monthEnd])
            ->sum('cost');

        $expenses += $maintenanceCost;

        return [
            'revenue' => round($revenue, 2),
            'expenses' => round($expenses, 2),
            'profit' => round($revenue - $expenses, 2),
        ];
    }

    private function money(float $value): string
    {
        return number_format($value, 2, '.', ',');
    }
}
