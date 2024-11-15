import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage, router} from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function Dashboard({ projects, donations, roleRequests }) {
    const [loadingProjectId, setLoadingProjectId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [showRoleRequestForm, setShowRoleRequestForm] = useState(false);
    const { data, setData, post, reset, errors } = useForm({
        requested_role: '',
        reason: '',
    });

    const handleDeleteDonation = async (donationId) => {
        if (confirm('Apakah Anda yakin ingin menghapus donasi ini?')) {
            try {
                await router.delete(route('donations.destroy', donationId), {
                    onSuccess: () => alert('Donasi berhasil dihapus.'),
                    onError: () => alert('Terjadi kesalahan saat menghapus donasi.')
                });
            } catch (error) {
                console.error('Delete error:', error);
            }
        }
    };

    const handleUnfollowProject = async (projectId) => {
        if (confirm('Apakah Anda yakin ingin membatalkan keikutsertaan Anda dalam proyek ini?')) {
            setLoadingProjectId(projectId);
            try {
                await router.post(route('projects.unfollow', projectId));
                // Handle success
            } catch (error) {
                alert('Terjadi kesalahan saat membatalkan keikutsertaan.');
            } finally {
                setLoadingProjectId(null);
            }
        }
    };

    const handleRoleRequestSubmit = (e) => {
        e.preventDefault();
        post(route('role-requests.store'), {
            onSuccess: () => {
                reset();
                setShowRoleRequestForm(false);
            },
        });
    };

    const filteredDonations = donations.filter((donation) => 
        statusFilter === 'all' || donation.status === statusFilter
    );

    const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold leading-tight text-gray-800">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-12">

                    {/* Projects Section */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Proyek yang Anda Ikuti</h3>
                        {projects.length > 0 ? (
                            <ul className="space-y-4">
                                {projects.map((project) => (
                                    <li key={project.id} className="p-4 bg-gray-100 rounded-md shadow-sm transition duration-200 hover:bg-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800">
                                                    <Link href={route('projects.show', project.id)} className="text-blue-600 hover:underline">
                                                        {project.namaProyek}
                                                    </Link>
                                                </h4>
                                                <p className="text-gray-600 mb-2">{project.deskripsiProyek}</p>
                                                <span
                                                    className={`inline-block px-2 py-1 rounded text-sm ${
                                                        project.statusProyek ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                                    }`}
                                                >
                                                    Status: {project.statusProyek ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleUnfollowProject(project.id)}
                                                disabled={loadingProjectId === project.id}
                                                className={`px-4 py-2 text-sm font-medium text-white rounded-lg shadow-md focus:outline-none transition ${
                                                    loadingProjectId === project.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
                                                }`}
                                            >
                                                {loadingProjectId === project.id ? 'Membatalkan...' : 'Batalkan Keikutsertaan'}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600">Anda belum bergabung dalam proyek apa pun.</p>
                        )}
                    </div>

                    {/* Donations Section */}
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Donasi yang Anda Lakukan</h3>

                        {/* Donation Status Filter */}
                        <div className="flex items-center justify-between mb-4">
                            <label className="mr-2 text-gray-600 font-semibold">Filter Status:</label>
                            <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg p-2"
                            >
                                <option value="all">Semua</option>
                                <option value="pending">Menunggu</option>
                                <option value="approved">Disetujui</option>
                                <option value="rejected">Ditolak</option>
                            </select>
                        </div>

                        {/* Donation List */}
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Donasi Untuk</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Tipe</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Deskripsi / Jumlah</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDonations.length > 0 ? (
                                        filteredDonations.map((donation) => (
                                            <tr key={donation.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                <td className="px-6 py-4 border-b">
                                                    <Link href={route('donation-requests.show', donation.donation_request_id)} className="text-blue-600 hover:underline">
                                                        {donation.donationRequest && donation.donationRequest.title ? donation.donationRequest.title : 'Tidak Tersedia'}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 border-b">{donation.type === 'uang' ? 'Uang' : 'Barang'}</td>
                                                <td className="px-6 py-4 border-b">
                                                    {donation.type === 'uang' ? formatCurrency(donation.amount) : donation.item_description}
                                                </td>
                                                <td className="px-6 py-4 border-b">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                                                        donation.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        donation.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 border-b space-x-2">
                                                    {/* Show Detail Button */}
                                                    <Link
                                                        href={route('donation-requests.show', donation.donation_request_id)}
                                                        className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-150 ease-in-out"
                                                    >
                                                        Lihat Detail
                                                    </Link>
                                                    {/* <button
                                                        onClick={() => handleDeleteDonation(donation.id)}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out"
                                                    >
                                                        Hapus
                                                    </button> */}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">Anda belum melakukan donasi apa pun.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Role Request Section */}
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Status Permintaan Role Anda</h3>
                        {roleRequests.length > 0 ? (
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Role yang Diminta</th>
                                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Status</th>
                                        <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-500">Alasan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roleRequests.map((request) => (
                                        <tr key={request.id}>
                                            <td className="px-6 py-4 border-b">{request.requested_role}</td>
                                            <td className="px-6 py-4 border-b capitalize">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                                                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 border-b">{request.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="mt-4 text-gray-600">Anda belum mengajukan permintaan role.</p>
                        )}

                        {/* Tombol untuk Memunculkan Form Pengajuan Role */}
                        <div className="mt-4">
                            <button
                                onClick={() => setShowRoleRequestForm(!showRoleRequestForm)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
                            >
                                {showRoleRequestForm ? 'Tutup Form' : 'Ajukan Permintaan Role Baru'}
                            </button>
                        </div>

                        {/* Form untuk Permintaan Role Baru */}
                        {showRoleRequestForm && (
                            <div className="mt-8">
                                <h3 className="text-xl font-bold mb-4 text-gray-800">Ajukan Permintaan Role Baru</h3>
                                <form onSubmit={handleRoleRequestSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="requested_role" className="block text-sm font-medium text-gray-700">Role yang Diminta</label>
                                        <select
                                            id="requested_role"
                                            name="requested_role"
                                            value={data.requested_role}
                                            onChange={(e) => setData('requested_role', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        >
                                            <option value="">Pilih Role</option>
                                            <option value="pengelola proyek">Pengelola Proyek</option>
                                            <option value="donatur receiver">Donatur Receiver</option>
                                        </select>
                                        {errors.requested_role && <p className="mt-2 text-sm text-red-600">{errors.requested_role}</p>}
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Alasan</label>
                                        <textarea
                                            id="reason"
                                            name="reason"
                                            value={data.reason}
                                            onChange={(e) => setData('reason', e.target.value)}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                        {errors.reason && <p className="mt-2 text-sm text-red-600">{errors.reason}</p>}
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
                                        >
                                            Ajukan Permintaan
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}