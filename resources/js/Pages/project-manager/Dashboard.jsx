import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import React from 'react';

export default function ProjectManagerDashboard() {
    const { projects = [], participants = [] } = usePage().props;

    const calculateProgress = (project) => {
        const projectParticipants = participants.filter(p => p.project_id === project.id).length;
        return Math.min((projectParticipants / project.required_participants * 100), 100);
    };

    const getParticipantCount = (project) => {
        return participants.filter(p => p.project_id === project.id).length;
    };

    const handleDelete = (projectId) => {
        if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
            router.delete(route('projects.destroy', projectId), {
                onSuccess: () => alert('Proyek berhasil dihapus!'),
                onError: () => alert('Gagal menghapus proyek. Silakan coba lagi.'),
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold leading-tight text-gray-800">Dashboard Pengelola Proyek</h2>}
        >
            <Head title="Dashboard Pengelola Proyek" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-700">Manage Your Projects</h3>

                        {/* Tombol Tambah Proyek */}
                        <div className="flex justify-end mb-6">
                            <Link
                                href={route('projects.create')}
                                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md shadow-md hover:bg-green-600 transition duration-200 ease-in-out"
                            >
                                Tambah Proyek
                            </Link>
                        </div>

                        {/* Projects Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Project Name</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Participants</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Target</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Progress</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id}>
                                            <td className="px-6 py-4 border-b">{project.namaProyek}</td>
                                            <td className="px-6 py-4 border-b">{project.statusProyek ? 'Active' : 'Inactive'}</td>
                                            <td className="px-6 py-4 border-b">
                                                {getParticipantCount(project)} / {project.required_participants}
                                            </td>
                                            <td className="px-6 py-4 border-b">{project.required_participants} orang</td>
                                            <td className="px-6 py-4 border-b">
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div 
                                                        className="bg-blue-600 h-2.5 rounded-full"
                                                        style={{ width: `${calculateProgress(project)}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 border-b flex space-x-3">
                                                <Link
                                                    href={route('projects.edit', project.id)}
                                                    className="px-5 py-2.5 bg-yellow-500 text-white font-semibold rounded-md shadow-md hover:bg-yellow-600 transition duration-200 ease-in-out"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(project.id)}
                                                    className="px-5 py-2.5 bg-red-500 text-white font-semibold rounded-md shadow-md hover:bg-red-600 transition duration-200 ease-in-out"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Jika tidak ada proyek */}
                            {projects.length === 0 && (
                                <div className="text-center py-6 text-gray-600">
                                    Tidak ada proyek yang ditemukan.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
