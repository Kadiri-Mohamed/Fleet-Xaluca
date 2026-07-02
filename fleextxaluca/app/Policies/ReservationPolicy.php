<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Reservation;
use App\Models\User;

class ReservationPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::all());
    }

    public function view(User $user, Reservation $reservation): bool
    {
        return $user->hasAnyRole(UserRole::all());
    }

    public function create(User $user): bool
    {
        return $user->isFleetManager() || $user->isReservationAgent();
    }

    public function update(User $user, Reservation $reservation): bool
    {
        return $user->isFleetManager();
    }

    public function delete(User $user, Reservation $reservation): bool
    {
        return $user->isFleetManager();
    }

    public function restore(User $user, Reservation $reservation): bool
    {
        return false;
    }

    public function forceDelete(User $user, Reservation $reservation): bool
    {
        return false;
    }
}
