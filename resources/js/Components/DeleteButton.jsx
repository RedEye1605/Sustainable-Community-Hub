// DeleteButton.jsx
import { usePage, router } from '@inertiajs/react';

export default function DeleteButton({ project }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Cek apakah user adalah admin atau pemilik proyek
    const isAdmin = user?.roles?.some(role => role.name === 'admin');
    const isOwner = user?.id === project?.user_id;

    // Menentukan apakah user memiliki izin untuk menghapus
    const canDelete = isAdmin || isOwner;

    if (!canDelete) return null; // Sembunyikan tombol jika user tidak memiliki akses

    const handleDelete = () => {
        if (confirm('Apakah Anda yakin ingin menghapus proyek ini?')) {
            router.delete(route('projects.destroy', project.id), {
                onSuccess: () => alert('Proyek berhasil dihapus!'),
                onError: () => alert('Gagal menghapus proyek. Silakan coba lagi.'),
            });
        }
    };

    return (
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
    );
}
