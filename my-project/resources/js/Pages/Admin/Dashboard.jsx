import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import React, { useEffect } from 'react';

export default function Dashboard() {
    const { users = [], roles = [] } = usePage().props;

    useEffect(() => {
        console.log("Users:", users);
        console.log("Roles:", roles);
    }, [users, roles]);

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold leading-tight text-gray-800">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-700">Manage User Roles</h3>

                        {/* Users Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Current Role</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Assign Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <td className="px-6 py-4 border-b">{user.name}</td>
                                            <td className="px-6 py-4 border-b">{user.email}</td>
                                            <td className="px-6 py-4 border-b">
                                                {user.roles.map(role => (
                                                    <span key={role.id} className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                                                        {role.display_name}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4 border-b">
                                                <form method="POST" action={route('admin.assign-role')} className="flex items-center">
                                                    {/* CSRF Token */}
                                                    <input type="hidden" name="_token" value={usePage().props.csrf_token} />
                                                    <input type="hidden" name="user_id" value={user.id} />
                                                    
                                                    <select
                                                        name="role_name"
                                                        className="border-gray-300 rounded-md p-2 mr-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out"
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Pilih Role</option>
                                                        {roles.map(role => (
                                                            <option key={role.name} value={role.name}>
                                                                {role.display_name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        type="submit"
                                                        className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transition duration-150 ease-in-out"
                                                    >
                                                        Assign
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
