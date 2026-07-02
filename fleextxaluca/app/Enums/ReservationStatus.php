<?php

namespace App\Enums;

enum ReservationStatus: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    case CheckedOut = 'checked_out';
    case Completed = 'completed';
    case Cancelled = 'cancelled';

    /**
     * @return array<int, self>
     */
    public static function all(): array
    {
        return [
            self::Pending,
            self::Approved,
            self::CheckedOut,
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

    /**
     * Reservation states that block the vehicle for overlapping bookings.
     *
     * @return array<int, string>
     */
    public static function blockingValues(): array
    {
        return [
            self::Pending->value,
            self::Approved->value,
            self::CheckedOut->value,
        ];
    }
}
