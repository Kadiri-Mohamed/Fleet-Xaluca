<?php

namespace App\Enums;

enum UserRole: string
{
    case SuperAdmin = 'super-admin';
    case FleetManager = 'fleet-manager';
    case ReservationAgent = 'reservation-agent';

    /**
     * @return array<int, self>
     */
    public static function all(): array
    {
        return [
            self::SuperAdmin,
            self::FleetManager,
            self::ReservationAgent,
        ];
    }
}
