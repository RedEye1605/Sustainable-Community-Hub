import { Link, usePage } from '@inertiajs/react';

const ProjectList = () => {
    // Mengambil data proyek dan flash message dari Inertia props
    const { projects, flash } = usePage().props; 

    // Cek apakah ada pesan sukses
    const successMessage = flash && flash.success ? flash.success : null; 

    // Pastikan proyek ada sebelum dirender
    if (!projects || projects.length === 0) {
        return <div className="text-center py-6">Tidak ada proyek yang ditemukan.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-8">
            {/* Menampilkan pesan sukses */}
            {successMessage && (
                <div className="alert alert-success bg-green-100 text-green-800 p-4 mb-6 rounded-md">
                    {successMessage}
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Daftar Proyek</h1>
                <Link
                    href={route('projects.create')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                >
                    Tambah Proyek
                </Link>
            </div>

            <div className="bg-white shadow-sm sm:rounded-lg">
                <div className="flex flex-wrap justify-center gap-4 p-4">
                    {projects.map((project) => (
                        <div key={project.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
                            <Link
                                href={route('projects.show', project.id)}
                                className="block bg-gray-100 p-6 rounded-md hover:bg-gray-200 shadow-md transition-all"
                            >
                                {/* Render gambar proyek jika ada */}
                                {project.imageUrl && (
                                    <img
                                        src={project.imageUrl}
                                        alt={`Gambar dari proyek ${project.namaProyek}`}
                                        className="w-full h-40 object-cover rounded-md mb-4"
                                    />
                                )}
                                <h2 className="text-lg font-semibold text-gray-800">
                                    {project.namaProyek}
                                </h2>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectList;
