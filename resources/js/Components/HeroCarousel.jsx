import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';

function HeroCarousel({ slides, searchPlaceholder }) {
    const [isHoverLeft, setIsHoverLeft] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isCursorVisible, setIsCursorVisible] = useState(false);
    const swiperRef = useRef(null);
    const cursorRef = useRef(null);

    const handleMouseMove = (e) => {
        const { width, left } = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - left;
        setIsHoverLeft(mouseX < width / 2);
        setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    const handleClick = () => {
        if (isHoverLeft) {
            swiperRef.current?.slidePrev();
        } else {
            swiperRef.current?.slideNext();
        }
    };

    useEffect(() => {
        const cursorEl = cursorRef.current;
        if (cursorEl) {
            // Posisikan kursor kustom sesuai dengan kursor asli, sesuaikan offset Y jika diperlukan
            cursorEl.style.transform = `translate3d(${cursorPosition.x-30}px, ${cursorPosition.y-110}px, 0)`;
        }
    }, [cursorPosition]);

    return (
        <section 
            className="hero-carousel relative text-white overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsCursorVisible(true)}
            onMouseLeave={() => setIsCursorVisible(false)}
            onClick={handleClick}
            style={{ cursor: isCursorVisible ? 'none' : 'auto' }}
        >
            {/* Custom Cursor */}
            {isCursorVisible && (
                <div 
                    ref={cursorRef} 
                    className={`fixed pointer-events-none z-50 flex items-center justify-center 
                                w-16 h-16 rounded-full bg-gray-500 bg-opacity-70 
                                transition-transform duration-200 ease-out`}
                >
                    {/* SVG Panah Kiri atau Kanan */}
                    {isHoverLeft ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    )}
                </div>
            )}

            {/* Swiper Carousel */}
            <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                loop={true}
                className="h-[500px] w-full"
                onSwiper={(swiper) => (swiperRef.current = swiper)}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index} className="relative">
                        <img
                            src={slide.image}
                            alt={`Slide ${index + 1}`}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-4">
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
