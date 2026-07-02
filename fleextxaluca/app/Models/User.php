<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRole;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role_id',
        'agency_id',
        'external_source',
        'external_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roleSlug(): ?string
    {
        return $this->role?->slug;
    }

    /**
     * @param  UserRole|array<int, UserRole>|string|array<int, string>  $roles
     */
    public function hasAnyRole(UserRole|array|string $roles): bool
    {
        $roleSlug = $this->roleSlug();

        if ($roleSlug === null) {
            return false;
        }

        $allowedRoles = is_array($roles) ? $roles : [$roles];

        foreach ($allowedRoles as $role) {
            $slug = $role instanceof UserRole ? $role->value : $role;

            if ($roleSlug === $slug) {
                return true;
            }
        }

        return false;
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasAnyRole(UserRole::SuperAdmin);
    }

    public function isFleetManager(): bool
    {
        return $this->hasAnyRole(UserRole::FleetManager);
    }

    public function isReservationAgent(): bool
    {
        return $this->hasAnyRole(UserRole::ReservationAgent);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function agency(): BelongsTo
    {
        return $this->belongsTo(Agency::class);
    }
}
