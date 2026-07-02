<?php

namespace App\Models;

use App\Enums\MaintenanceStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Maintenance extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'agency_id',
        'vehicle_id',
        'created_by_user_id',
        'maintenance_number',
        'type',
        'status',
        'scheduled_at',
        'completed_at',
        'odometer',
        'vendor_name',
        'cost',
        'currency',
        'description',
        'next_due_at',
        'next_due_odometer',
        'external_source',
        'external_id',
        'metadata',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'completed_at' => 'datetime',
            'next_due_at' => 'datetime',
            'odometer' => 'integer',
            'next_due_odometer' => 'integer',
            'cost' => 'decimal:2',
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
                ->where('maintenance_number', 'like', '%'.$search.'%')
                ->orWhere('description', 'like', '%'.$search.'%')
                ->orWhere('vendor_name', 'like', '%'.$search.'%')
                ->orWhereHas('vehicle', function (Builder $vehicleQuery) use ($search) {
                    $vehicleQuery
                        ->where('unit_number', 'like', '%'.$search.'%')
                        ->orWhere('plate_number', 'like', '%'.$search.'%');
                });
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
    public function scopeVehicleId(Builder $query, ?string $vehicleId): Builder
    {
        if ($vehicleId === null || $vehicleId === '') {
            return $query;
        }

        return $query->where('vehicle_id', $vehicleId);
    }

    /**
     * @return array<int, string>
     */
    public static function statusOptions(): array
    {
        return array_map(static fn (MaintenanceStatus $status) => $status->value, MaintenanceStatus::all());
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
