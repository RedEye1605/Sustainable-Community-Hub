import React, { useState } from 'react';
import { usePage, router, Link } from '@inertiajs/react';
import {route} from 'ziggy-js';

export default function DonationDetailPage() {
    const { donationRequest, auth } = usePage().props;
    const [donationData, setDonationData] = useState({
        type: donationRequest.category || 'barang', // Default to request category
        amount: '',
        item_description: '',
        item_image: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDonationData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDonationData((prevData) => ({ ...prevData, item_image: file }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('type', donationData.type);
        formData.append('amount', donationData.amount);
        formData.append('item_description', donationData.item_description);
        if (donationData.item_image) {
            formData.append('item_image', donationData.item_image);
        }

        router.post(route('donations.store', donationRequest.id), formData, {
            onSuccess: () => {
                alert('Donasi berhasil disimpan!');
                setDonationData({ type: 'barang', amount: '', item_description: '', item_image: null });
                setIsSubmitting(false);
            },
            onError: (error) => {
                setErrors(error);
                setIsSubmitting(false);
            },
        });
    };

    return (
        <div className="min-h-screen p-6 lg:p-12 bg-gradient-to-r from-green-200 to-green-400 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400 w-full max-w-3xl">
                <Link href="/" className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <Link href={route('donation-requests.index')} className="hover:underline">Daftar Donasi</Link>
                <span className="mx-2">/</span>
                <span>{donationRequest.title}</span>
            </nav>

            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
                {donationRequest.title}
            </h1>

            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {donationRequest.description}
                </p>

                <span className="inline-block px-2 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded">
                    Kategori: {donationRequest.category === 'uang' ? 'Uang' : 'Barang'}
                </span>

                {/* Donation Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {donationRequest.category === 'uang' ? (
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Jumlah Donasi (Rp)</label>
                            <input
                                type="number"
                                name="amount"
                                value={donationData.amount}
                                onChange={handleInputChange}
                                placeholder="Masukkan jumlah donasi"
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                                min="1"
                                required
                            />
                            {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Deskripsi Barang</label>
                                <textarea
                                    name="item_description"
                                    value={donationData.item_description}
                                    onChange={handleInputChange}
                                    placeholder="Deskripsi barang yang ingin didonasikan"
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                                    required
                                />
                                {errors.item_description && <p className="text-red-500 text-sm mt-1">{errors.item_description}</p>}
                            </div>

                            <div>
                                <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Foto Barang</label>
                                <input type="file" onChange={handleFileChange} className="w-full" />
                                {errors.item_image && <p className="text-red-500 text-sm mt-1">{errors.item_image}</p>}
                            </div>
                        </>
                    )}

                    <div className="flex justify-center mt-8">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                        >
                            {isSubmitting ? 'Menyimpan...' : 'Donasikan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
