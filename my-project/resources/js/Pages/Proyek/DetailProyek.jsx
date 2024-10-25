import { Link, usePage, router } from '@inertiajs/react';

export default function ProjectDetail() {
    const { project } = usePage().props; // Ambil data proyek dari props

    if (!project) {
        return <div>Loading...</div>;
    }

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
            router.delete(route('projects.destroy', project.id), {
                onSuccess: () => alert('Proyek berhasil dihapus!'),
            });
        }
    };

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-3xl font-bold mb-4">{project.namaProyek}</h1>

            {/* Tampilkan gambar proyek jika ada */}
            {project.imageUrl && (
                <div className="mb-6">
                    <img
                        src={project.imageUrl}
                        alt={`Gambar dari proyek ${project.namaProyek}`}
                        className="w-full h-64 object-cover rounded-md"
                    />
                </div>
            )}

            <p>{project.deskripsiProyek}</p>
            <p>Status: {project.statusProyek}</p>

            <div className="mt-6 flex space-x-4">
                {/* Link Edit */}
                <Link
                    href={route('projects.edit', project.id)}
                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                >
                    Edit
                </Link>

                {/* Tombol Hapus */}
                <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Hapus
                </button>

                {/* Link Kembali */}
                <Link href={route('projects.index')} className="text-blue-500">
                    Kembali ke Daftar Proyek
                </Link>
            </div>
        </div>
    );
}
