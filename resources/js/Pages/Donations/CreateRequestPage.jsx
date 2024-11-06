import React from 'react';
import { Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function CreateRequestPage() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category: 'uang',
        type: 'uang',  // Tambahkan field 'type' dengan default value
        target_amount: '',
        target_items: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('donation-requests.store'), {
            onSuccess: () => {
                alert('Pengajuan berhasil dikirim!');
                reset();
            },
            onError: (error) => {
                console.error("Pengiriman gagal", error);
            },
        });
    };

    return (
        <div className="w-full min-h-screen p-6 lg:p-12 bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400 w-full max-w-3xl">
                <Link href="/" className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <span>Ajukan Tempat Pengumpulan Donasi</span>
            </nav>

            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
                Ajukan Tempat Pengumpulan Donasi
            </h1>

            {/* Form Pengajuan */}
            <form onSubmit={handleSubmit} className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Judul Pengumpulan</label>
                    <input
                        type="text"
                        name="title"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        placeholder="Contoh: Pengumpulan Baju Bekas"
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                        required
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi</label>
                    <textarea
                        name="description"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        placeholder="Deskripsi tujuan pengumpulan ini..."
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 h-32"
                        required
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* Field Tipe Donasi */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Tipe Donasi</label>
                    <select
                        name="type"
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                        required
                    >
                        <option value="uang">Uang</option>
                        <option value="barang">Barang</option>
                    </select>
                    {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
                </div>

                {/* Kondisi Berdasarkan Kategori */}
                {data.category === 'uang' ? (
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Pengumpulan (Rp)</label>
                        <input
                            type="number"
                            name="target_amount"
                            value={data.target_amount}
                            onChange={(e) => setData('target_amount', e.target.value)}
                            placeholder="Masukkan jumlah target uang"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                            min="0"
                            required
                        />
                        {errors.target_amount && <p className="text-red-500 text-sm mt-1">{errors.target_amount}</p>}
                    </div>
                ) : (
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Target Jumlah Barang</label>
                        <input
                            type="number"
                            name="target_items"
                            value={data.target_items}
                            onChange={(e) => setData('target_items', e.target.value)}
                            placeholder="Masukkan jumlah barang yang diperlukan"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                            min="1"
                            required
                        />
                        {errors.target_items && <p className="text-red-500 text-sm mt-1">{errors.target_items}</p>}
                    </div>
                )}

                {/* Tombol Submit */}
                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                    >
                        {processing ? 'Mengirim...' : 'Ajukan Pengumpulan'}
                    </button>
                </div>
            </form>
        </div>
    );
}
