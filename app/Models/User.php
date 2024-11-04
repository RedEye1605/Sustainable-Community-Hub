<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * Attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * Relasi ke proyek yang dimiliki oleh user.
     */
    public function projects()
    {
        return $this->hasMany(Project::class);
    }

    /**
     * Relasi many-to-many ke peran (roles) user.
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user', 'user_id', 'role_id');
    }

    /**
     * Mengecek apakah user memiliki peran tertentu.
     *
     * @param string $roleName
     * @return bool
     */
    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }

    /**
     * Relasi ke volunteer yang dilakukan oleh user.
     */
    public function volunteers()
    {
        return $this->hasMany(Volunteer::class);
    }

    /**
     * Relasi ke proyek yang diikuti oleh user sebagai volunteer.
     */
    public function volunteeredProjects()
    {
        return $this->belongsToMany(Project::class, 'volunteers')
                    ->withTimestamps();
    }

    /**
     * Attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Attributes that should be cast.
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
}
