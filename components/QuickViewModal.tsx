import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../types';
import { StockBadge } from './StockBadge';
import { X, Check, Tag, ExternalLink, ImageIcon } from 'lucide-react';

interface QuickViewModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, isOpen, onClose }) => {
    const [activeImage, setActiveImage] = useState(0);

    // Close on ESC key
    React.useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const activeImageUrl = product.images?.[activeImage]?.url;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 animate-fadeIn">
            {/* Backdrop */}
            <div className="absolute inset-0" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                    aria-label="Close"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Image Gallery */}
                    <div className="p-6 bg-gray-50">
                        <div className="aspect-square rounded-xl overflow-hidden bg-white shadow-sm mb-4 relative">
                            {activeImageUrl ? (
                                <Image
                                    src={activeImageUrl}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <ImageIcon className="w-24 h-24" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {product.images && product.images.length > 1 && (
                            <div className="grid grid-cols-4 gap-2">
                                {product.images.map((img, idx) => (
                                    <button
                                        key={img.id}
                                        onClick={() => setActiveImage(idx)}
                                        className={`aspect-square rounded-lg overflow-hidden border-2 transition-all relative ${activeImage === idx ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <Image src={img.url} alt={`View ${idx + 1}`} fill sizes="100px" className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="p-6 md:p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full text-sm font-medium">
                                <Tag className="w-3 h-3 mr-1" /> {product.category?.name || 'Uncategorized'}
                            </span>
                            <StockBadge status={product.stockStatus} size="md" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{product.name}</h2>

                        <p className={`text-2xl text-gray-900 mb-4 ${product.hidePrice ? 'font-medium' : 'font-light'}`}>
                            {product.hidePrice ? 'Contact for Price' : `$${product.price.toFixed(2)}`}
                        </p>

                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {product.description}
                        </p>

                        {product.features && product.features.length > 0 && (
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Key Features</h3>
                                <ul className="space-y-2">
                                    {product.features.map((feature) => (
                                        <li key={feature.id} className="flex items-start text-sm">
                                            <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-auto pt-4 border-t">
                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <span>SKU: {product.sku}</span>
                            </div>

                            <Link
                                href={`/product/${product.id}`}
                                onClick={onClose}
                                className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
                            >
                                View Full Details
                                <ExternalLink className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
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
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};
