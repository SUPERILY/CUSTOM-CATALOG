import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '../types';

interface BannerCarouselProps {
    banners: Banner[];
}

export const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Filter only active banners and sort by display order
    const activeBanners = banners
        .filter(b => b.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder);

    // Auto-rotate banners every 5 seconds
    useEffect(() => {
        if (!isAutoPlaying || activeBanners.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, activeBanners.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000); // Resume auto-play after 10s
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
        setIsAutoPlaying(false);
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    if (activeBanners.length === 0) {
        return null;
    }

    const currentBanner = activeBanners[currentIndex];

    return (
        <div className="relative w-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
            {/* Banner Content */}
            <div className="relative h-[500px] md:h-[400px] flex items-center">
                {/* Background Image */}
                <div className="absolute inset-0 overflow-hidden">
                    {currentBanner.mobileImageUrl ? (
                        <picture>
                            <source media="(max-width: 768px)" srcSet={currentBanner.mobileImageUrl} />
                            <source media="(min-width: 769px)" srcSet={currentBanner.imageUrl} />
                            <img
                                src={currentBanner.imageUrl}
                                alt={currentBanner.title}
                                className="w-full h-full object-cover"
                            />
                        </picture>
                    ) : (
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${currentBanner.imageUrl})` }}
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center md:text-left">
                    <div className="max-w-3xl mx-auto md:mx-0">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 animate-fadeIn">
                            {currentBanner.title}
                        </h1>
                        <p className="text-xl md:text-2xl text-indigo-100 mb-8 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                            {currentBanner.subtitle}
                        </p>
                        {currentBanner.linkUrl && currentBanner.linkText && (
                            <Link
                                href={currentBanner.linkUrl}
                                className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-lg hover:shadow-xl animate-fadeIn"
                                style={{ animationDelay: '0.2s' }}
                            >
                                {currentBanner.linkText}
                            </Link>
                        )}
                    </div>
                </div>

                {/* Navigation Arrows (only show if multiple banners) */}
                {activeBanners.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
                            aria-label="Previous banner"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all z-20"
                            aria-label="Next banner"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </>
                )}
            </div>

            {/* Dots Navigation (only show if multiple banners) */}
            {activeBanners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {activeBanners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-3 h-3 rounded-full transition-all ${index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                                }`}
                            aria-label={`Go to banner ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
        </div>
    );
};
