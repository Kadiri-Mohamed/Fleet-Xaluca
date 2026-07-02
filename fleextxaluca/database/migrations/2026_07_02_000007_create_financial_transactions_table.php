<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->cascadeOnDelete();
            $table->foreignId('vehicle_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('reservation_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('maintenance_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('created_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('transaction_number')->unique();
            $table->dateTimeTz('transaction_date');
            $table->string('direction');
            $table->string('category');
            $table->string('status')->default('posted');
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('USD');
            $table->text('description')->nullable();
            $table->string('reference')->nullable();
            $table->string('external_source')->nullable()->index();
            $table->string('external_id')->nullable();
            $table->unique(['external_source', 'external_id']);
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['agency_id', 'transaction_date']);
            $table->index(['vehicle_id', 'transaction_date']);
            $table->index(['reservation_id', 'transaction_date']);
            $table->index(['maintenance_id', 'transaction_date']);
            $table->index(['direction', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_transactions');
    }
};
