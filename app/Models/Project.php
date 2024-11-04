<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'namaProyek',
        'deskripsiProyek',
        'statusProyek',
        'imageUrl',
        'user_id',
        'required_participants',
        'participant_count',
        'start_date' 
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function volunteers()
    {
        return $this->hasMany(Volunteer::class);
    }
}