<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Maintenance;
use App\Models\User;

class MaintenancePolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::all());
    }

    public function view(User $user, Maintenance $maintenance): bool
    {
        return $user->hasAnyRole(UserRole::all());
    }

    public function create(User $user): bool
    {
        return $user->isFleetManager();
    }

    public function update(User $user, Maintenance $maintenance): bool
    {
        return $user->isFleetManager();
    }

    public function delete(User $user, Maintenance $maintenance): bool
    {
        return $user->isFleetManager();
    }

    public function restore(User $user, Maintenance $maintenance): bool
    {
        return false;
    }

    public function forceDelete(User $user, Maintenance $maintenance): bool
    {
        return false;
    }
}
