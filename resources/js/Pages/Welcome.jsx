import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Modal from '../Components/Modal';
import ConfirmPassword from './Auth/ConfirmPassword';
import ForgotPassword from './Auth/ForgotPassword';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ResetPassword from './Auth/ResetPassword';
import VerifyEmail from './Auth/VerifyEmail';
import '../../css/app.css';

// Reusable components
const NavLink = ({ href, children }) => (
    <Link
        href={href}
        className="rounded-md px-4 py-2 text-gray-800 dark:text-white transition hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF2D20]"
    >
        {children}
    </Link>
);

const SectionHeader = ({ title }) => (
    <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        {title}
    </h2>
);

const Card = ({ href, imageSrc, imageAlt, title, description, children }) => (
    <a
        href={href}
        className="flex flex-col items-start gap-4 overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg ring-1 ring-gray-200 dark:ring-gray-700 transition duration-300 hover:shadow-xl hover:ring-gray-400 dark:hover:ring-gray-500"
    >
        <div className="relative w-full flex items-stretch">
            <img
                src={imageSrc}
                alt={imageAlt}
                className="aspect-video w-full rounded-md object-cover shadow-md"
                onError={(e) => (e.currentTarget.style.display = 'none')}
            />
        </div>
        <div className="relative flex flex-col gap-4">
            <SectionHeader title={title} />
            <p className="text-sm text-gray-700 dark:text-gray-300">
                {description}
            </p>
            <div className="mt-4">
                {children}
            </div>
        </div>
    </a>
);

export default function Welcome({ auth, laravelVersion, phpVersion }) {   
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);

    // Fungsi untuk membuka modal Forgot Password dari Login
    const openForgotPasswordModal = () => {
        setIsLoginOpen(false);  // Tutup modal Login
        setIsForgotPasswordOpen(true);  // Buka modal Forgot Password
    };

    // Fungsi untuk membuka modal Login dari Register
    const openLoginFromRegister = () => {
        setIsRegisterOpen(false);  // Tutup modal Register
        setIsLoginOpen(true);      // Buka modal Login
    };

    // Handler untuk membuka modal Confirm Password
    const openConfirmPasswordModal = () => {
        setIsConfirmPasswordOpen(true);
    };

    return (
        <>
            <Head title="Sustainable Community Hub" />
            <div className="app bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 min-h-screen">
                
                {/* Header */}
                <header className="header py-6 px-10 bg-white dark:bg-gray-800 shadow-md">
                    <div className="container mx-auto flex justify-between items-center">
                        
                        {/* Logo / Title */}
                        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                            Sustainable Community Hub
                        </h1>

                        {/* Navigation Links (Centered) */}
                        <nav className="flex-grow flex justify-center space-x-6 text-gray-700 dark:text-gray-300">
                            <a href="#" className="text-[#FF2D20] font-semibold border-b-2 border-[#FF2D20] hover:border-[#e0241c] transition duration-200">
                                Home
                            </a>
                            <a href={route('projects.index')} className="hover:text-[#FF2D20] transition-colors duration-200">
                                Event
                            </a>
                            <a href="#" className="hover:text-[#FF2D20] transition-colors duration-200">
                                Donasi
                            </a>
                            <a href="#" className="hover:text-[#FF2D20] transition-colors duration-200">
                                Forum Diskusi
                            </a>
                            <a href="#" className="hover:text-[#FF2D20] transition-colors duration-200">
                                Artikel
                            </a>
                            <a href="#" className="hover:text-[#FF2D20] transition-colors duration-200">
                                Peta
                            </a>
                            <a href="#" className="hover:text-[#FF2D20] transition-colors duration-200">
                                Kalender
                            </a>
                        </nav>

                        {/* Authentication Links */}
                        <div className="auth-buttons flex space-x-4">
                            {auth.user ? (
                                auth.user.roles && auth.user.roles.some(role => role.name === 'admin') ? (
                                    <Link href={route('admin.dashboard')}>Dashboard</Link>
                                ) : (
                                    <Link href={route('dashboard')}>Dashboard</Link>
                                )                                
                            ) : (
                                <>
                                    <button onClick={() => setIsLoginOpen(true)} className="text-gray-800 dark:text-white hover:text-[#FF2D20]">
                                        Log in
                                    </button>
                                    <button onClick={() => setIsRegisterOpen(true)} className="text-gray-800 dark:text-white hover:text-[#FF2D20]">
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    {/* Login Modal */}
                    <Modal show={isLoginOpen} onClose={() => setIsLoginOpen(false)} maxWidth="md">
                        <div className="p-4">
                            <Login canResetPassword={true} onForgotPasswordClick={openForgotPasswordModal} />
                        </div>
                    </Modal>

                    {/* Register Modal */}
                    <Modal show={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} maxWidth="md">
                        <div className="p-4">
                            <Register onLoginClick={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }} />
                        </div>
                    </Modal>

                    {/* Forgot Password Modal */}
                    <Modal show={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} maxWidth="md">
                        <div className="p-4">
                            <ForgotPassword 
                                onResetPasswordRequested={() => {
                                    setIsForgotPasswordOpen(false);  // Tutup modal ForgotPassword
                                    setIsResetPasswordOpen(true);    // Buka modal ResetPassword
                                }} 
                            />
                        </div>
                    </Modal>

                    {/* Confirm Password Modal */}
                    <Modal show={isConfirmPasswordOpen} onClose={() => setIsConfirmPasswordOpen(false)} maxWidth="md">
                        <div className="p-4">
                            <ConfirmPassword />
                        </div>
                    </Modal>

                    {/* Reset Password Modal */}
                    <Modal show={isResetPasswordOpen} onClose={() => setIsResetPasswordOpen(false)} maxWidth="md">
                        <div className="p-4">
                            <ResetPassword />
                        </div>
                    </Modal>

                    {/* Verify Email Modal */}
                    <Modal show={isVerifyEmailOpen} onClose={() => setIsVerifyEmailOpen(false)} maxWidth="md">
                        <div className="p-4">
                            <VerifyEmail />
                        </div>
                    </Modal>

                    {/* Hero Section */}
                    <section className="hero py-16 text-center bg-gradient-to-r from-green-400 to-teal-500 text-white">
                        <h2 className="text-5xl font-bold">Bergabunglah dengan kami!</h2>
                        <p className="mt-4 text-lg">Menjadi bagian dari aksi untuk membuat dunia yang lebih hijau!</p>
                        <input type="text" placeholder="Pencarian" className="mt-6 px-6 py-3 rounded-full w-3/4 md:w-1/2 lg:w-1/3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF2D20]" />
                    </section>

                    {/* Donation Banner */}
                    <section className="donation-banner py-16 bg-[#FF2D20] text-white text-center">
                        <h2 className="text-4xl font-bold mb-4">Bantu Kami Membuat Dunia Lebih Hijau</h2>
                        <p className="text-lg mb-6">Setiap donasi yang Anda berikan membantu kami dalam mencapai tujuan lingkungan yang lebih bersih dan sehat.</p>
                        <button className="px-6 py-3 bg-white text-[#FF2D20] font-semibold rounded-lg hover:bg-gray-200 transition ease-in-out duration-200">
                            Donasi Sekarang
                        </button>
                    </section>

                    {/* Information Cards Section */}
                    <section className="information-cards grid grid-cols-1 gap-8 py-12 px-6 lg:grid-cols-2">
                        <Card
                            href="#"
                            imageSrc="map.jpg"
                            imageAlt="Green Initiative Map"
                            title="Peta Lokasi Inisiatif Hijau"
                            description="Temukan lokasi inisiatif hijau di daerah Anda."
                        >
                            <button className="px-4 py-2 bg-[#FF2D20] text-white rounded-lg hover:bg-[#e0241c]">Lihat Detail</button>
                        </Card>
                        <Card
                            href="#"
                            imageSrc="calendar.jpg"
                            imageAlt="Event Calendar"
                            title="Kalender Kegiatan"
                            description="Jadwal kegiatan komunitas untuk lingkungan berkelanjutan."
                        >
                            <button className="px-4 py-2 bg-[#FF2D20] text-white rounded-lg hover:bg-[#e0241c]">Lihat Detail</button>
                        </Card>
                    </section>

                    {/* Upcoming Events Section */}
                    <section className="upcoming-events py-12 px-6">
                        <SectionHeader title="Event Terdekat" />
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <Card
                                href="#"
                                imageSrc="beach-cleanup.jpg"
                                imageAlt="Beach Cleanup"
                                title="Bersih Bersih Pantai Balekambang"
                                description="01 Januari 2025"
                            >
                                <button className="px-4 py-2 bg-[#FF2D20] text-white rounded-lg hover:bg-[#e0241c]">Lihat Detail</button>
                            </Card>
                            <Card
                                href="#"
                                imageSrc="beach-cleanup.jpg"
                                imageAlt="Beach Cleanup"
                                title="Bersih Bersih Pantai Balekambang"
                                description="01 Januari 2025"
                            >
                                <button className="px-4 py-2 bg-[#FF2D20] text-white rounded-lg hover:bg-[#e0241c]">Lihat Detail</button>
                            </Card>
                        </div>
                    </section>

                    {/* News and Articles Section */}
                    <section className="news-articles py-12 px-6">
                        <SectionHeader title="Berita dan Artikel" />
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <Card
                                href="#"
                                imageSrc="teen-volunteers.jpg"
                                imageAlt="Teen Volunteers"
                                title="Sekelompok Remaja Bantu Atasi Kelaparan Suku di Papua"
                                description="Baca kisah inspiratif ini"
                            >
                                <button className="px-4 py-2 bg-[#FF2D20] text-white rounded-lg hover:bg-[#e0241c]">Baca</button>
                            </Card>
                            <Card
                                href="#"
                                imageSrc="teen-volunteers.jpg"
                                imageAlt="Teen Volunteers"
                                title="Sekelompok Remaja Bantu Atasi Kelaparan Suku di Papua"
                                description="Baca kisah inspiratif ini"
                            >
                                <button className="px-4 py-2 bg-[#FF2D20] text-white rounded-lg hover:bg-[#e0241c]">Baca</button>
                            </Card>
                        </div>
                    </section>
                </main>

                <footer className="footer py-12 px-6 bg-gray-800 text-gray-300 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
                    {/* Left Section - Information */}
                    <div className="footer-info text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white">Sustainable Community</h2>
                        <p className="mt-2 text-sm">Komunitas Perubahan Sejak 2024</p>
                        <p className="mt-4 text-xs text-gray-400">© 2024 Sustainable Community Hub. All rights reserved.</p>
                    </div>

                    {/* Center Section - CTA to Donate */}
                    <div className="footer-cta text-center md:text-left">
                        <h3 className="text-lg font-semibold text-white mb-2">Bantu Kami Menjaga Lingkungan</h3>
                        <p className="text-sm text-gray-300 mb-4">Setiap donasi membantu kami menciptakan perubahan nyata bagi lingkungan.</p>
                        <button className="px-6 py-2 bg-[#FF2D20] text-white font-semibold rounded-full shadow-md hover:bg-[#e0241c] transition ease-in-out duration-200">
                            Donasi Sekarang
                        </button>
                    </div>

                    {/* Right Section - Social Media Links */}
                    <div className="footer-links flex flex-col items-center space-y-4 text-sm md:space-y-2">
                        <h3 className="text-lg font-semibold text-white">Ikuti Kami</h3>
                        <div className="flex space-x-4">
                            {/* Facebook Icon */}
                            <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5.001 3.657 9.128 8.438 9.878v-6.988h-2.54v-2.89h2.54v-2.2c0-2.507 1.493-3.89 3.776-3.89 1.095 0 2.238.196 2.238.196v2.462h-1.261c-1.244 0-1.63.776-1.63 1.57v1.86h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 17 22 12z" />
                                </svg>
                            </a>
                            {/* Twitter Icon */}
                            <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 19c7.732 0 12-6.268 12-12 0-.182 0-.363-.012-.543A8.57 8.57 0 0 0 22 4.5a8.503 8.503 0 0 1-2.356.646A4.18 4.18 0 0 0 21.447 3a8.335 8.335 0 0 1-2.607.997 4.191 4.191 0 0 0-7.155 3.819 11.904 11.904 0 0 1-8.643-4.39A4.158 4.158 0 0 0 4.67 9.654a4.086 4.086 0 0 1-1.898-.523v.05a4.198 4.198 0 0 0 3.364 4.117 4.208 4.208 0 0 1-1.892.071 4.21 4.21 0 0 0 3.926 2.92A8.44 8.44 0 0 1 2 17.565a11.86 11.86 0 0 0 6.423 1.88" />
                                </svg>
                            </a>
                            {/* Instagram Icon */}
                            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition duration-200">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.978.242 2.43.403a4.908 4.908 0 0 1 1.682.982c.484.484.785.967.98 1.682.161.452.349 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.242 1.978-.403 2.43a4.908 4.908 0 0 1-.982 1.682c-.484.484-.967.785-1.682.98-.452.161-1.26.349-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.978-.242-2.43-.403a4.908 4.908 0 0 1-1.682-.982c-.484-.484-.785-.967-.98-1.682-.161-.452-.349-1.26-.403-2.43-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.054-1.17.242-1.978.403-2.43a4.908 4.908 0 0 1 .982-1.682c.484-.484.967-.785 1.682-.98.452-.161 1.26-.349 2.43-.403 1.266-.058 1.646-.07 4.85-.07zm0 1.838c-3.153 0-3.506.012-4.748.07-1.002.045-1.546.2-1.91.335a3.094 3.094 0 0 0-1.207.746 3.086 3.086 0 0 0-.746 1.207c-.135.364-.29.908-.335 1.91-.058 1.242-.07 1.595-.07 4.748s.012 3.506.07 4.748c.045 1.002.2 1.546.335 1.91.183.488.426.9.746 1.207.318.317.719.563 1.207.746.364.135.908.29 1.91.335 1.242.058 1.595.07 4.748.07s3.506-.012 4.748-.07c1.002-.045 1.546-.2 1.91-.335a3.086 3.086 0 0 0 1.207-.746 3.086 3.086 0 0 0 .746-1.207c.135-.364.29-.908.335-1.91.058-1.242.07-1.595.07-4.748s-.012-3.506-.07-4.748c-.045-1.002-.2-1.546-.335-1.91a3.086 3.086 0 0 0-.746-1.207 3.094 3.094 0 0 0-1.207-.746c-.364-.135-.908-.29-1.91-.335-1.242-.058-1.595-.07-4.748-.07zm0 4.594a5.338 5.338 0 1 1 0 10.676 5.338 5.338 0 0 1 0-10.676zm0 8.838a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm6.406-9.594c.25-.183.585-.297.912-.297h.004a1. "/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
