<?php

namespace App\Enums;

enum FinancialTransactionCategory: string
{
    case Revenue = 'revenue';
    case FuelCost = 'fuel_cost';
    case Insurance = 'insurance';
    case MaintenanceCost = 'maintenance_cost';
    case OtherExpense = 'other_expense';

    /**
     * @return array<int, self>
     */
    public static function all(): array
    {
        return [
            self::Revenue,
            self::FuelCost,
            self::Insurance,
            self::MaintenanceCost,
            self::OtherExpense,
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $category) => $category->value, self::all());
    }

    public function isRevenue(): bool
    {
        return $this === self::Revenue;
    }

    public function isExpense(): bool
    {
        return ! $this->isRevenue();
    }

    public function direction(): string
    {
        return $this->isRevenue() ? 'incoming' : 'outgoing';
    }
}
