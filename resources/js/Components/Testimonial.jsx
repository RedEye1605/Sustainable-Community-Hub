// src/components/TestimonialCarousel.js
import React from 'react';

// Sample testimonials data for looping
const sampleTestimonials = [
    { text: "Berpartisipasi dalam kegiatan ini membuat saya lebih peduli pada lingkungan.", author: "Sinta, Relawan" },
    { text: "Setiap rupiah membantu kami menyelamatkan lebih banyak pohon. Terima kasih!", author: "Anonim" },
    { text: "Saya merasa bangga bisa menjadi bagian dari komunitas yang peduli lingkungan.", author: "Andi, Relawan" },
    { text: "Proyek ini benar-benar berdampak positif pada kehidupan kami dan lingkungan sekitar.", author: "Dewi, Masyarakat Lokal" },
    { text: "Kegiatan yang inspiratif dan mengajarkan kami pentingnya menjaga alam.", author: "Budi, Relawan" }
];

function Testimonial({ testimonials = sampleTestimonials }) {
    return (
        <div className="relative overflow-hidden py-12 bg-gray-100 dark:bg-gray-800">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">Apa Kata Mereka</h2>
            <div className="marquee flex space-x-8 items-center">
                {/* Duplicate testimonials to create a seamless loop effect */}
                {[...testimonials, ...testimonials].map((testimonial, index) => (
                    <blockquote
                        key={index}
                        className="testimonial-item min-w-[300px] max-w-xs p-4 bg-white dark:bg-gray-700 shadow-lg rounded-md text-center flex-shrink-0"
                    >
                        <p className="italic text-gray-600 dark:text-gray-300 mb-2">"{testimonial.text}"</p>
                        <footer className="text-sm text-gray-500 dark:text-gray-400">- {testimonial.author}</footer>
                    </blockquote>
                ))}
            </div>
            
            {/* Styles for scrolling effect */}
            <style jsx>{`
                .marquee {
                    display: flex;
                    animation: scroll 20s linear infinite;
                }
                @keyframes scroll {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-100%);
                    }
                }
            `}</style>
        </div>
    );
}

export default Testimonial;
