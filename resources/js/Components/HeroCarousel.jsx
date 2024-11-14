import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { Pagination, Autoplay, EffectFade } from 'swiper/modules';

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
  
    useEffect(() => {
      const media = window.matchMedia(query);
      setMatches(media.matches);
  
      const listener = (e) => setMatches(e.matches);
      media.addEventListener('change', listener);
  
      return () => media.removeEventListener('change', listener);
    }, [query]);
  
    return matches;
  };

function HeroCarousel({ slides, searchPlaceholder }) {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [isHoverLeft, setIsHoverLeft] = useState(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isCursorVisible, setIsCursorVisible] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const [cursorOpacity, setCursorOpacity] = useState(0);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const swiperRef = useRef(null);
    const cursorRef = useRef(null);

    const handleMouseMove = (e) => {
        const { width, left } = e.currentTarget.getBoundingClientRect();
        const mouseX = e.clientX - left;
        setIsHoverLeft(mouseX < width / 2);
        setCursorPosition({ 
            x: e.clientX, 
            y: e.clientY 
        });
    };

    const handleClick = (e) => {
        // Ignore clicks on search input
        if (e.target.tagName.toLowerCase() === 'input') {
            return;
        }

        if (isHoverLeft) {
            swiperRef.current?.slidePrev();
        } else {
            swiperRef.current?.slideNext();
        }
    };

    useEffect(() => {
        if (isCursorVisible) {
            // Slight delay to ensure position is set before fade in
            requestAnimationFrame(() => {
                setCursorOpacity(1);
            });
        } else {
            setCursorOpacity(0);
        }
    }, [isCursorVisible]);    

    return (
        <section 
            className="hero-carousel relative text-white overflow-hidden"
            onMouseMove={isDesktop ? handleMouseMove : undefined}
            onMouseEnter={isDesktop ? () => setIsCursorVisible(true) : undefined}
            onMouseLeave={isDesktop ? () => setIsCursorVisible(false) : undefined}
            onClick={isDesktop ? handleClick : undefined}
            style={{ cursor: isDesktop && !isSearchFocused ? 'none' : 'auto' }}
        >
            {/* Custom Cursor with enhanced animation */}
            {isDesktop && isCursorVisible && !isSearchFocused && (
                <div 
                    ref={cursorRef} 
                    className={`fixed pointer-events-none z-50 flex items-center justify-center 
                            w-16 h-16 rounded-full bg-gray-500 bg-opacity-70 
                            transition-all duration-300 ease-out`}
                    style={{
                        backdropFilter: 'blur(4px)',
                        opacity: cursorOpacity,
                        transform: `translate3d(${cursorPosition.x - 30}px, ${cursorPosition.y - 110}px, 0)`,
                    }}
                >
                    {/* Animated Arrow SVG */}
                    <div className={`transform transition-all duration-300 ${isHoverLeft ? 'translate-x-[-2px]' : 'translate-x-[2px]'}`}>
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
                </div>
            )}

            {/* Enhanced Swiper Carousel */}
            <Swiper
                modules={[Pagination, Autoplay, EffectFade]}
                pagination={{ 
                    clickable: true,
                    renderBullet: (index, className) => {
                        return `<span class="${className} transition-all duration-300 hover:scale-125"></span>`;
                    }
                }}
                effect="fade"
                autoplay={{ 
                    delay: 5000,
                    disableOnInteraction: false
                }}
                speed={1000}
                loop={true}
                className="h-[500px] w-full"
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={index} className="relative">
                        <div className="relative h-full overflow-hidden">
                            <img
                                src={slide.image}
                                alt={`Slide ${index + 1}`}
                                className="h-full w-full object-cover transform scale-110 transition-transform duration-[2000ms]"
                                style={{
                                    transform: activeIndex === index ? 'scale(1)' : 'scale(1.1)'
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70">
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                                    <h2 className={`text-4xl md:text-5xl font-bold mb-4 transform transition-all duration-1000
                                                  ${activeIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                        {slide.title}
                                    </h2>
                                    <p className={`mb-4 text-lg md:text-xl transform transition-all duration-1000 delay-300
                                                ${activeIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                        {slide.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
            
            {/* Search Input with higher z-index and event stopPropagation */}
            <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 z-50 w-3/4 md:w-1/2 lg:w-1/3">
                <input
                    type="text"
                    placeholder={searchPlaceholder || "Cari inisiatif hijau di dekat Anda"}
                    className="px-6 py-3 rounded-full w-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#FF2D20] shadow-lg"
                    onFocus={(e) => {
                        e.stopPropagation();
                        setIsSearchFocused(true);
                }}
                onBlur={(e) => {
                    e.stopPropagation();
                    setIsSearchFocused(false);
                }}
                onClick={(e) => e.stopPropagation()}
                />
            </div>
        </section>
    );
}

export default HeroCarousel;
