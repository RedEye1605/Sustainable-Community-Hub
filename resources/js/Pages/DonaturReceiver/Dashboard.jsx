import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { route } from 'ziggy-js';

export default function DashboardDonationReceiverPage() {
    const { donationRequests: initialRequests } = usePage().props;
    const [donationRequests, setDonationRequests] = useState(initialRequests);
    const [statusFilter, setStatusFilter] = useState('all'); // State to filter by status

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

    // Filter requests based on status
    const filteredRequests = donationRequests.filter((request) =>
        statusFilter === 'all' || request.status === statusFilter
    );

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold leading-tight text-gray-800">Dashboard Donatur Receiver</h2>}
        >
            <Head title="Donatur Receiver Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-12">
                    
                    {/* Status Filter */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-2xl font-bold text-gray-700">Daftar Permintaan Donasi</h3>
                        <div>
                            <label className="mr-2 text-gray-600 font-semibold">Filter Status:</label>
                            <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2"
                            >
                                <option value="all">Semua</option>
                                <option value="approved">Disetujui</option>
                                <option value="rejected">Ditolak</option>
                                <option value="pending">Menunggu</option>
                            </select>
                        </div>
                    </div>

                    {/* Create New Donation Request Button */}
                    <div className="relative">
                        <Link
                            href={route('donation-requests.create')}
                            className="absolute right-0 px-4 py-2 bg-[#FF2D20] text-white font-semibold rounded-lg hover:bg-[#e0241c] transition ease-in-out duration-150"
                        >
                            Buat Permintaan Donasi Baru
                        </Link>
                    </div>

                    {/* Donation Requests List */}
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg p-6">
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Judul</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRequests.length > 0 ? (
                                        filteredRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                <td className="px-6 py-4 border-b">{request.title}</td>
                                                <td className="px-6 py-4 border-b">
                                                    {request.type === 'uang' ? (
                                                        <p>Rp {request.collected_amount} / Rp {request.target_amount}</p>
                                                    ) : (
                                                        <p>{request.collected_amount} Barang / {request.target_items} Barang</p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 border-b">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                                                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 border-b flex space-x-4">
                                                    <Link
                                                        href={route('donation-requests.show', request.id)}
                                                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-150 ease-in-out"
                                                    >
                                                        Lihat
                                                    </Link>
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
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Tidak ada permintaan donasi dengan status ini.</td>
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
