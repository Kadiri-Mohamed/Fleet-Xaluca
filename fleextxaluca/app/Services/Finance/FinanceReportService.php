<?php

namespace App\Services\Finance;

use App\Enums\FinancialTransactionCategory;
use App\Enums\FinancialTransactionStatus;
use App\Models\FinancialTransaction;
use App\Models\Maintenance;
use App\Models\Reservation;
use Carbon\Carbon;
use Carbon\CarbonPeriod;

class FinanceReportService
{
    /**
     * @return array{revenue: float, expenses: float, profit: float, roi: float}
     */
    public function summary(Carbon $start, Carbon $end): array
    {
        $totals = $this->totalsByCategory($start, $end);
        $revenue = $totals[FinancialTransactionCategory::Revenue->value] ?? 0.0;
        $fuelCost = $totals[FinancialTransactionCategory::FuelCost->value] ?? 0.0;
        $insurance = $totals[FinancialTransactionCategory::Insurance->value] ?? 0.0;
        $maintenanceCost = $totals[FinancialTransactionCategory::MaintenanceCost->value] ?? 0.0;
        $otherExpenses = $totals[FinancialTransactionCategory::OtherExpense->value] ?? 0.0;
        $expenses = $fuelCost + $insurance + $maintenanceCost + $otherExpenses;
        $profit = $revenue - $expenses;

        return [
            'revenue' => round($revenue, 2),
            'expenses' => round($expenses, 2),
            'profit' => round($profit, 2),
            'roi' => $expenses > 0 ? round(($profit / $expenses) * 100, 2) : 0.0,
        ];
    }

    /**
     * @return array<int, array{month: string, revenue: float, expenses: float, profit: float}>
     */
    public function monthlySeries(Carbon $end, int $months = 6): array
    {
        $start = $end->copy()->subMonths($months - 1)->startOfMonth();

        return collect(CarbonPeriod::create($start, '1 month', $end->copy()->endOfMonth()))
            ->map(function (Carbon $month) {
                $summary = $this->summary($month->copy()->startOfMonth(), $month->copy()->endOfMonth());

                return [
                    'month' => $month->format('M'),
                    'revenue' => $summary['revenue'],
                    'expenses' => $summary['expenses'],
                    'profit' => $summary['profit'],
                ];
            })
            ->values()
            ->all();
    }

    /**
     * @return array<int, array{category: string, total: float}>
     */
    public function categoryBreakdown(Carbon $start, Carbon $end): array
    {
        $totals = $this->totalsByCategory($start, $end);

        return [
            ['category' => FinancialTransactionCategory::Revenue->value, 'total' => $totals[FinancialTransactionCategory::Revenue->value] ?? 0.0],
            ['category' => FinancialTransactionCategory::FuelCost->value, 'total' => $totals[FinancialTransactionCategory::FuelCost->value] ?? 0.0],
            ['category' => FinancialTransactionCategory::Insurance->value, 'total' => $totals[FinancialTransactionCategory::Insurance->value] ?? 0.0],
            ['category' => FinancialTransactionCategory::MaintenanceCost->value, 'total' => $totals[FinancialTransactionCategory::MaintenanceCost->value] ?? 0.0],
            ['category' => FinancialTransactionCategory::OtherExpense->value, 'total' => $totals[FinancialTransactionCategory::OtherExpense->value] ?? 0.0],
        ];
    }

    /**
     * @return array<int, array{month: string, reservations: int, revenue: float, maintenance_cost: float, expenses: float}>
     */
    public function dashboardSeries(Carbon $end, int $months = 6): array
    {
        $start = $end->copy()->subMonths($months - 1)->startOfMonth();
        $rangeEnd = $end->copy()->endOfMonth();
        $period = collect(CarbonPeriod::create($start, '1 month', $rangeEnd))
            ->map(fn (Carbon $month) => $month->copy())
            ->values();

        $financialTransactions = FinancialTransaction::query()
            ->whereBetween('transaction_date', [$start, $rangeEnd])
            ->where('status', FinancialTransactionStatus::Posted->value)
            ->get(['transaction_date', 'category', 'amount'])
            ->groupBy(fn (FinancialTransaction $transaction) => $transaction->transaction_date->format('Y-m'));

        $reservations = Reservation::query()
            ->whereBetween('start_at', [$start, $rangeEnd])
            ->get(['start_at'])
            ->groupBy(fn (Reservation $reservation) => $reservation->start_at->format('Y-m'));

        $maintenanceCosts = Maintenance::query()
            ->whereBetween('scheduled_at', [$start, $rangeEnd])
            ->get(['scheduled_at', 'cost'])
            ->groupBy(fn (Maintenance $maintenance) => $maintenance->scheduled_at?->format('Y-m'));

        return $period->map(function (Carbon $month) use ($financialTransactions, $maintenanceCosts, $reservations) {
            $monthKey = $month->format('Y-m');
            $transactions = $financialTransactions->get($monthKey, collect());
            $revenue = (float) $transactions
                ->where('category', FinancialTransactionCategory::Revenue->value)
                ->sum('amount');
            $expenses = (float) $transactions
                ->whereIn('category', [
                    FinancialTransactionCategory::FuelCost->value,
                    FinancialTransactionCategory::Insurance->value,
                    FinancialTransactionCategory::MaintenanceCost->value,
                    FinancialTransactionCategory::OtherExpense->value,
                ])
                ->sum('amount');
            $maintenanceCost = (float) ($maintenanceCosts->get($monthKey, collect())->sum('cost'));

            return [
                'month' => $month->format('M'),
                'reservations' => $reservations->get($monthKey, collect())->count(),
                'revenue' => round($revenue, 2),
                'maintenance_cost' => round($maintenanceCost, 2),
                'expenses' => round($expenses + $maintenanceCost, 2),
            ];
        })->values()->all();
    }

    /**
     * @return array<string, float>
     */
    private function totalsByCategory(Carbon $start, Carbon $end): array
    {
        return FinancialTransaction::query()
            ->whereBetween('transaction_date', [$start, $end])
            ->where('status', FinancialTransactionStatus::Posted->value)
            ->selectRaw('category, COALESCE(SUM(amount), 0) as total')
            ->groupBy('category')
            ->pluck('total', 'category')
            ->map(fn ($value) => (float) $value)
            ->all();
    }
}
