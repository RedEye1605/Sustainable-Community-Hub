import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function DonationFormPage({ donationRequest }) {
    const isMoneyDonation = donationRequest.type === 'uang';
    const targetAmount = donationRequest.type === 'uang' ? donationRequest.target_amount : donationRequest.target_items;

    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        item_description: '',
        item_image: null,
        type: donationRequest.type,
    });

    const [preview, setPreview] = useState(null);
    const [collectedAmount, setCollectedAmount] = useState(donationRequest.collected_amount || 0); // Start from current collected_amount

    // Calculate donation progress percentage
    const donationProgress = Math.min((collectedAmount / targetAmount) * 100, 100).toFixed(2);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    // Handle image change and preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('item_image', file);

            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    // Submit form with FormData
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('type', data.type);
        if (isMoneyDonation) {
            formData.append('amount', data.amount);
        } else {
            formData.append('item_description', data.item_description);
            if (data.item_image) formData.append('item_image', data.item_image);
        }

        try {
            await post(route('donations.store', donationRequest.id), {
                data: formData,
                onSuccess: () => {
                    alert('Donasi berhasil dikirim!');
                    if (isMoneyDonation) {
                        setCollectedAmount((prev) => prev + parseFloat(data.amount)); // Update collected amount for money
                    } else {
                        setCollectedAmount((prev) => prev + 1); // Update collected amount for item donations
                    }
                    setData({
                        amount: '',
                        item_description: '',
                        item_image: null,
                        type: donationRequest.type,
                    });
                    setPreview(null);
                },
                onError: (error) => {
                    console.error('Submission Error:', error);
                    alert('Terjadi kesalahan saat mengirim donasi.');
                },
                forceFormData: true,
            });
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Error saat mengirim data donasi");
        }
    };

    return (
        <div className="min-h-screen p-6 lg:p-12 bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
            {/* Breadcrumbs */}
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400 w-full max-w-3xl">
                <Link href="/" className="hover:underline">Home</Link>
                <span className="mx-2">/</span>
                <Link href={route('donation-requests.index')} className="hover:underline">Daftar Donasi</Link>
                <span className="mx-2">/</span>
                <span>Formulir Donasi</span>
            </nav>

            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
                Formulir Donasi - {isMoneyDonation ? 'Donasi Uang' : 'Donasi Barang'}
            </h1>

            {/* Progress Bar */}
            <div className="w-full max-w-3xl bg-gray-200 dark:bg-gray-700 rounded-full h-6 mb-6 overflow-hidden">
                <div
                    className="h-full bg-indigo-500"
                    style={{ width: `${donationProgress}%` }}
                ></div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
                Total Terkumpul: {isMoneyDonation ? `Rp ${collectedAmount}` : `${collectedAmount} Barang`} dari {isMoneyDonation ? `Rp ${targetAmount}` : `${targetAmount} Barang`} ({donationProgress}%)
            </p>

            <form onSubmit={handleSubmit} className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6">
                {/* Conditional fields based on donation type */}
                {isMoneyDonation ? (
                    <div>
                        <label htmlFor="amount" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Jumlah Donasi (Rp)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            value={data.amount}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                            required
                        />
                        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
                    </div>
                ) : (
                    <>
                        <div>
                            <label htmlFor="item_description" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Deskripsi Barang
                            </label>
                            <textarea
                                name="item_description"
                                id="item_description"
                                value={data.item_description}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 h-32"
                                required
                            ></textarea>
                            {errors.item_description && <p className="text-red-500 text-sm mt-1">{errors.item_description}</p>}
                        </div>
                        <div>
                            <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Foto Barang
                            </label>
                            <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer bg-gray-50 dark:bg-gray-700">
                                <span className="text-lg font-semibold">Pilih Gambar</span>
                                <input type="file" onChange={handleImageChange} className="hidden" />
                            </label>
                            {errors.item_image && <p className="text-red-500 text-sm mt-1">{errors.item_image}</p>}
                            {preview && (
                                <div className="mt-4">
                                    <img
                                        src={preview}
                                        alt="Pratinjau Gambar"
                                        className="w-full h-64 object-cover rounded-lg shadow-lg border border-gray-300 dark:border-gray-600"
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )}
                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Donasi'}
                    </button>
                </div>
            </form>
        </div>
    );
}
