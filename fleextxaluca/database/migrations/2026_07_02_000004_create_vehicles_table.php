<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('agency_id')->constrained()->cascadeOnDelete();
            $table->string('unit_number');
            $table->string('plate_number');
            $table->string('vin')->nullable();
            $table->string('make');
            $table->string('model');
            $table->unsignedSmallInteger('year')->nullable();
            $table->string('color')->nullable();
            $table->string('vehicle_type')->nullable();
            $table->string('fuel_type')->nullable();
            $table->string('status')->default('active');
            $table->unsignedInteger('odometer')->default(0);
            $table->date('acquisition_date')->nullable();
            $table->date('disposal_date')->nullable();
            $table->string('external_source')->nullable()->index();
            $table->string('external_id')->nullable();
            $table->unique(['external_source', 'external_id']);
            $table->json('metadata')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['agency_id', 'unit_number']);
            $table->unique(['agency_id', 'plate_number']);
            $table->unique(['agency_id', 'vin']);
            $table->index(['agency_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
