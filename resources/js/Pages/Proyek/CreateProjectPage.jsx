import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage, router } from '@inertiajs/react';

const ProjectCreate = () => {
    const { data, setData, processing, errors } = useForm({
        namaProyek: '',
        deskripsiProyek: '',
        statusProyek: true, // Default status as true (Aktif)
        start_date: '',
        required_participants: '',
        image: null,
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (data.image) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(data.image);
        } else {
            setPreview(null);
        }
    }, [data.image]);

    const handleFileChange = (e) => {
        setData('image', e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('namaProyek', data.namaProyek);
        formData.append('deskripsiProyek', data.deskripsiProyek);
        formData.append('statusProyek', data.statusProyek ? 1 : 0); // Convert status to integer
        formData.append('start_date', data.start_date);
        formData.append('required_participants', data.required_participants);
        if (data.image) {
            formData.append('image', data.image);
        }

        router.post(route('projects.store'), formData, {
            onSuccess: () => {
                setData({
                    namaProyek: '',
                    deskripsiProyek: '',
                    statusProyek: true,
                    start_date: '',
                    required_participants: '',
                    image: null,
                });
                setPreview(null);
                alert('Proyek berhasil ditambahkan!');
            },
            onError: (errors) => {
                console.error('Error:', errors);
                alert('Terjadi kesalahan saat menambahkan proyek.');
            },
            forceFormData: true, // Ensures FormData is used correctly
        });
    };

    return (
        <div className="w-full min-h-screen p-6 lg:p-12 bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
            <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400 w-full max-w-3xl">
                <Link href={route('projects.index')} className="hover:underline">
                    Events
                </Link>
                <span className="mx-2">/</span>
                <span>Tambah Proyek Baru</span>
            </nav>

            <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-8 text-center">
                Tambah Proyek Baru
            </h1>

            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="max-w-3xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6 transition duration-300 ease-in-out"
            >
                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nama Proyek
                    </label>
                    <input
                        type="text"
                        placeholder="Masukkan nama proyek"
                        value={data.namaProyek}
                        onChange={(e) => setData('namaProyek', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                    />
                    {errors.namaProyek && <span className="text-red-500 text-sm mt-1">{errors.namaProyek}</span>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Deskripsi Proyek
                    </label>
                    <textarea
                        placeholder="Masukkan deskripsi proyek"
                        value={data.deskripsiProyek}
                        onChange={(e) => setData('deskripsiProyek', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 h-32"
                    />
                    {errors.deskripsiProyek && <span className="text-red-500 text-sm mt-1">{errors.deskripsiProyek}</span>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Status Proyek
                    </label>
                    <select
                        value={data.statusProyek ? 'Aktif' : 'Nonaktif'}
                        onChange={(e) => setData('statusProyek', e.target.value === 'Aktif')}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                    >
                        <option value="Aktif">Aktif</option>
                        <option value="Nonaktif">Nonaktif</option>
                    </select>
                    {errors.statusProyek && <span className="text-red-500 text-sm mt-1">{errors.statusProyek}</span>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Tanggal Mulai
                    </label>
                    <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData('start_date', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                    />
                    {errors.start_date && <span className="text-red-500 text-sm mt-1">{errors.start_date}</span>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Jumlah Partisipan yang Dibutuhkan
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={data.required_participants}
                        onChange={(e) => setData('required_participants', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700"
                    />
                    {errors.required_participants && <span className="text-red-500 text-sm mt-1">{errors.required_participants}</span>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Gambar Proyek
                    </label>
                    <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer bg-gray-50 dark:bg-gray-700">
                        <span className="text-lg font-semibold">Pilih Gambar</span>
                        <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                    {errors.image && <span className="text-red-500 text-sm mt-1">{errors.image}</span>}
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

                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        disabled={processing}
                        className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                    >
                        {processing ? 'Memproses...' : 'Tambah Proyek'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectCreate;
