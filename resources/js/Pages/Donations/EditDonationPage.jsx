import React, { useState } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import {route} from 'ziggy-js';

export default function EditDonationPage({ donation }) {
    const { data, setData, put, processing, errors } = useForm({
        type: donation.type,
        amount: donation.amount || '',
        item_description: donation.item_description || '',
        item_image: null,
    });

    const [preview, setPreview] = useState(donation.item_image);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('item_image', file);

            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('donations.update', donation.id), {
            onSuccess: () => alert('Donasi berhasil diperbarui!'),
        });
    };

    return (
        <div className="w-full min-h-screen p-6 lg:p-12 bg-gradient-to-r from-green-200 to-teal-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400 w-full max-w-3xl">
                <Link href="/" className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <Link href={route('dashboard')} className="hover:underline">Dashboard</Link>
                <span className="mx-2">/</span>
                <span>Edit Donasi</span>
            </nav>

            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
                Edit Donasi
            </h1>

            <form onSubmit={handleSubmit} className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                {data.type === 'uang' ? (
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Jumlah Donasi (Rp)</label>
                        <input
                            type="number"
                            min="0"
                            value={data.amount}
                            onChange={(e) => setData('amount', e.target.value)}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                        />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>
                ) : (
                    <>
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi Barang</label>
                            <textarea
                                value={data.item_description}
                                onChange={(e) => setData('item_description', e.target.value)}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 h-32"
                            ></textarea>
                            {errors.item_description && <p className="text-red-500 text-sm mt-1">{errors.item_description}</p>}
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Foto Barang</label>
                            <input type="file" onChange={handleImageChange} className="block w-full" />
                            {preview && (
                                <img src={preview} alt="Preview" className="mt-4 w-full h-64 object-cover rounded-lg shadow-lg border border-gray-300 dark:border-gray-600" />
                            )}
                            {errors.item_image && <p className="text-red-500 text-sm mt-1">{errors.item_image}</p>}
                        </div>
                    </>
                )}

                <div className="flex justify-center mt-8 gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                    >
                        {processing ? 'Memproses...' : 'Update Donasi'}
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this donation?')) {
                                router.delete(route('donations.destroy', donation.id), {
                                    onSuccess: () => alert('Donation deleted successfully'),
                                });
                            }
                        }}
                        className="btn-delete"
                    >
                        Delete
                    </button>
                </div>
            </form>
        </div>
    );
}
