<?php

namespace App\Http\Controllers;

use App\Enums\VehicleStatus;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Services\Finance\FinanceReportService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(FinanceReportService $financeReports): Response
    {
        $now = now();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();
        $todayStart = $now->copy()->startOfDay();
        $todayEnd = $now->copy()->endOfDay();

        $vehicleStatusCounts = Vehicle::query()
            ->selectRaw('status, COUNT(*) as aggregate')
            ->groupBy('status')
            ->pluck('aggregate', 'status')
            ->all();

        $financialSummary = $financeReports->summary($monthStart, $monthEnd);
        $monthlySeries = $financeReports->dashboardSeries($now);

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

    private function money(float $value): string
    {
        return number_format($value, 2, '.', ',');
    }
}
