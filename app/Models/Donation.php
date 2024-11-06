<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    use HasFactory;

    protected $fillable = [
        'donation_request_id',
        'user_id',
        'type',
        'amount',
        'item_description',
        'item_image',
        'status',
    ];

    /**
     * Relasi ke DonationRequest.
     */
    public function donationRequest()
    {
        return $this->belongsTo(DonationRequest::class);
    }

    /**
     * Relasi ke User (Donatur).
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
