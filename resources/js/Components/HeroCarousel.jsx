import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

function HeroCarousel({ slides, searchPlaceholder }) {
    return (
        <section className="hero-carousel relative text-white">
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
                className="h-[500px] w-full" // Tinggi diperbesar menjadi 500px
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index} className="relative">
                        <img
                            src={slide.image}
                            alt={`Slide ${index + 1}`}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
                            {/* Tambahkan text-center dan px-4 untuk memastikan teks tetap rata tengah pada mobile */}
                            <h2 className="text-4xl md:text-5xl font-bold mb-2">{slide.title}</h2>
                            <p className="mb-4 text-lg md:text-xl">{slide.description}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            
            {/* Pencarian di depan carousel */}
            <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 z-10 w-3/4 md:w-1/2 lg:w-1/3">
                <input
                    type="text"
                    placeholder={searchPlaceholder || "Cari inisiatif hijau di dekat Anda"}
                    className="px-6 py-3 rounded-full w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF2D20] shadow-lg"
                />
            </div>
        </section>
    );
}

export default HeroCarousel;
