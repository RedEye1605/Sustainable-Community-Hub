<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\VolunteerController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\DonationRequestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Routes for viewing projects and donation requests without login
Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
Route::get('projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
Route::get('donation-requests', [DonationRequestController::class, 'index'])->name('donation-requests.index');
Route::get('/donation-requests/{donation_request}', [DonationRequestController::class, 'show'])->name('donation-requests.show');

// Welcome Page Route
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('home');

// Authenticated User Dashboard Routes (requires auth and email verification)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [ProjectController::class, 'userDashboard'])->name('dashboard');

    Route::get('/UserDashboard', [DonationController::class, 'myDonations'])->name('donations.myDonations');
    
    // User Donation Routes
    Route::prefix('donations')->name('donations.')->group(function () {
        Route::get('/{donationRequestId}/DonationFormPage', [DonationController::class, 'create'])->name('create'); // Display form to create donation
        Route::post('/store/{donationRequestId}', [DonationController::class, 'store'])->name('store'); // Store donation
        Route::get('/{donation}/edit', [DonationController::class, 'edit'])->name('edit'); // Edit donation
        Route::put('/{donation}', [DonationController::class, 'update'])->name('update'); // Update donation
        Route::delete('/{donation}', [DonationController::class, 'destroy'])->name('destroy'); // Delete donation
        Route::get('/{donation}', [DonationController::class, 'show'])->name('show'); // Show donation details
    });
});

// Admin Routes for full access, excluding index and show actions
Route::middleware(['auth', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::post('/assign-role', [AdminController::class, 'assignRole'])->name('admin.assign-role');
    Route::post('/unassign-role', [AdminController::class, 'unassignRole'])->name('admin.unassign-role');
    
    // Admin-specific donation request management routes
    Route::get('/donation-requests', [DonationRequestController::class, 'adminIndex'])->name('admin.donation-requests.index');
    Route::put('/donation-requests/{id}/approve', [DonationRequestController::class, 'approve'])->name('admin.donation-requests.approve');
    Route::put('/donation-requests/{id}/reject', [DonationRequestController::class, 'reject'])->name('admin.donation-requests.reject');
});

// Project Manager Routes for managing their own projects
Route::middleware(['auth', 'role:pengelola proyek'])->prefix('project-manager')->group(function () {
    Route::get('/dashboard', [ProjectController::class, 'dashboard'])->name('project-manager.dashboard');
});

// Donation Receiver Routes for managing donation requests (requires auth and 'donation_receiver' role)
Route::middleware(['auth', 'role:donatur receiver'])->group(function () {
    Route::get('/donaturReceiver/dashboard', [DonationRequestController::class, 'receiverDashboard'])->name('donation-receiver.dashboard');
    
    // Donation request creation, editing, and deletion routes
    Route::post('/donation-requests', [DonationRequestController::class, 'store'])->name('donation-requests.store');
    Route::get('/donation-requests/{donation_request}/edit', [DonationRequestController::class, 'edit'])->name('donation-requests.edit');
    Route::put('/donation-requests/{donation_request}', [DonationRequestController::class, 'update'])->name('donation-requests.update');
    Route::delete('/donation-requests/{donation_request}', [DonationRequestController::class, 'destroy'])->name('donation-requests.destroy');
    Route::get('/Donations/CreateRequestPage', [DonationRequestController::class, 'create'])->name('donation-requests.create');
});

// Profile Management Routes (requires authentication)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Project management routes (for users with access)
    Route::get('/Proyek/CreateProjectPage', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('/Proyek/{project}/ProjectEdit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::put('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    
    Route::post('/projects/{projectId}/join', [VolunteerController::class, 'joinProject'])->name('projects.join');
    Route::post('/projects/{projectId}/unfollow', [VolunteerController::class, 'unfollowProject'])->name('projects.unfollow');
});

// Standard Laravel Authentication Routes
require __DIR__.'/auth.php';
