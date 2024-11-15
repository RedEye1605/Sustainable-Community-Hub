<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RoleRequest;
use Illuminate\Support\Facades\Auth;

class RoleRequestController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'requested_role' => 'required|string',
            'reason' => 'required|string',
        ]);

        RoleRequest::create([
            'user_id' => Auth::id(),
            'requested_role' => $validatedData['requested_role'],
            'reason' => $validatedData['reason'],
            'status' => 'pending',
        ]);

        return redirect()->back()->with('success', 'Permintaan role berhasil diajukan.');
    }
}