<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Volunteer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VolunteerController extends Controller
{
    public function joinProject(Request $request, $projectId)
    {
        $user = Auth::user();
        $project = Project::findOrFail($projectId);
    
        // Cek apakah proyek masih memiliki kapasitas
        if ($project->participant_count >= $project->required_participants) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Proyek sudah penuh'], 400);
            }
            return back()->with('error', 'Proyek sudah penuh');
        }
    
        // Cek apakah pengguna sudah menjadi relawan di proyek ini
        if (Volunteer::where('user_id', $user->id)->where('project_id', $project->id)->exists()) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Anda sudah terdaftar sebagai relawan'], 400);
            }
            return back()->with('error', 'Anda sudah terdaftar sebagai relawan');
        }
    
        // Tambahkan user sebagai relawan di proyek
        Volunteer::create([
            'user_id' => $user->id,
            'project_id' => $project->id,
            'joined_at' => now(),
        ]);
    
        // Update jumlah partisipan proyek
        $project->increment('participant_count');
    
        // Berikan respons JSON jika permintaan dilakukan via AJAX
        if ($request->wantsJson()) {
            return response()->json(['success' => 'Anda berhasil bergabung sebagai relawan']);
        }
    
        // Jika bukan permintaan AJAX, redirect dengan pesan sukses
        return back()->with('success', 'Anda berhasil bergabung sebagai relawan');
    }
    
    public function unfollowProject($projectId)
    {
        $user = Auth::user();
        $project = Project::findOrFail($projectId);
    
        // Cari entri Volunteer yang cocok dan hapus
        $volunteer = Volunteer::where('user_id', $user->id)
                              ->where('project_id', $projectId)
                              ->first();
    
        if ($volunteer) {
            $volunteer->delete();
            
            // Kurangi jumlah partisipan dalam proyek
            $project->decrement('participant_count');
    
            return back()->with('success', 'Anda berhasil membatalkan keikutsertaan dalam proyek.');
        }
    
        return back()->with('error', 'Anda tidak terdaftar dalam proyek ini.');
    }  
}
