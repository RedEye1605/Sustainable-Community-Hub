// AddProjectButton.jsx

import { Link, usePage } from '@inertiajs/react';

export default function AddProjectButton() {
    const { auth } = usePage().props;
    const user = auth?.user;

    const hasAccess =
        user?.roles &&
        (user.roles.some(role => role.name === 'pengelola proyek') ||
            user.roles.some(role => role.name === 'admin'));

    if (!hasAccess) return null;

    return (
        <div className="flex justify-end mb-6">
            <Link
                href={route('projects.create')}
                className="flex items-center justify-center w-12 h-12 bg-[#FF2D20] text-white rounded-full font-semibold shadow-md transform transition-transform duration-300 ease-in-out hover:rotate-45"
            >
                <span className="text-3xl font-bold">+</span>
            </Link>
        </div>
    );
}
