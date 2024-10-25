import React from 'react';
import { useForm, usePage, router } from '@inertiajs/react';

const ProjectEdit = () => {
    // Ambil data proyek dari Inertia props
    const { project } = usePage().props;

    // Inisialisasi form menggunakan useForm dari Inertia
    const { data, setData, processing, errors } = useForm({
        namaProyek: project?.namaProyek || '',
        deskripsiProyek: project?.deskripsiProyek || '',
        statusProyek: project?.statusProyek || '',
        image: null, // Field untuk gambar
    });

    // Fungsi untuk menangani perubahan pada input file
    const handleFileChange = (e) => {
        setData('image', e.target.files[0]); // Set gambar yang dipilih
    };

    // Fungsi untuk submit form menggunakan FormData
    const handleSubmit = (e) => {
        e.preventDefault();

        // Buat objek FormData
        const formData = new FormData();
        formData.append('namaProyek', data.namaProyek);
        formData.append('deskripsiProyek', data.deskripsiProyek);
        formData.append('statusProyek', data.statusProyek);
        if (data.image) {
            formData.append('image', data.image);
        }

        // Tambahkan _method=PUT untuk override method
        formData.append('_method', 'PUT');

        // Kirim data menggunakan router.post()
        router.post(route('projects.update', project.id), formData, {
            onSuccess: () => {
                alert('Proyek berhasil diperbarui!');
            },
            onError: (errors) => {
                console.error('Error saat memperbarui proyek:', errors);
            },
            forceFormData: true, // Memastikan semua data dikirim sebagai FormData
        });
    };

    return (
        <div className="container mx-auto p-5">
            <h1 className="text-3xl font-bold mb-4">Edit Proyek</h1>
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

                <button 
                    type="submit" 
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    disabled={processing}
                >
                    {processing ? 'Memproses...' : 'Update Proyek'}
                </button>
            </form>
        </div>
    );
};

export default ProjectEdit;
