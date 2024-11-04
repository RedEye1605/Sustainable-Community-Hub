import { Link, usePage, router, Head } from '@inertiajs/react';
import { useState } from 'react';
import EditButton from '@/Components/EditButton';
import DeleteButton from '@/Components/DeleteButton';

export default function ProjectDetail() {
    const { project, isVolunteer } = usePage().props;
    const [isLoading, setIsLoading] = useState(false);

    // Fungsi untuk menangani klik pada tombol "Bergabung Sekarang"
    const handleJoinProject = () => {
        setIsLoading(true);
        router.post(route('projects.join', project.id), {
            onSuccess: () => {
                setIsLoading(false);
            },
            onError: (errors) => {
                setIsLoading(false);
                if (errors.error) {
                    alert(errors.error);
                } else {
                    alert('Terjadi kesalahan saat bergabung');
                }
            },
            onFinish: () => setIsLoading(false),
        });
    };    

    if (!project) {
        return (
            <div className="flex items-center justify-center min-h-screen text-gray-700 dark:text-gray-300">
                Loading...
            </div>
        );
    }

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
            router.delete(route('projects.destroy', project.id), {
                onSuccess: () => alert('Proyek berhasil dihapus!'),
            });
        }
    };

    return (
        <>
            <Head title={project.namaProyek} />

            <div className="bg-gradient-to-r from-green-300 via-blue-300 to-purple-400 min-h-screen p-6 lg:p-12 flex justify-center">
                <div className="container max-w-5xl mx-auto p-8 lg:p-12 bg-white dark:bg-gray-800 rounded-xl shadow-2xl ring-1 ring-gray-300 dark:ring-gray-700 transition duration-300 ease-in-out space-y-8">

                    {/* Breadcrumbs */}
                    <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                        <Link href={route('projects.index')} className="hover:underline">
                            Events
                        </Link>
                        <span className="mx-2">/</span>
                        <span>{project.namaProyek}</span>
                    </nav>

                    {/* Project Title */}
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
                        {project.namaProyek}
                    </h1>

                    {/* Project Image with Overlay */}
                    {project.imageUrl && (
                        <div className="relative mb-6">
                            <img
                                src={project.imageUrl}
                                alt={`Gambar dari proyek ${project.namaProyek}`}
                                className="w-full h-80 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
                        </div>
                    )}

                    {/* Project Stats */}
                    <div className="flex flex-wrap gap-6 justify-center mb-6">
                        <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md w-32">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Status</span>
                            <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                {project.statusProyek}
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md w-32">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Tanggal Mulai</span>
                            <span
                                className="text-lg font-semibold text-gray-800 dark:text-white"
                                title="Tanggal proyek akan dimulai"
                            >
                                {project.start_date || 'TBA'}
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md w-32">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Jumlah Peserta</span>
                            <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                {project.participant_count || '0'}
                            </span>
                        </div>
                    </div>

                    {/* Project Description */}
                    <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Deskripsi Proyek</h2>
                        <p className="mb-4">{project.deskripsiProyek}</p>
                    </div>

                    {/* CTA Section */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Ingin Berkontribusi?
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Gabung bersama kami untuk membuat perubahan yang berarti! Anda dapat memberikan kontribusi
                            sebagai peserta atau donatur.
                        </p>
                        <button
                            onClick={handleJoinProject}
                            disabled={isVolunteer || project.participant_count >= project.required_participants || isLoading}
                            className={`px-6 py-2 ${
                                isVolunteer || project.participant_count >= project.required_participants || isLoading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-[#FF2D20] hover:bg-[#e0241c]'
                            } text-white font-semibold rounded-lg shadow-md transition ease-in-out duration-200`}
                        >
                            {isVolunteer ? 'Anda sudah bergabung' : isLoading ? 'Loading...' : project.participant_count >= project.required_participants ? 'Proyek Penuh' : 'Bergabung Sekarang'}
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        {/* Edit Button */}
                        <EditButton project={project} />

                        {/* Delete Button */}
                        <DeleteButton project={project} />

                        {/* Back to Projects List */}
                        <Link
                            href={route('projects.index')}
                            className="group flex items-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 12h14m-7-7l7 7-7 7"
                                />
                            </svg>
                            <span className="relative transition-all duration-200 ease-in-out group-hover:ml-1">
                                Kembali ke Daftar Proyek
                            </span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
