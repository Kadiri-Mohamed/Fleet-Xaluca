<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Vehicle;

class VehiclePolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::all());
    }

    public function view(User $user, Vehicle $vehicle): bool
    {
        return $user->hasAnyRole(UserRole::all());
    }

    public function create(User $user): bool
    {
        return $user->isFleetManager();
    }

    public function update(User $user, Vehicle $vehicle): bool
    {
        return $user->isFleetManager();
    }

    public function delete(User $user, Vehicle $vehicle): bool
    {
        return $user->isFleetManager();
    }

    public function restore(User $user, Vehicle $vehicle): bool
    {
        return false;
    }

    public function forceDelete(User $user, Vehicle $vehicle): bool
    {
        return false;
    }
}
