import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import React from 'react';

export default function Dashboard() {
    const { users = [], roles = [], pendingDonationRequests = [] } = usePage().props;
    const { csrf_token } = usePage().props;

    const handleAction = (routeName, id, message) => {
        if (confirm(message)) {
            router.put(route(routeName, id), {}, {
                onSuccess: () => alert(`Request ${message.toLowerCase()} successfully!`)
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="text-2xl font-semibold leading-tight text-gray-800">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-12">

                    {/* Existing User Role Management Table */}
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-700">Manage User Roles</h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Current Role</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Assign Role</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Unassign Role</th>
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
                                            
                                            {/* Assign Role Form */}
                                            <td className="px-6 py-4 border-b">
                                                <form method="POST" action={route('admin.assign-role')} className="flex items-center space-x-2">
                                                    <input type="hidden" name="_token" value={csrf_token} />
                                                    <input type="hidden" name="user_id" value={user.id} />

                                                    <select
                                                        name="role_name"
                                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-150 ease-in-out text-gray-700 bg-gray-50 hover:bg-white cursor-pointer"
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
                                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-150 ease-in-out"
                                                    >
                                                        Assign
                                                    </button>
                                                </form>
                                            </td>

                                            {/* Unassign Role Form */}
                                            <td className="px-6 py-4 border-b">
                                                <form method="POST" action={route('admin.unassign-role')} className="flex items-center space-x-2">
                                                    <input type="hidden" name="_token" value={csrf_token} />
                                                    <input type="hidden" name="user_id" value={user.id} />

                                                    <select
                                                        name="role_name"
                                                        className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-red-400 focus:border-red-400 transition duration-150 ease-in-out text-gray-700 bg-gray-50 hover:bg-white cursor-pointer"
                                                        defaultValue=""
                                                    >
                                                        <option value="" disabled>Pilih Role untuk dihapus</option>
                                                        {user.roles.map(role => (
                                                            <option key={role.name} value={role.name}>
                                                                {role.display_name}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button
                                                        type="submit"
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-150 ease-in-out"
                                                    >
                                                        Unassign
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Donation Requests Pending Approval */}
                    <div className="overflow-hidden bg-white shadow-lg sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-6 text-gray-700">Pending Donation Requests</h3>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 border-b-2 font-semibold text-left text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingDonationRequests.length > 0 ? (
                                        pendingDonationRequests.map(request => (
                                            <tr key={request.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                                <td className="px-6 py-4 border-b">{request.title}</td>
                                                <td className="px-6 py-4 border-b">{request.category}</td>
                                                <td className="px-6 py-4 border-b">{request.description.substring(0, 50)}...</td>
                                                <td className="px-6 py-4 border-b flex space-x-4">
                                                    <button
                                                        onClick={() => handleAction('admin.donation-requests.approve', request.id, 'approve this request?')}
                                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction('admin.donation-requests.reject', request.id, 'reject this request?')}
                                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                                    >
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-gray-500">No pending donation requests.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
