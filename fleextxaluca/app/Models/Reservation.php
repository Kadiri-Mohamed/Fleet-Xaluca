<?php

namespace App\Models;

use App\Enums\ReservationStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Reservation extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'agency_id',
        'vehicle_id',
        'requested_by_user_id',
        'approved_by_user_id',
        'reservation_number',
        'status',
        'start_at',
        'end_at',
        'purpose',
        'notes',
        'checked_out_at',
        'checked_in_at',
        'external_source',
        'external_id',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'end_at' => 'datetime',
            'checked_out_at' => 'datetime',
            'checked_in_at' => 'datetime',
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
                ->where('reservation_number', 'like', '%'.$search.'%')
                ->orWhere('purpose', 'like', '%'.$search.'%')
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
    public function scopeOverlapping(Builder $query, string $startAt, string $endAt): Builder
    {
        return $query
            ->whereIn('status', ReservationStatus::blockingValues())
            ->where('start_at', '<', $endAt)
            ->where('end_at', '>', $startAt);
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function requestedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by_user_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by_user_id');
    }
}
