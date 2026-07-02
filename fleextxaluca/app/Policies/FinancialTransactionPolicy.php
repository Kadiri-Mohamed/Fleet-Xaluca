<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\FinancialTransaction;
use App\Models\User;

class FinancialTransactionPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        return $user->isSuperAdmin() ? true : null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(UserRole::all());
    }

    public function view(User $user, FinancialTransaction $financialTransaction): bool
    {
        return $user->hasAnyRole(UserRole::all());
    }

    public function create(User $user): bool
    {
        return $user->isFleetManager();
    }

    public function update(User $user, FinancialTransaction $financialTransaction): bool
    {
        return $user->isFleetManager();
    }

    public function delete(User $user, FinancialTransaction $financialTransaction): bool
    {
        return $user->isFleetManager();
    }

    public function restore(User $user, FinancialTransaction $financialTransaction): bool
    {
        return false;
    }

    public function forceDelete(User $user, FinancialTransaction $financialTransaction): bool
    {
        return false;
    }
}
