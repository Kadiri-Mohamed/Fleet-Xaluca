<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('maintenances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->constrained()->cascadeOnDelete();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('maintenance_number')->unique();
            $table->string('type');
            $table->string('status')->default('scheduled');
            $table->dateTimeTz('scheduled_at')->nullable();
            $table->dateTimeTz('completed_at')->nullable();
            $table->unsignedInteger('odometer')->nullable();
            $table->string('vendor_name')->nullable();
            $table->decimal('cost', 12, 2)->default(0);
            $table->string('currency', 3)->default('USD');
            $table->text('description')->nullable();
            $table->dateTimeTz('next_due_at')->nullable();
            $table->unsignedInteger('next_due_odometer')->nullable();
            $table->string('external_source')->nullable()->index();
            $table->string('external_id')->nullable();
            $table->unique(['external_source', 'external_id']);
            $table->json('metadata')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['agency_id', 'status']);
            $table->index(['vehicle_id', 'scheduled_at']);
            $table->index(['vehicle_id', 'completed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('maintenances');
    }
};
