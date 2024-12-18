<?php

namespace App\Http\Controllers;

use App\Models\DonationRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class DonationRequestController extends Controller
{
    /**
     * Display a list of donation requests pending admin approval.
     *
     * @return \Inertia\Response
     */
    public function adminIndex()
    {
        $donationRequests = Cache::remember('pending_donation_requests', 60, function () {
            return DonationRequest::where('status', 'pending')->with('user')->get();
        });

        return Inertia::render('Admin/DonationRequestsList', [
            'donationRequests' => $donationRequests,
        ]);
    }

    /**
     * Display a listing of all approved donation requests.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $donationRequests = DonationRequest::where('status', 'approved')->with('user')->get();

        return Inertia::render('Donations/DonationRequestList', [
            'donationRequests' => $donationRequests,
        ]);
    }

    /**
     * Approve a donation request.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve($id)
    {
        $donationRequest = DonationRequest::findOrFail($id);
        
        $donationRequest->update(['status' => 'approved']);
        Cache::forget('pending_donation_requests');

        return redirect()->back()->with('success', 'Permintaan donasi berhasil disetujui.');
    }

    /**
     * Reject a donation request.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject($id)
    {
        $donationRequest = DonationRequest::findOrFail($id);

        $donationRequest->update(['status' => 'rejected']);
        Cache::forget('pending_donation_requests');

        return redirect()->back()->with('success', 'Permintaan donasi berhasil ditolak.');
    }

    /**
     * Display dashboard for donation receivers showing only approved requests.
     *
     * @return \Inertia\Response
     */
    public function receiverDashboard()
    {
        // Menampilkan semua permintaan donasi yang diajukan oleh pengguna yang sedang login, tanpa memfilter status
        $donationRequests = DonationRequest::where('receiver_id', Auth::id())->get();

        return Inertia::render('DonaturReceiver/Dashboard', [
            'donationRequests' => $donationRequests,
        ]);        
    }

    /**
     * Show the form for creating a new donation request.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Donations/CreateRequestPage');
    }

    /**
     * Store a new donation request in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'type' => 'required|string|in:uang,barang',
            'target_amount' => 'nullable|numeric|min:1|required_if:type,uang',
            'target_items' => 'nullable|numeric|min:1|required_if:type,barang',
        ]);

        $donationRequestData = array_merge($validatedData, [
            'receiver_id' => Auth::id(),
            'status' => 'pending',
        ]);

        DonationRequest::create($donationRequestData);

        return redirect()
            ->route('donation-receiver.dashboard')
            ->with('success', 'Permintaan donasi berhasil dibuat dan menunggu persetujuan.');
    }

    /**
     * Show the form for editing a specific donation request.
     *
     * @param  \App\Models\DonationRequest  $donationRequest
     * @return \Inertia\Response
     */
    public function edit(DonationRequest $donationRequest)
    {
        return Inertia::render('Donations/EditRequestPage', [
            'donationRequest' => $donationRequest,
        ]);
    }

    /**
     * Display a specific donation request.
     *
     * @param  \App\Models\DonationRequest  $donationRequest
     * @return \Inertia\Response
     */
    public function show(DonationRequest $donationRequest)
    {
        $donationRequest->load('donations.user');

        // Mengelompokkan donasi berdasarkan user_id dan menghitung total donasi per pengguna
        $donors = $donationRequest->donations
            ->groupBy('user_id')
            ->map(function ($donationsByUser) {
                $user = $donationsByUser->first()->user;
                $totalAmount = $donationsByUser->where('type', 'uang')->sum('amount');
                $totalItems = $donationsByUser->where('type', '!=', 'uang')->count();

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'donation_type' => $donationsByUser->first()->type,
                    'amount' => $totalAmount > 0 ? $totalAmount : $totalItems,
                ];
            })
            ->values();

        return Inertia::render('Donations/DonationDetailPage', [
            'donationRequest' => $donationRequest,
            'donors' => $donors,
        ]);
    }

    /**
     * Update a specific donation request in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\DonationRequest  $donationRequest
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, DonationRequest $donationRequest)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'type' => 'required|string|in:uang,barang',
            'target_amount' => 'nullable|numeric|min:1|required_if:type,uang',
            'target_items' => 'nullable|numeric|min:1|required_if:type,barang',
        ]);

        $donationRequest->update($validatedData);

        return redirect()
            ->route('donation-receiver.dashboard')
            ->with('success', 'Permintaan donasi berhasil diperbarui.');
    }

    /**
     * Remove the specified donation request from storage.
     *
     * @param  \App\Models\DonationRequest  $donationRequest
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(DonationRequest $donationRequest)
    {
        $donationRequest->delete();

        return redirect()->route('donation-receiver.dashboard')->with('message', 'Permintaan donasi berhasil dihapus!');
    }
}
