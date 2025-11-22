import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Banner as BannerType } from '../types';

interface BannerProps {
    banner: BannerType;
}

export const Banner: React.FC<BannerProps> = ({ banner }) => {
    if (!banner || !banner.isVisible) return null;

    return (
        <div className="relative rounded-2xl overflow-hidden bg-indigo-900 text-white shadow-lg">
            <Image
                src={banner.imageUrl}
                alt="Banner"
                layout="fill"
                objectFit="cover"
                className="opacity-40 mix-blend-multiply"
                priority
            />
            <div className="relative z-10 px-6 py-12 sm:px-12 sm:py-16 lg:py-20 flex flex-col items-start">
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">{banner.title}</h2>
                <p className="text-lg sm:text-xl text-indigo-100 mb-8 max-w-2xl">{banner.subtitle}</p>
                <Link
                    href={banner.linkUrl}
                    className="inline-block bg-white text-indigo-600 px-8 py-3 border border-transparent rounded-md font-medium hover:bg-indigo-50 transition-colors shadow-md"
                >
                    {banner.linkText}
                </Link>
            </div>
        </div>
    );
};
