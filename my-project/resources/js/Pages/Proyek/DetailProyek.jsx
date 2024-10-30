import { Link, usePage, router, Head } from '@inertiajs/react';

export default function ProjectDetail() {
    const { project } = usePage().props;

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
                            <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                {project.startDate || 'TBA'}
                            </span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-md w-32">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">Jumlah Peserta</span>
                            <span className="text-lg font-semibold text-gray-800 dark:text-white">
                                {project.participantCount || '0'}
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
                        <button className="px-6 py-2 bg-[#FF2D20] text-white font-semibold rounded-lg shadow-md hover:bg-[#e0241c] transition ease-in-out duration-200">
                            Bergabung Sekarang
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                        {/* Edit Button */}
                        <Link
                            href={route('projects.edit', project.id)}
                            className="group flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11 3H5a2 2 0 00-2 2v16a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 010 3l-9 9L6 21l3.5-3.5 9-9a2.121 2.121 0 010-3z"
                                />
                            </svg>
                            Edit
                        </Link>

                        {/* Delete Button */}
                        <button
                            onClick={handleDelete}
                            className="group flex items-center gap-2 px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 hover:shadow-xl transition duration-200 ease-in-out transform hover:scale-105"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 2l1 1h4l1-1h5v2H4V2h5zM4 7h16v13a2 2 0 01-2 2H6a2 2 0 01-2-2V7zm5 3h2v7H9v-7zm4 0h2v7h-2v-7z"
                                />
                            </svg>
                            Hapus
                        </button>

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
