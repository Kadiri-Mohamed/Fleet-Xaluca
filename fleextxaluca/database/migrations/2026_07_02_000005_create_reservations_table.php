<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('requested_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('approved_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('reservation_number')->unique();
            $table->string('status')->default('pending');
            $table->dateTimeTz('start_at');
            $table->dateTimeTz('end_at');
            $table->string('purpose')->nullable();
            $table->text('notes')->nullable();
            $table->dateTimeTz('checked_out_at')->nullable();
            $table->dateTimeTz('checked_in_at')->nullable();
            $table->string('external_source')->nullable()->index();
            $table->string('external_id')->nullable();
            $table->unique(['external_source', 'external_id']);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['agency_id', 'status']);
            $table->index(['vehicle_id', 'start_at']);
            $table->index(['requested_by_user_id', 'start_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
