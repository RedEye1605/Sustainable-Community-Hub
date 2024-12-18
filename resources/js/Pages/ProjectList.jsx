import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Modal from '../Components/Modal';
import AddProject from '@/Components/AddButton';
import ConfirmPassword from './Auth/ConfirmPassword';
import ForgotPassword from './Auth/ForgotPassword';
import Login from './Auth/Login';
import Register from './Auth/Register';
import ResetPassword from './Auth/ResetPassword';
import VerifyEmail from './Auth/VerifyEmail';
import { Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
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

// Function to truncate description text by character count
const truncateText = (text, charLimit) => {
    if (text.length > charLimit) {
        return text.slice(0, charLimit) + '...';
    }
    return text;
};

const Card = ({ href, imageSrc, imageAlt, title, description, children }) => (
    <a
        href={href}
        className="block h-[440px] bg-white dark:bg-gray-800 rounded-xl shadow-md 
                 overflow-hidden transform transition-all duration-300 
                 hover:shadow-xl hover:scale-[1.02]"
    >
        <div className="relative w-full h-48">
            <img
                src={imageSrc || '/default-project.jpg'} 
                alt={imageAlt}
                className="w-full h-full object-cover"
            />
        </div>
        
        <div className="p-5 flex flex-col h-[calc(440px-192px)]"> {/* 440px total - 192px (h-48) image */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 
                         line-clamp-2 flex-none">
                {title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow
                       line-clamp-3">
                {truncateText(description, 150)}
            </p>
            
            <div className="mt-auto flex-none">
                {children}
            </div>
        </div>
    </a>
);

const ProjectList = ({ auth, laravelVersion, phpVersion, isLoading}) => {
    const { projects, flash } = usePage().props;
    const successMessage = flash && flash.success ? flash.success : null;

    // State untuk menangani buka dan tutup modal
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isConfirmPasswordOpen, setIsConfirmPasswordOpen] = useState(false);
    const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
    const [isVerifyEmailOpen, setIsVerifyEmailOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { 
            opacity: 1, 
            y: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    // Loading skeleton
    const LoadingSkeleton = () => (
        <div className="animate-pulse grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-[300px]"></div>
            ))}
        </div>
    );

    // Empty state
    const EmptyState = () => (
        <div className="flex flex-col items-center justify-center py-12 px-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg transform hover:scale-[1.02] transition-all duration-300">
            <svg className="w-20 h-20 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tidak ada proyek
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center">
                Belum ada proyek yang tersedia saat ini.
            </p>
        </div>
    );

    // Fungsi untuk membuka modal Forgot Password dari Login
    const openForgotPasswordModal = () => {
        setIsLoginOpen(false);  
        setIsForgotPasswordOpen(true);  
    };

    // Fungsi untuk membuka modal Login dari Register
    const openLoginFromRegister = () => {
        setIsRegisterOpen(false);  
        setIsLoginOpen(true);   
    };

    // Handler untuk membuka modal Confirm Password
    const openConfirmPasswordModal = () => {
        setIsConfirmPasswordOpen(true);
    };

    const openVerifyEmailModal = () => {
        setIsRegisterOpen(false);
        setIsVerifyEmailOpen(true);
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

                    {/* Hamburger Menu Button (Mobile Only) */}
                    <button 
                        className="text-gray-700 dark:text-gray-300 md:hidden" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {/* Icon for Hamburger Menu */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>

                    {/* Navigation Links (Visible on Desktop) */}
                    <nav className="hidden md:flex flex-grow justify-center space-x-6 text-gray-700 dark:text-gray-300">
                        <a href={route('home')} className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">
                            Home
                        </a>
                        <a href="#" className="text-[#FF2D20] font-semibold border-b-2 border-[#FF2D20] hover:border-[#e0241c] transition duration-300">
                            Event
                        </a>
                        <a href={route('donation-requests.index')} className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">
                            Donasi
                        </a>
                        <a href="#" className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">
                            Forum Diskusi
                        </a>
                        <a href="#" className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">
                            Artikel
                        </a>
                        <a href="#" className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">
                            Peta
                        </a>
                        <a href="#" className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">
                            Kalender
                        </a>
                    </nav>

                    {/* Authentication Links - Desktop */}
                    <div className="auth-buttons hidden md:flex space-x-4">
                        {auth.user ? (
                            auth.user.roles && (
                                auth.user.roles.some(role => role.name === 'admin') ? (
                                    <Link
                                        href={route('admin.dashboard')}
                                        className="text-gray-800 dark:text-white hover:text-[#FF2D20] font-semibold transition-colors duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                ) : auth.user.roles.some(role => role.name === 'pengelola proyek') ? (
                                    <Link
                                        href={route('project-manager.dashboard')}
                                        className="text-gray-800 dark:text-white hover:text-[#FF2D20] font-semibold transition-colors duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                ) : auth.user.roles.some(role => role.name === 'donatur receiver') ? (
                                    <Link
                                        href={route('donation-receiver.dashboard')}
                                        className="text-gray-800 dark:text-white hover:text-[#FF2D20] font-semibold transition-colors duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('dashboard')}
                                        className="text-gray-800 dark:text-white hover:text-[#FF2D20] font-semibold transition-colors duration-300"
                                    >
                                        Dashboard
                                    </Link>
                                )
                            )
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsLoginOpen(true)}
                                    className="text-gray-800 dark:text-white hover:text-[#FF2D20] font-semibold transition-colors duration-300"
                                >
                                    Log in
                                </button>
                                <button
                                    onClick={() => setIsRegisterOpen(true)}
                                    className="text-gray-800 dark:text-white hover:text-[#FF2D20] font-semibold transition-colors duration-300"
                                >
                                    Register
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu (Only Visible When isMenuOpen is True) */}
                <Transition
                    show={isMenuOpen}
                    enter="transition ease-out duration-100 transform"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75 transform"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                    className="md:hidden"
                >
                    <nav className="flex flex-col space-y-4 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
                        <a href={route('home')} className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">Home</a>
                        <a href="#" className="text-[#FF2D20] font-semibold border-b-2 border-[#FF2D20] hover:border-[#e0241c] transition duration-300">Event</a>
                        <a href={route('donation-requests.index')} className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">Donasi</a>
                        <a href="#" className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">Forum Diskusi</a>
                        <a href="#" className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">Artikel</a>
                        <a href="#" className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">Peta</a>
                        <a href="#" className="hover:text-[#FF2D20] font-semibold transition-colors duration-300">Kalender</a>
                        
                        {/* Authentication Links for Mobile */}
                        <div className="mt-6 flex flex-col space-y-2 border-t border-gray-600 pt-4">
                            {auth.user ? (
                                auth.user.roles && (
                                    auth.user.roles.some(role => role.name === 'admin') ? (
                                        <Link href={route('admin.dashboard')} className="hover:text-[#FF2D20]">
                                            Dashboard
                                        </Link>
                                    ) : auth.user.roles.some(role => role.name === 'pengelola proyek') ? (
                                        <Link href={route('project-manager.dashboard')} className="hover:text-[#FF2D20]">
                                            Dashboard
                                        </Link>
                                    ) : auth.user.roles.some(role => role.name === 'donatur receiver') ? (
                                        <Link href={route('donation-receiver.dashboard')} className="hover:text-[#FF2D20]">
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link href={route('dashboard')} className="hover:text-[#FF2D20]">
                                            Dashboard
                                        </Link>
                                    )
                                )
                            ) : (
                                <>
                                    <button onClick={() => setIsLoginOpen(true)} className="text-gray-300 hover:text-[#FF2D20] font-semibold">
                                        Log in
                                    </button>
                                    <button onClick={() => setIsRegisterOpen(true)} className="text-gray-300 hover:text-[#FF2D20] font-semibold mt-1">
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </nav>
                </Transition>
            </header>

                <main>
                    {/* Success Message */}
                    {successMessage && (
                        <div className="alert alert-success bg-green-100 text-green-800 p-4 mb-6 rounded-md">
                            {successMessage}
                        </div>
                    )}

                    {/* Login Modal */}
                    <Modal show={isLoginOpen} onClose={() => setIsLoginOpen(false)} maxWidth="md">
                        <div className="p-4">
                            <Login 
                                canResetPassword={true} 
                                onForgotPasswordClick={() => {
                                    setIsLoginOpen(false);
                                    setIsForgotPasswordOpen(true);
                                }} 
                            />
                        </div>
                    </Modal>

                    {/* Register Modal */}
                    <Modal show={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} maxWidth="md">
                        <div className="p-4">
                            <Register 
                                onLoginClick={() => {
                                    setIsRegisterOpen(false); 
                                    setIsLoginOpen(true);
                                }}
                                onVerifyEmailClick={() => {
                                    setIsRegisterOpen(false); 
                                    setIsVerifyEmailOpen(true);
                                }}
                            />
                        </div>
                    </Modal>

                    {/* Forgot Password Modal */}
                    <Modal show={isForgotPasswordOpen} onClose={() => setIsForgotPasswordOpen(false)} maxWidth="md">
                    <div className="p-4">
                        <ForgotPassword 
                            onResetPasswordRequested={() => {
                                setIsForgotPasswordOpen(false);
                                setIsResetPasswordOpen(true);
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
                    
                    {/* Project List Section */}
                    <section className="py-12 px-6 max-w-7xl mx-auto">
                        <div className="mb-8">
                            <SectionHeader 
                                title="Daftar Proyek"
                                className="text-4xl font-bold text-gray-800 dark:text-white mb-2 
                                        relative inline-block after:content-[''] after:absolute 
                                        after:w-1/2 after:h-1 after:bg-[#FF2D20] after:left-0 
                                        after:-bottom-2"
                            />
                        </div>
                        
                        <div className="mb-8">
                            <AddProject />
                        </div>

                        {isLoading ? (
                            <LoadingSkeleton />
                        ) : (
                            <motion.div 
                                className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr"
                                variants={containerVariants}
                                initial="hidden"
                                animate="show"
                            >
                                {projects && projects.length > 0 ? (
                                    projects.map((project) => (
                                        <motion.div 
                                            key={project.id}
                                            variants={cardVariants}
                                            className="h-full"
                                        >
                                            <Card
                                                href={route('projects.show', project.id)}
                                                imageSrc={project.imageUrl}
                                                imageAlt={`Gambar dari proyek ${project.namaProyek}`}
                                                title={project.namaProyek}
                                                description={project.deskripsiProyek}
                                            >
                                                <button className="w-full px-4 py-2 bg-[#FF2D20] text-white rounded-lg
                                                            hover:bg-[#e0241c] transform transition-all duration-300
                                                            hover:-translate-y-1 hover:shadow-lg">
                                                    Lihat Detail
                                                </button>
                                            </Card>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full">
                                        <EmptyState />
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </section>
                </main>

                <footer className="footer py-12 px-6 bg-gray-800 text-gray-300 flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
                    <div className="footer-info text-center md:text-left">z
                        <h2 className="text-2xl font-bold text-white">Sustainable Community</h2>
                        <p className="mt-2 text-sm">Komunitas Perubahan Sejak 2024</p>
                        <p className="mt-4 text-xs text-gray-400">© 2024 Sustainable Community Hub. All rights reserved.</p>
                    </div>

                    {/* Center Section - CTA to Donate */}
                    <div className="footer-cta text-center md:text-left">
                        <h3 className="text-lg font-semibold text-white mb-2">Bantu Kami Menjaga Lingkungan</h3>
                        <p className="text-sm text-gray-300 mb-4">Setiap donasi membantu kami menciptakan perubahan nyata bagi lingkungan.</p>
                        <button className="px-6 py-2 bg-[#FF2D20] text-white font-semibold rounded-full hover:bg-[#e0241c] shadow-lg transition ease-in-out duration-300 transform hover:scale-105"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
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
};

export default ProjectList;
