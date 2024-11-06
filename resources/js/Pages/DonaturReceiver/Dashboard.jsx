import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';

export default function DashboardDonationReceiverPage() {
    const { donationRequests: initialRequests } = usePage().props;
    const [donationRequests, setDonationRequests] = useState(initialRequests);

    const handleDelete = (id) => {
        if (!confirm('Yakin ingin menghapus permintaan ini?')) return;

        router.delete(route('donation-requests.destroy', id), {
            onSuccess: () => {
                alert('Permintaan donasi berhasil dihapus!');
                setDonationRequests(donationRequests.filter((request) => request.id !== id));
            },
            onError: (errors) => {
                console.error("Error deleting request:", errors);
                alert(errors.message || 'Gagal menghapus permintaan.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold leading-tight text-gray-800">Dashboard Donatur Receiver</h2>}
        >
            <Head title="Donatur Receiver Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-12">

                    {/* Donation Requests List */}
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg p-6 relative">
                        <h3 className="text-2xl font-bold mb-6 text-gray-700">Daftar Permintaan Donasi</h3>

                        {/* Tombol untuk membuat permintaan donasi baru di pojok kanan atas */}
                        <div className="absolute top-6 right-6">
                            <Link
                                href={route('donation-requests.create')}
                                className="px-4 py-2 bg-[#FF2D20] text-white font-semibold rounded-lg hover:bg-[#e0241c] transition ease-in-out duration-150"
                            >
                                Buat Permintaan Donasi Baru
                            </Link>
                        </div>

                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {donationRequests.length > 0 ? (
                                        donationRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                <td className="px-6 py-4 border-b">{request.title}</td>
                                                <td className="px-6 py-4 border-b">{request.description.substring(0, 50)}...</td>
                                                <td className="px-6 py-4 border-b flex space-x-4">
                                                    <Link
                                                        href={route('donation-requests.edit', request.id)}
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(request.id)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 text-center text-gray-500">Tidak ada permintaan donasi baru.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
