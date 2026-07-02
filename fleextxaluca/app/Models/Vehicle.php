<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Vehicle extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'agency_id',
        'unit_number',
        'plate_number',
        'vin',
        'make',
        'model',
        'year',
        'color',
        'vehicle_type',
        'fuel_type',
        'status',
        'odometer',
        'acquisition_date',
        'disposal_date',
        'external_source',
        'external_id',
        'metadata',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'year' => 'integer',
            'odometer' => 'integer',
            'acquisition_date' => 'date',
            'disposal_date' => 'date',
            'metadata' => 'array',
        ];
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function maintenances(): HasMany
    {
        return $this->hasMany(Maintenance::class);
    }

    public function financialTransactions(): HasMany
    {
        return $this->hasMany(FinancialTransaction::class);
    }
}
