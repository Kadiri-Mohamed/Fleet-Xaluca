<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('role_id')->nullable()->after('id')->constrained('roles')->nullOnDelete();
            $table->foreignId('agency_id')->nullable()->after('role_id')->constrained('agencies')->nullOnDelete();
            $table->string('phone', 30)->nullable()->after('email');
            $table->string('external_source')->nullable()->after('phone')->index();
            $table->string('external_id')->nullable()->after('external_source');
            $table->unique(['external_source', 'external_id']);
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['external_source', 'external_id']);
            $table->dropConstrainedForeignId('agency_id');
            $table->dropConstrainedForeignId('role_id');
            $table->dropColumn(['phone', 'external_source', 'external_id', 'deleted_at']);
        });
    }
};
