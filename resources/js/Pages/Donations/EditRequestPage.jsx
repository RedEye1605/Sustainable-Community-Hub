import React, { useEffect } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function EditRequestPage({ donationRequest }) {
    const form = useForm({
        title: donationRequest.title || '',
        description: donationRequest.description || '',
        category: donationRequest.category || '',
        type: donationRequest.type || 'uang',
        target_amount: donationRequest.target_amount || '',
        target_items: donationRequest.target_items || '',
    });

    useEffect(() => {
        if (form.data.type === 'uang') {
            form.setData('category', 'uang');
        } else if (form.data.type === 'barang' && form.data.category === 'uang') {
            form.setData('category', '');
        }
    }, [form.data.type]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const submissionData = {
            ...form.data,
            category: form.data.type === 'barang' ? form.data.category : '',
            target_amount: form.data.type === 'uang' ? form.data.target_amount : '',
            target_items: form.data.type === 'barang' ? form.data.target_items : '',
        };

        form.put(route('donation-requests.update', donationRequest.id), {
            data: submissionData,
            onSuccess: () => {
                alert('Permintaan donasi berhasil diperbarui!');
            },
            onError: (errorMessages) => {
                console.error('Error saat memperbarui permintaan donasi:', errorMessages);
            },
        });
    };

    const formatCurrency = (amount) => {
        const integerAmount = Math.floor(amount);
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(integerAmount) + '.000';
    };

    return (
        <div className="w-full min-h-screen p-6 lg:p-12 bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
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
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Judul Pengumpulan</label>
                    <input
                        type="text"
                        name="title"
                        value={form.data.title}
                        onChange={(e) => form.setData('title', e.target.value)}
                        placeholder="Contoh: Pengumpulan Baju Bekas"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                        required
                    />
                    {form.errors.title && <p className="text-red-500 text-sm mt-1">{form.errors.title}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi</label>
                    <textarea
                        name="description"
                        value={form.data.description}
                        onChange={(e) => form.setData('description', e.target.value)}
                        placeholder="Deskripsi tujuan pengumpulan ini..."
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 h-32"
                        required
                    ></textarea>
                    {form.errors.description && <p className="text-red-500 text-sm mt-1">{form.errors.description}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipe Donasi</label>
                    <select
                        name="type"
                        value={form.data.type}
                        onChange={(e) => form.setData('type', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                        required
                    >
                        <option value="uang">Uang</option>
                        <option value="barang">Barang</option>
                    </select>
                    {form.errors.type && <p className="text-red-500 text-sm mt-1">{form.errors.type}</p>}
                </div>

                {form.data.type === 'barang' && (
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Kategori</label>
                        <input
                            type="text"
                            name="category"
                            value={form.data.category}
                            onChange={(e) => form.setData('category', e.target.value)}
                            placeholder="Contoh: Baju, Celana, dll."
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                        />
                        {form.errors.category && <p className="text-red-500 text-sm mt-1">{form.errors.category}</p>}
                    </div>
                )}

                {form.data.type === 'uang' ? (
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Pengumpulan (Rp)</label>
                        <input
                            type="number"
                            name="target_amount"
                            value={form.data.target_amount}
                            onChange={(e) => form.setData('target_amount', e.target.value)}
                            placeholder="Masukkan jumlah target uang"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                            min="0"
                        />
                        {form.errors.target_amount && <p className="text-red-500 text-sm mt-1">{form.errors.target_amount}</p>}
                        <p className="text-gray-700 dark:text-gray-300 mt-2">
                            Target Pengumpulan: {form.data.target_amount ? formatCurrency(form.data.target_amount) : '0.000'}
                        </p>
                    </div>
                ) : (
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Jumlah Barang</label>
                        <input
                            type="number"
                            name="target_items"
                            value={form.data.target_items}
                            onChange={(e) => form.setData('target_items', e.target.value)}
                            placeholder="Masukkan jumlah barang yang diperlukan"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                            min="1"
                        />
                        {form.errors.target_items && <p className="text-red-500 text-sm mt-1">{form.errors.target_items}</p>}
                    </div>
                )}

                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        disabled={form.processing}
                        className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                    >
                        {form.processing ? 'Memperbarui...' : 'Update Permintaan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
