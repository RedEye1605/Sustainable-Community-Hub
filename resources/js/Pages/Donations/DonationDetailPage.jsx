import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function DonationDetailPage() {
    // Pastikan donations termasuk dalam destructuring props
    const { donationRequest, donations = [] } = usePage().props;

    // Log data to console for debugging
    console.log('donationRequest:', donationRequest);
    console.log('donations:', donations); // Pastikan ini menampilkan array dengan user data

    // Total terkumpul dan persentase progres
    const totalCollected = donationRequest.collected_amount;
    const target = donationRequest.type === 'uang' ? donationRequest.target_amount : donationRequest.target_items;
    const progressPercentage = Math.min((totalCollected / target) * 100, 100).toFixed(2);

    return (
        <div className="min-h-screen p-6 lg:p-12 bg-gradient-to-r from-green-200 to-green-400 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400 w-full max-w-3xl">
                <Link href="/" className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <Link href={route('donation-requests.index')} className="hover:underline">Daftar Donasi</Link>
                <span className="mx-2">/</span>
                <span>{donationRequest.title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
                {donationRequest.title}
            </h1>

            {/* Donation Request Details */}
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{donationRequest.description}</p>

                {/* Tags for Category and Target */}
                <div className="flex flex-wrap items-center space-x-4">
                    <span className="inline-block px-2 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded">
                        Tipe Donasi: {donationRequest.type === 'uang' ? 'Uang' : 'Barang'}
                    </span>
                    {donationRequest.type !== 'uang' && (
                        <span className="inline-block px-2 py-1 text-sm font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded">
                            Kategori: {donationRequest.category}
                        </span>
                    )}
                    <span className="inline-block px-2 py-1 text-sm font-semibold bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 rounded">
                        Target: {donationRequest.type === 'uang' ? `Rp ${donationRequest.target_amount}` : `${donationRequest.target_items} Barang`}
                    </span>
                </div>

                {/* Collected Amount/Items with Progress Bar */}
                <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Total Terkumpul:</h3>
                    <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
                        {donationRequest.type === 'uang' ? `Rp ${totalCollected}` : `${totalCollected} Barang`} terkumpul dari target
                    </p>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                        <div
                            className="bg-green-500 h-4 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{progressPercentage}% tercapai</p>
                </div>

                {/* Donations Breakdown */}
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Daftar Donatur</h3>
                    {donations.length > 0 ? (
                        <ul className="space-y-4">
                            {donations.map((donation) => (
                                <li key={donation.id} className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md">
                                    <div className="flex flex-col md:flex-row justify-between">
                                        {/* Donor Information */}
                                        <div>
                                            <p className="text-gray-800 dark:text-gray-200 font-semibold">
                                                {donation.user?.name || 'Anonymous'}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {donation.type === 'uang' 
                                                    ? `Donasi Uang: Rp ${donation.amount}` 
                                                    : `Donasi Barang: ${donation.item_description}`
                                                }
                                            </p>
                                        </div>
                                        {/* Status Label */}
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                                            donation.status === 'approved' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        } mt-2 md:mt-0`}>
                                            {donation.status === 'approved' ? 'Approved' : 'Pending'}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">Belum ada donatur.</p>
                    )}
                </div>

                {/* Donation Call to Action */}
                <div className="flex justify-center mt-10">
                    <Link
                        href={route('donations.create', { donationRequestId: donationRequest.id })}
                        className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                    >
                        Donasi Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
}
