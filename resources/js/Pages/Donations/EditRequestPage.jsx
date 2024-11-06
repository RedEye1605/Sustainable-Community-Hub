import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import {route} from 'ziggy-js';

export default function EditRequestPage({ donationRequest }) {
    const { data, setData, put, processing, errors } = useForm({
        title: donationRequest.title || '',
        description: donationRequest.description || '',
        category: donationRequest.category || 'uang',
        target_amount: donationRequest.target_amount || '',
        target_items: donationRequest.target_items || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('donation-requests.update', donationRequest.id), {
            onSuccess: () => alert('Permintaan donasi berhasil diperbarui!'),
        });
    };

    return (
        <div className="w-full min-h-screen p-6 lg:p-12 bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400 w-full max-w-3xl">
                <Link href="/" className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <Link href={route('donation-receiver.dashboard')} className="hover:underline">Dashboard</Link>
                <span className="mx-2">/</span>
                <span>Edit Permintaan Donasi</span>
            </nav>

            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
                Edit Permintaan Donasi
            </h1>

            <form onSubmit={handleSubmit} className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Judul Permintaan</label>
                    <input
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Contoh: Pengumpulan Baju Bekas"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi</label>
                    <textarea
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Deskripsi tujuan pengumpulan ini..."
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 h-32"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                    <select
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                    >
                        <option value="uang">Uang</option>
                        <option value="barang">Barang</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                {data.category === 'uang' ? (
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Pengumpulan (Rp)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.target_amount}
                            onChange={(e) => setData('target_amount', e.target.value)}
                            placeholder="Masukkan jumlah target uang"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                        />
                        {errors.target_amount && <p className="text-red-500 text-sm mt-1">{errors.target_amount}</p>}
                    </div>
                ) : (
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Jumlah Barang</label>
                        <input
                            type="number"
                            min="1"
                            value={data.target_items}
                            onChange={(e) => setData('target_items', e.target.value)}
                            placeholder="Masukkan jumlah barang yang diperlukan"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                        />
                        {errors.target_items && <p className="text-red-500 text-sm mt-1">{errors.target_items}</p>}
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                    >
                        {processing ? 'Memperbarui...' : 'Update Permintaan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
