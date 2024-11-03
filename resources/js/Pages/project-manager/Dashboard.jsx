import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import React from 'react';

export default function ProjectManagerDashboard() {
    const { projects = [] } = usePage().props; // Mendapatkan daftar proyek dari props
    const { csrf_token } = usePage().props;

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
                                className="px-5 py-2 bg-green-500 text-white rounded-full font-semibold shadow-md hover:bg-green-600 transition"
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
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map(project => (
                                        <tr key={project.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <td className="px-6 py-4 border-b">{project.namaProyek}</td>
                                            <td className="px-6 py-4 border-b">{project.statusProyek}</td>
                                            <td className="px-6 py-4 border-b space-x-2">
                                                {/* Edit Button */}
                                                <Link
                                                    href={route('projects.edit', project.id)}
                                                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-150 ease-in-out"
                                                >
                                                    Edit
                                                </Link>

                                                {/* Delete Button */}
                                                <form
                                                    method="POST"
                                                    action={route('projects.destroy', project.id)}
                                                    className="inline"
                                                    onSubmit={(e) => {
                                                        if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                >
                                                    <input type="hidden" name="_token" value={csrf_token} />
                                                    <input type="hidden" name="_method" value="DELETE" />
                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out"
                                                    >
                                                        Delete
                                                    </button>
                                                </form>
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
