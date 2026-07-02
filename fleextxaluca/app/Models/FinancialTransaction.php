<?php

namespace App\Models;

use App\Enums\FinancialTransactionCategory;
use App\Enums\FinancialTransactionStatus;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class FinancialTransaction extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'agency_id',
        'vehicle_id',
        'reservation_id',
        'maintenance_id',
        'created_by_user_id',
        'transaction_number',
        'transaction_date',
        'direction',
        'category',
        'status',
        'amount',
        'currency',
        'description',
        'reference',
        'external_source',
        'external_id',
        'metadata',
    ];

    protected function casts(): array
    {
        return [
            'transaction_date' => 'datetime',
            'amount' => 'decimal:2',
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
                ->where('transaction_number', 'like', '%'.$search.'%')
                ->orWhere('description', 'like', '%'.$search.'%')
                ->orWhere('reference', 'like', '%'.$search.'%')
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
    public function scopeCategory(Builder $query, ?string $category): Builder
    {
        if ($category === null || $category === '') {
            return $query;
        }

        return $query->where('category', $category);
    }

    /**
     * @param  Builder<self>  $query
     */
    public function scopeDirection(Builder $query, ?string $direction): Builder
    {
        if ($direction === null || $direction === '') {
            return $query;
        }

        return $query->where('direction', $direction);
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
    public static function categoryOptions(): array
    {
        return array_map(static fn (FinancialTransactionCategory $category) => $category->value, FinancialTransactionCategory::all());
    }

    /**
     * @return array<int, string>
     */
    public static function statusOptions(): array
    {
        return array_map(static fn (FinancialTransactionStatus $status) => $status->value, FinancialTransactionStatus::all());
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function maintenance(): BelongsTo
    {
        return $this->belongsTo(Maintenance::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id');
    }
}
