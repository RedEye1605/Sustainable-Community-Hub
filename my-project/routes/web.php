<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;

// Rute untuk Admin Dashboard (memerlukan autentikasi dan role admin)
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::post('/admin/assign-role', [AdminController::class, 'assignRole'])->name('admin.assign-role');
});

// Rute untuk Welcome Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Rute Dashboard untuk Pengguna Biasa (memerlukan autentikasi dan verifikasi email)
Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    return Inertia::render('UserDashboard'); // Sesuaikan dengan komponen dashboard yang tersedia
})->name('dashboard');

// Rute untuk Manajemen Proyek (akses login diperlukan)
Route::middleware('auth')->group(function () {
    Route::resource('projects', ProjectController::class)->except(['edit', 'destroy']);
    Route::get('projects/{project}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
});

// // Rute untuk Manajemen Proyek (akses login diperlukan)
// Route::middleware('auth')->group(function () {
//     Route::resource('projects', ProjectController::class)->except(['edit', 'destroy']);
//     Route::resource('projects', ProjectController::class)->only(['edit', 'destroy'])->middleware('auth');
// });

// Rute untuk Manajemen Profil (akses login diperlukan)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Autentikasi standar Laravel
require __DIR__.'/auth.php';
