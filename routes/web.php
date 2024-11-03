<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Rute publik untuk melihat daftar proyek dan detail proyek tanpa login
Route::resource('projects', ProjectController::class)->only(['index', 'show']);

// Rute untuk Welcome Page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Rute untuk Admin (akses penuh ke semua action kecuali `index` dan `show`)
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::post('/assign-role', [AdminController::class, 'assignRole'])->name('admin.assign-role');
    Route::post('/unassign-role', [AdminController::class, 'unassignRole'])->name('admin.unassign-role');
    Route::resource('projects', ProjectController::class)->except(['index', 'show']);
});

// Rute untuk Pengelola Proyek (akses terbatas ke tindakan proyek mereka sendiri)
Route::middleware(['auth', 'role:pengelola proyek'])->prefix('project-manager')->group(function () {
    Route::get('/dashboard', [ProjectController::class, 'dashboard'])->name('project-manager.dashboard');
    Route::resource('projects', ProjectController::class)->except(['index', 'show']);
});

// Rute Dashboard untuk Pengguna Biasa (memerlukan autentikasi dan verifikasi email)
Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    return Inertia::render('UserDashboard');
})->name('dashboard');

// Rute untuk Manajemen Profil (akses login diperlukan)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Autentikasi standar Laravel
require __DIR__.'/auth.php';
