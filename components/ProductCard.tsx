import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../types';
import { StockBadge } from './StockBadge';
import { ImageIcon, Eye } from 'lucide-react';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showQuickView, setShowQuickView] = useState(false);
  const imageUrl = product.images?.[0]?.url;

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <Link href={`/product/${product.id}`} className="group flex flex-col bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 overflow-hidden h-full">
        <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ImageIcon className="w-16 h-16" />
            </div>
          )}

          {/* Quick View Button */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
            <button
              onClick={handleQuickView}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </button>
          </div>
        </div>
        <div className="flex flex-col flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm text-indigo-600 font-medium">{product.category?.name || 'Uncategorized'}</p>
            <StockBadge status={product.stockStatus} size="sm" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
            {product.description}
          </p>
          <div className="mt-auto flex items-center justify-between border-t pt-3">
            <span className={`text-lg font-bold text-gray-900 ${product.hidePrice ? 'text-sm italic text-gray-600' : ''}`}>
              {product.hidePrice ? 'Contact for Price' : `$${product.price.toFixed(2)}`}
            </span>
            <span className="text-sm text-gray-400">SKU: {product.sku}</span>
          </div>
        </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};
