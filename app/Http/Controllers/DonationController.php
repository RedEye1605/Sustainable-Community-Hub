<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use App\Models\DonationRequest;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DonationController extends Controller
{

    /**
     * Display the details of a donation request with all related donations.
     * Menampilkan detail dari permintaan donasi bersama dengan daftar donatur.
     *
     * @param int $donationRequestId
     * @return \Inertia\Response
     */
    public function myDonations()
    {
        $userId = Auth::id();
        $donations = Donation::where('user_id', $userId)
            ->with('donationRequest')
            ->orderBy('created_at', 'desc')
            ->get();
    
        return Inertia::render('UserDashboard', [
            'donations' => $donations,
        ]);
    }    
    
    /**
     * Display a listing of donations for the authenticated user.
     *
     * @return \Inertia\Response
     */
    public function userDonations()
    {
        $userId = Auth::id(); // Ambil ID pengguna yang sedang login

        // Ambil donasi dengan user_id sesuai pengguna login
        $donationRequests = Donation::where('user_id', $userId)
            ->with('donationRequest') // Memastikan relasi donationRequest dimuat
            ->get();

        return Inertia::render('DashboardDonationReceiverPage', [
            'donationRequests' => $donationRequests,
        ]);
    }

    /**
     * Display a listing of donations.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $donations = Donation::with(['donationRequest', 'user'])->get();

        return Inertia::render('Donations/DonationRequestsList', [
            'donations' => $donations,
        ]);
    }

    /**
     * Show the form for creating a new donation.
     *
     * @param int $donationRequestId
     * @return \Inertia\Response
     */
    public function create($donationRequestId)
    {
        $donationRequest = DonationRequest::findOrFail($donationRequestId);

        return Inertia::render('Donations/DonationFormPage', [
            'donationRequest' => $donationRequest,
        ]);
    }

    /**
     * Store a new donation in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $donationRequestId
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, $donationRequestId)
    {
        $donationRequest = DonationRequest::findOrFail($donationRequestId);

        // Validation rules based on type
        $rules = [
            'type' => 'required|in:uang,barang',
        ];

        if ($request->type === 'uang') {
            $rules['amount'] = 'required|numeric|min:1';
        } else {
            $rules['item_description'] = 'required|string|max:255';
            $rules['item_image'] = 'nullable|image|mimes:jpg,jpeg,png|max:2048';
        }

        $validatedData = $request->validate($rules);

        // Prepare data for creation with default status as 'approved'
        $donationData = [
            'donation_request_id' => $donationRequest->id,
            'user_id' => Auth::id(),
            'type' => $validatedData['type'],
            'status' => 'approved', // Set status to 'approved' by default
        ];

        // Add additional fields based on type
        if ($validatedData['type'] === 'uang') {
            $donationData['amount'] = $validatedData['amount'];
        } else {
            $donationData['item_description'] = $validatedData['item_description'];
            if ($request->hasFile('item_image')) {
                $donationData['item_image'] = $request->file('item_image')->store('donation_images', 'public');
            }
        }

        // Save the donation
        $donation = Donation::create($donationData);

        // Update collected amount in DonationRequest immediately without approval check
        if ($validatedData['type'] === 'uang') {
            $donationRequest->increment('collected_amount', $validatedData['amount']);
        } else {
            $donationRequest->increment('collected_amount', 1); // Increment by 1 for each item donated
        }

        return redirect()
            ->route('donation-requests.show', ['donation_request' => $donationRequestId])
            ->with('success', 'Donasi Anda berhasil disimpan.');
    }

    /**
     * Remove the specified donation from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        $donation = Donation::findOrFail($id);

        // Ensure only the owner can delete their donation
        if ($donation->user_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Adjust collected amount on deletion
        $donationRequest = $donation->donationRequest;
        if ($donation->type === 'uang' && $donation->amount) {
            $donationRequest->decrement('collected_amount', $donation->amount);
        } elseif ($donation->type === 'barang') {
            $donationRequest->decrement('collected_amount', 1);
        }

        // Delete item image if it exists
        if ($donation->item_image && Storage::disk('public')->exists($donation->item_image)) {
            Storage::disk('public')->delete($donation->item_image);
        }

        $donation->delete();

        return redirect()->route('dashboard')->with('success', 'Donasi berhasil dihapus.');
    }
}
