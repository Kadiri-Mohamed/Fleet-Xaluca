<?php

namespace App\Enums;

enum FinancialTransactionStatus: string
{
    case Draft = 'draft';
    case Posted = 'posted';
    case Voided = 'voided';

    /**
     * @return array<int, self>
     */
    public static function all(): array
    {
        return [
            self::Draft,
            self::Posted,
            self::Voided,
        ];
    }

    /**
     * @return array<int, string>
     */
    public static function values(): array
    {
        return array_map(static fn (self $status) => $status->value, self::all());
    }
}
