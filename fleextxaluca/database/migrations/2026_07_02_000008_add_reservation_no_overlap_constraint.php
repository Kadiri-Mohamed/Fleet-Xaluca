<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (\Illuminate\Database\Schema\Blueprint $table): void {
            $table->index(['vehicle_id', 'status', 'start_at', 'end_at'], 'reservations_vehicle_status_start_end_index');
        });

        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS btree_gist');
            DB::statement(
                "ALTER TABLE reservations
                ADD CONSTRAINT reservations_vehicle_time_no_overlap
                EXCLUDE USING gist (
                    vehicle_id WITH =,
                    tstzrange(start_at, end_at, '[)') WITH &&
                )
                WHERE (status IN ('pending', 'approved', 'checked_out'))"
            );
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('ALTER TABLE reservations DROP CONSTRAINT IF EXISTS reservations_vehicle_time_no_overlap');
        }

        Schema::table('reservations', function (\Illuminate\Database\Schema\Blueprint $table): void {
            $table->dropIndex('reservations_vehicle_status_start_end_index');
        });
    }
};
