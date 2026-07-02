<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Agency;
use App\Models\Role;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        foreach (UserRole::all() as $role) {
            Role::query()->updateOrCreate(
                ['slug' => $role->value],
                [
                    'name' => str($role->value)->replace('-', ' ')->title()->toString(),
                    'description' => match ($role) {
                        UserRole::SuperAdmin => 'Full system access.',
                        UserRole::FleetManager => 'Manages fleet operations.',
                        UserRole::ReservationAgent => 'Handles reservation workflows.',
                    },
                    'is_system' => true,
                ],
            );
        }

        $agency = Agency::query()->firstOrCreate(
            ['code' => 'HQ'],
            [
                'name' => 'Headquarters',
                'timezone' => config('app.timezone', 'UTC'),
                'status' => 'active',
            ],
        );

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'role_id' => Role::query()->where('slug', UserRole::SuperAdmin->value)->value('id'),
            'agency_id' => $agency->id,
        ]);
    }
}
