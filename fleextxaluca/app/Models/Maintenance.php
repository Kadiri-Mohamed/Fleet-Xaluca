<?php

namespace App\Models;

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
