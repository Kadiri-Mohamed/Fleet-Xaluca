<?php

namespace App\Providers;

use App\Models\Vehicle;
use App\Policies\VehiclePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Vehicle::class => VehiclePolicy::class,
    ];

    public function boot(): void
    {
        Gate::policy(Vehicle::class, VehiclePolicy::class);
    }
}
