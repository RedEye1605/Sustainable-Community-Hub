import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function DonationDetailPage() {
    const { donationRequest, donors = [] } = usePage().props;

    const totalCollected = donationRequest.collected_amount || 0;
    const target = donationRequest.type === 'uang'
        ? donationRequest.target_amount
        : donationRequest.target_items;
    const progressPercentage = Math.min((totalCollected / target) * 100, 100).toFixed(2);

    // Format currency to display with `.000` suffix
    const formatCurrency = (amount) => {
        const integerAmount = Math.floor(amount); // Ensure we're working with an integer
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(integerAmount) + '.000'; // Append .000 to match Indonesian currency format
    };

    return (
        <div className="min-h-screen p-6 lg:p-12 bg-gradient-to-r from-green-100 to-green-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400 w-full max-w-3xl">
                <Link href="/" className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <Link href={route('donation-requests.index')} className="hover:underline">Daftar Donasi</Link>
                <span className="mx-2">/</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">{donationRequest.title}</span>
            </nav>

            {/* Title */}
            <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
                {donationRequest.title}
            </h1>

            {/* Donation Request Details */}
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl space-y-6">
                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                    {donationRequest.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center space-x-3">
                    <span className="px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded">
                        Tipe: {donationRequest.type === 'uang' ? 'Uang' : 'Barang'}
                    </span>
                    {donationRequest.type !== 'uang' && (
                        <span className="px-3 py-1 text-sm font-semibold bg-yellow-100 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 rounded">
                            Kategori: {donationRequest.category}
                        </span>
                    )}
                    <span className="px-3 py-1 text-sm font-semibold bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200 rounded">
                        Target: {donationRequest.type === 'uang' ? formatCurrency(target) : `${target} Barang`}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Total Terkumpul</h3>
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                        {donationRequest.type === 'uang'
                            ? `${formatCurrency(totalCollected)} terkumpul dari target`
                            : `${totalCollected} Barang terkumpul dari target`}
                    </p>
                    <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-6">
                        <div
                            className="bg-green-500 h-6 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {progressPercentage}% tercapai
                    </p>
                </div>

                {/* Donor Information */}
                <div className="mt-10">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Daftar Donatur</h3>
                    {donors.length > 0 ? (
                        <ul className="space-y-4">
                            {donors.map((donor) => (
                                <li
                                    key={donor.id}
                                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg text-gray-800 dark:text-gray-200 font-semibold">{donor.name}</p>
                                        <p className="text-lg text-gray-700 dark:text-gray-300">
                                            {donor.donation_type === 'uang'
                                                ? formatCurrency(donor.amount)
                                                : `${donor.amount} Barang`}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600 dark:text-gray-400">Belum ada donatur.</p>
                    )}
                </div>

                {/* Call to Action */}
                <div className="flex justify-center mt-12">
                    <Link
                        href={route('donations.create', { donationRequestId: donationRequest.id })}
                        className="px-12 py-4 bg-indigo-500 text-white text-lg font-bold rounded-full shadow-md hover:bg-indigo-600 transition duration-300"
                    >
                        Donasi Sekarang
                    </Link>
                </div>
            </div>
        </div>
    );
}
