import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard() {
    // Ambil props dari Inertia, dan tetapkan `projects` dengan array kosong jika belum ada data
    const { projects = [] } = usePage().props;
    const [loadingProjectId, setLoadingProjectId] = useState(null); // State untuk menangani loading per proyek

    // Fungsi untuk menangani pembatalan keikutsertaan proyek
    const handleUnfollowProject = (projectId) => {
        if (confirm('Apakah Anda yakin ingin membatalkan keikutsertaan Anda dalam proyek ini?')) {
            setLoadingProjectId(projectId); // Set ID proyek yang sedang dalam proses loading
            router.post(route('projects.unfollow', projectId), {
                onSuccess: () => setLoadingProjectId(null),
                onError: () => {
                    setLoadingProjectId(null);
                    alert('Terjadi kesalahan saat membatalkan keikutsertaan.');
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                                                <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded text-sm">Status: {project.statusProyek}</span>
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
