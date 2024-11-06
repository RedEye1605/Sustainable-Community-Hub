<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DonationRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'receiver_id',
        'status',
        'type',
        'target_amount',
        'target_items',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function donations()
    {
        return $this->hasMany(Donation::class);
    }
}
