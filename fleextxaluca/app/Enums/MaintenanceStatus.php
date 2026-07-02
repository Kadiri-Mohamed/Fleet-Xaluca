<?php

namespace App\Enums;

enum MaintenanceStatus: string
{
    case Scheduled = 'scheduled';
    case InProgress = 'in_progress';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    /**
     * @return array<int, self>
     */
    public static function all(): array
    {
        return [
            self::Scheduled,
            self::InProgress,
            self::Completed,
            self::Cancelled,
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
