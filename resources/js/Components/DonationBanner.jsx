// src/components/DonationBanner.js
import React from 'react';

function DonationBanner() {
    return (
        <section className="donation-banner relative py-16 bg-cover bg-center text-white text-center shadow-md" style={{ backgroundImage: "url('/storage/images/Donation Banner.jpg')" }}>
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            
            <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
                
                {/* Progress Bar */}
                <div className="w-full max-w-md bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                    <div className="bg-green-500 text-xs font-bold text-white text-center p-1" style={{ width: "50%" }}>
                        50% of Goal Achieved
                    </div>
                </div>

                {/* Banner Heading */}
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide">
                    Mari Bersama Wujudkan Dunia yang Lebih Hijau
                </h2>
                
                {/* Banner Description */}
                <p className="text-md md:text-lg max-w-2xl mx-auto mb-6 leading-relaxed text-gray-300 dark:text-gray-200 opacity-90">
                    Setiap donasi yang Anda berikan membantu kami dalam menanam pohon, membersihkan lingkungan, dan menciptakan masa depan yang lebih bersih dan sehat.
                </p>

                {/* Call-to-Action Button */}
                <button 
                    className="px-8 py-3 bg-white text-[#FF2D20] font-bold rounded-full shadow-lg transition ease-in-out duration-300 transform hover:scale-105 hover:bg-gray-100 animate-bounce"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    Donasi Sekarang
                </button>

                {/* Testimonial Text */}
                <p className="mt-6 text-sm italic text-gray-400 dark:text-gray-300">
                    "Setiap rupiah membantu kami menyelamatkan lebih banyak pohon. Terima kasih!" - Anonim
                </p>
            </div>
        </section>
    );
}

export default DonationBanner;
