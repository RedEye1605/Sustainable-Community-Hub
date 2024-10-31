<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProjectController extends Controller
{
    use AuthorizesRequests;
    /**
     * Display a listing of the resource (akses publik).
     */
    public function index()
    {
        $projects = Project::all();
        return Inertia::render('ProjectList', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource (hanya untuk admin).
     */
    public function create()
    {
        $this->authorize('create', Project::class); // Policy untuk admin
        return Inertia::render('Proyek/CreateProjectPage');
    }

    /**
     * Store a newly created resource in storage (hanya untuk admin).
     */
    public function store(Request $request)
    {
        $this->authorize('create', Project::class); // Policy untuk admin
        
        $validatedData = $request->validate([
            'namaProyek' => 'required|max:100',
            'deskripsiProyek' => 'nullable',
            'statusProyek' => 'required|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle upload gambar jika ada
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imageUrl = $request->file('image')->store('images/projects', 'public');
        }

        // Buat proyek baru
        Project::create([
            'namaProyek' => $validatedData['namaProyek'],
            'deskripsiProyek' => $validatedData['deskripsiProyek'],
            'statusProyek' => $validatedData['statusProyek'],
            'imageUrl' => $imageUrl ? Storage::url($imageUrl) : null,
        ]);

        return redirect()->route('projects.index')->with('success', 'Proyek berhasil ditambahkan.');
    }

    /**
     * Display the specified resource (akses publik).
     */
    public function show(Project $project)
    {
        return Inertia::render('Proyek/DetailProyek', [
            'project' => $project,
            'flash' => session('success'),
        ]);
    }

    /**
     * Show the form for editing the specified resource (hanya untuk admin).
     */
    public function edit(Project $project)
    {
        $this->authorize('update', $project); // Policy untuk admin
        return Inertia::render('Proyek/ProjectEdit', [
            'project' => $project,
        ]);
    }

    /**
     * Update the specified resource in storage (hanya untuk admin).
     */
    public function update(Request $request, Project $project)
    {
        $this->authorize('update', $project); // Policy untuk admin

        $validatedData = $request->validate([
            'namaProyek' => 'required|max:100',
            'deskripsiProyek' => 'nullable',
            'statusProyek' => 'required|max:50',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        // Update data proyek dan handle upload gambar baru
        $project->namaProyek = $validatedData['namaProyek'];
        $project->deskripsiProyek = $validatedData['deskripsiProyek'];
        $project->statusProyek = $validatedData['statusProyek'];
    
        if ($request->hasFile('image')) {
            if ($project->imageUrl) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $project->imageUrl));
            }
    
            $imageUrl = $request->file('image')->store('images/projects', 'public');
            $project->imageUrl = Storage::url($imageUrl);
        }
    
        $project->save();
    
        return redirect()->route('projects.index')->with('success', 'Proyek berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage (hanya untuk admin).
     */
    public function destroy(Project $project)
    {
        $this->authorize('delete', $project); // Policy untuk admin

        // Hapus gambar dari storage jika ada
        if ($project->imageUrl && Storage::disk('public')->exists(str_replace('/storage/', '', $project->imageUrl))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $project->imageUrl));
        }

        // Hapus proyek
        $project->delete();

        return redirect()->route('projects.index')->with('success', 'Proyek berhasil dihapus.');
    }
}
