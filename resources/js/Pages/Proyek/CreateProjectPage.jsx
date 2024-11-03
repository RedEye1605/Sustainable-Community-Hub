import React, { useState, useEffect } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

const ProjectCreate = () => {
    const { data, setData, post, errors } = useForm({
        namaProyek: '',
        deskripsiProyek: '',
        statusProyek: '',
        image: null,
    });

    const [preview, setPreview] = useState(null);

    // Update gambar preview ketika file baru dipilih
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
        formData.append('statusProyek', data.statusProyek);
        if (data.image) {
            formData.append('image', data.image);
        }

        // Mengirim data menggunakan rute Laravel `projects.store`
        post(route('projects.store'), {
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            onSuccess: () => {
                // Reset atau bisa redirect jika ingin
                setData({ namaProyek: '', deskripsiProyek: '', statusProyek: '', image: null });
                setPreview(null);
            },
        });
    };

    return (
        <div className="w-full min-h-screen p-6 lg:p-12 bg-gradient-to-r from-blue-200 to-indigo-300 dark:from-gray-800 dark:to-gray-900 flex flex-col items-center">
            {/* Breadcrumbs */}
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
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
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 outline-none h-32"
                    />
                    {errors.deskripsiProyek && <span className="text-red-500 text-sm mt-1">{errors.deskripsiProyek}</span>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Status Proyek
                    </label>
                    <input
                        type="text"
                        placeholder="Masukkan status proyek"
                        value={data.statusProyek}
                        onChange={(e) => setData('statusProyek', e.target.value)}
                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                    {errors.statusProyek && <span className="text-red-500 text-sm mt-1">{errors.statusProyek}</span>}
                </div>

                <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Gambar Proyek
                    </label>
                    <label className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition duration-200 text-gray-700 dark:text-gray-200">
                        <span className="text-lg font-semibold">Pilih Gambar</span>
                        <input type="file" onChange={handleFileChange} className="hidden" />
                    </label>
                    {errors.image && <span className="text-red-500 text-sm mt-1">{errors.image}</span>}

                    {preview && (
                        <div className="mt-4">
                            <img
                                src={preview}
                                alt="Pratinjau Gambar"
                                className="w-full h-64 object-cover rounded-lg shadow-lg border border-gray-300 dark:border-gray-600 transform transition-transform duration-300 hover:scale-105"
                            />
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        type="submit"
                        className="px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300 ease-in-out disabled:opacity-50"
                    >
                        Tambah Proyek
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectCreate;
