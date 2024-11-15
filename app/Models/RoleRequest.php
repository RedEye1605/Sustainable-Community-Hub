<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleRequest extends Model
{
    protected $fillable = [
        'user_id',
        'requested_role',
        'status',
        'reason'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}