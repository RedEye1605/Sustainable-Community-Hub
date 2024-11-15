<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
use App\Models\Volunteer;
use App\Models\Donation;
use App\Models\DonationRequest;
use App\Models\RoleRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    public function dashboard()
    {
        $user = Auth::user();
        $projects = $user->projects;
        
        // Get participants (volunteers) for each project
        $participants = Volunteer::whereIn('project_id', $projects->pluck('id'))
            ->get();

        return Inertia::render('project-manager/Dashboard', [
            'projects' => $projects,
            'participants' => $participants
        ]);
    }
    
    public function userDashboard()
    {
        $user = Auth::user();
    
        // Dapatkan proyek yang diikuti pengguna
        $joinedProjects = Project::whereHas('volunteers', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->with('user')->get();
    
        // Dapatkan donasi yang dilakukan pengguna beserta data permintaan donasi
        $donations = Donation::where('user_id', $user->id)
            ->with(['donationRequest' => function ($query) {
                $query->with('donations.user');
            }])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($donation) {
                return [
                    'id' => $donation->id,
                    'donation_request_id' => $donation->donation_request_id,
                    'type' => $donation->type,
                    'amount' => $donation->amount,
                    'item_description' => $donation->item_description,
                    'status' => $donation->status,
                    'donationRequest' => [
                        'title' => $donation->donationRequest->title ?? 'Tidak Tersedia',
                        'collected_amount' => $donation->donationRequest->donations
                            ->where('type', 'uang')
                            ->sum('amount'),
                    ],
                ];
            });
    
        // Dapatkan permintaan role pengguna
        $roleRequests = RoleRequest::where('user_id', $user->id)->get();
    
        return Inertia::render('UserDashboard', [
            'projects' => $joinedProjects,
            'donations' => $donations,
            'roleRequests' => $roleRequests,
        ]);
    }

    /**
     * Display a listing of the resource (akses publik).
     */
    public function index()
    {
        $projects = Project::all(); // Semua proyek dapat dilihat di halaman 'ProjectList'

        return Inertia::render('ProjectList', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new resource (hanya untuk admin).
     */
    public function create()
    {
        $this->authorize('create', Project::class);
        return Inertia::render('Proyek/CreateProjectPage');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Memastikan pengguna memiliki izin untuk membuat proyek berdasarkan perannya
        $this->authorize('create', Project::class); 
        
        // Validasi data input
        $validatedData = $request->validate([
            'namaProyek' => 'required|max:100',
            'deskripsiProyek' => 'nullable',
            'statusProyek' => 'required|boolean',
            'start_date' => 'nullable|date',
            'required_participants' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Handle upload gambar jika ada
        $imageUrl = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('images/projects', 'public');
            $imageUrl = Storage::url($imagePath);
        }

        // Buat proyek baru dan tetapkan user_id untuk pengelola
        Project::create([
            'namaProyek' => $validatedData['namaProyek'],
            'deskripsiProyek' => $validatedData['deskripsiProyek'],
            'statusProyek' => $validatedData['statusProyek'],
            'start_date' => $request->start_date,
            'required_participants' => $request->required_participants,
            'participant_count' => 0,
            'imageUrl' => $imageUrl,
            'user_id' => Auth::id(), // Set owner proyek sebagai pengguna yang sedang login
        ]);

        // Periksa apakah pengguna memiliki peran 'pengelola' tanpa method hasRole
        $userRoles = Auth::user()->roles->pluck('name')->toArray();
        if (in_array('pengelola proyek', $userRoles)) {
            return redirect()->route('project-manager.dashboard')->with('success', 'Proyek berhasil ditambahkan.');
        } else {
            return redirect()->route('projects.index')->with('success', 'Proyek berhasil ditambahkan.');
        }
    }

    /**
     * Display the specified resource (akses publik).
     */
    public function show(Project $project)
    {
        $user = Auth::user();
        $isVolunteer = $user ? $project->volunteers()->where('user_id', $user->id)->exists() : false;

        return Inertia::render('Proyek/DetailProyek', [
            'project' => $project,
            'isVolunteer' => $isVolunteer,
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
            'statusProyek' => 'required|boolean',
            'start_date' => 'nullable|date',
            'required_participants' => 'required|integer|min:1',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
    
        // Update data proyek dan handle upload gambar baru
        $project->namaProyek = $validatedData['namaProyek'];
        $project->deskripsiProyek = $validatedData['deskripsiProyek'];
        $project->statusProyek = $validatedData['statusProyek'];
        $project->start_date = $validatedData['start_date'];
        $project->required_participants = $validatedData['required_participants'];
    
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
