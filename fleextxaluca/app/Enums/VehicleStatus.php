<?php

namespace App\Enums;

enum VehicleStatus: string
{
    case Available = 'available';
    case Reserved = 'reserved';
    case Maintenance = 'maintenance';
    case Inactive = 'inactive';

    /**
     * @return array<int, self>
     */
    public static function all(): array
    {
        return [
            self::Available,
            self::Reserved,
            self::Maintenance,
            self::Inactive,
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
