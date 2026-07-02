<?php

namespace App\Models;

use App\Enums\VehicleStatus;
use Illuminate\Database\Eloquent\Builder;
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

    /**
     * @param  Builder<self>  $query
     */
    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if ($search === null || $search === '') {
            return $query;
        }

        return $query->where(function (Builder $builder) use ($search) {
            $builder
                ->where('unit_number', 'like', '%'.$search.'%')
                ->orWhere('plate_number', 'like', '%'.$search.'%')
                ->orWhere('vin', 'like', '%'.$search.'%')
                ->orWhere('make', 'like', '%'.$search.'%')
                ->orWhere('model', 'like', '%'.$search.'%');
        });
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeStatus(Builder $query, ?string $status): Builder
    {
        if ($status === null || $status === '') {
            return $query;
        }

        return $query->where('status', $status);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeVehicleType(Builder $query, ?string $vehicleType): Builder
    {
        if ($vehicleType === null || $vehicleType === '') {
            return $query;
        }

        return $query->where('vehicle_type', $vehicleType);
    }

    /**
     * @return array<int, string>
     */
    public static function statusOptions(): array
    {
        return array_map(static fn (VehicleStatus $status) => $status->value, VehicleStatus::all());
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
