import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

const ProjectCreate = () => {
    const { data, setData, post, errors, progress } = useForm({
        namaProyek: '',
        deskripsiProyek: '',
        statusProyek: '',
        image: null // Tambahkan field untuk gambar
    });

    // Fungsi untuk menangani submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        // Menggunakan FormData untuk menangani file upload
        const formData = new FormData();
        formData.append('namaProyek', data.namaProyek);
        formData.append('deskripsiProyek', data.deskripsiProyek);
        formData.append('statusProyek', data.statusProyek);
        if (data.image) {
            formData.append('image', data.image); // Tambahkan file gambar jika ada
        }

        // Kirim data ke server menggunakan post (Inertia.js)
        post('/projects', {
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data', // Pastikan form diatur untuk upload file
            },
        });
    };

    // Fungsi untuk menangani perubahan pada input file
    const handleFileChange = (e) => {
        setData('image', e.target.files[0]); // Set gambar yang dipilih
    };

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-3xl font-bold mb-4">Tambah Proyek Baru</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="mb-4">
                    <label className="block text-sm font-medium">Nama Proyek</label>
                    <input 
                        type="text" 
                        value={data.namaProyek} 
                        onChange={(e) => setData('namaProyek', e.target.value)} 
                        className="border p-2 w-full" 
                    />
                    {errors.namaProyek && <span className="text-red-500">{errors.namaProyek}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Deskripsi Proyek</label>
                    <textarea 
                        value={data.deskripsiProyek} 
                        onChange={(e) => setData('deskripsiProyek', e.target.value)} 
                        className="border p-2 w-full" 
                    />
                    {errors.deskripsiProyek && <span className="text-red-500">{errors.deskripsiProyek}</span>}
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Status Proyek</label>
                    <input 
                        type="text" 
                        value={data.statusProyek} 
                        onChange={(e) => setData('statusProyek', e.target.value)} 
                        className="border p-2 w-full" 
                    />
                    {errors.statusProyek && <span className="text-red-500">{errors.statusProyek}</span>}
                </div>

                {/* Input untuk upload gambar */}
                <div className="mb-4">
                    <label className="block text-sm font-medium">Gambar Proyek</label>
                    <input 
                        type="file" 
                        onChange={handleFileChange} 
                        className="border p-2 w-full"
                    />
                    {errors.image && <span className="text-red-500">{errors.image}</span>}
                </div>

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    Tambah Proyek
                </button>
            </form>
        </div>
    );
};

export default ProjectCreate;
