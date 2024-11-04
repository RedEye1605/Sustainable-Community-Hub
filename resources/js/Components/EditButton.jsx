// EditButton.jsx
import { Link, usePage } from '@inertiajs/react';

export default function EditButton({ project }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    // Cek apakah user adalah admin atau pemilik proyek
    const isAdmin = user?.roles?.some(role => role.name === 'admin');
    const isOwner = user?.id === project?.user_id;

    // Menentukan apakah user memiliki izin untuk mengedit
    const canEdit = isAdmin || isOwner;

    if (!canEdit) return null; // Sembunyikan tombol jika user tidak memiliki akses

    return (
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
    );
}
