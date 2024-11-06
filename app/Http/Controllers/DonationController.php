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
            'donationRequest' => $donationRequest, // Pass the specific donation request data
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

        // Prepare data for creation
        $donationData = [
            'donation_request_id' => $donationRequest->id,
            'user_id' => Auth::id(),
            'type' => $validatedData['type'],
            'status' => 'pending',
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

        Donation::create($donationData);

        return redirect()
            ->route('donation-requests.show', ['donation_request' => $donationRequestId])
            ->with('success', 'Donasi Anda berhasil disimpan dan menunggu persetujuan.');
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

        // Delete item image if it exists
        if ($donation->item_image && Storage::disk('public')->exists($donation->item_image)) {
            Storage::disk('public')->delete($donation->item_image);
        }

        $donation->delete();

        return redirect()->route('dashboard')->with('success', 'Donasi berhasil dihapus.');
    }
}
