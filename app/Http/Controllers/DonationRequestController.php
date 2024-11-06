<?php

namespace App\Http\Controllers;

use App\Models\DonationRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DonationRequestController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a list of donation requests pending admin approval.
     *
     * @return \Inertia\Response
     */
    public function adminIndex()
    {
        $donationRequests = Cache::remember('pending_donation_requests', 60, function () {
            return DonationRequest::where('status', 'pending')->get();
        });

        return Inertia::render('Admin/DonationRequestsList', [
            'donationRequests' => $donationRequests,
        ]);
    }

    /**
     * Display a listing of all donation requests.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $donationRequests = DonationRequest::all();

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

        // Clear the cache after updating status
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

        // Clear the cache after updating status
        Cache::forget('pending_donation_requests');

        return redirect()->back()->with('success', 'Permintaan donasi berhasil ditolak.');
    }

    /**
     * Display dashboard for donation receivers to manage their donation requests.
     *
     * @return \Inertia\Response
     */
    public function receiverDashboard()
    {
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
        // Validasi input sesuai dengan atribut yang diperlukan
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|string',
            'type' => 'required|string|in:uang,barang', // Misalnya hanya mendukung 'uang' dan 'barang'
            'target_amount' => 'nullable|numeric|min:1',
            'target_items' => 'nullable|numeric|min:1',
        ]);

        // Tambahkan data tambahan yang diperlukan untuk menyimpan permintaan donasi
        $donationRequestData = array_merge($validatedData, [
            'receiver_id' => Auth::id(), // Menggunakan ID user yang sedang login sebagai receiver_id
            'status' => 'pending', // Status default saat pertama kali dibuat
        ]);

        // Simpan data ke dalam database
        DonationRequest::create($donationRequestData);

        // Redirect ke dashboard receiver dengan pesan sukses
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
        return Inertia::render('Donations/DonationDetailPage', [
            'donationRequest' => $donationRequest,
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

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'required|string',
        ]);

        $donationRequest->update($validated);

        return redirect()->route('donation-receiver.dashboard')->with('message', 'Permintaan donasi berhasil diperbarui!');
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
