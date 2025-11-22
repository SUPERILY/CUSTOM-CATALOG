import React from 'react';
import { Category, StockStatus } from '../types';
import { X, SlidersHorizontal, Tag, Package } from 'lucide-react';

interface MobileFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedStock: StockStatus | '';
    setSelectedStock: (stock: StockStatus | '') => void;
}

export const MobileFilterDrawer: React.FC<MobileFilterDrawerProps> = ({
    isOpen,
    onClose,
    categories,
    selectedCategory,
    setSelectedCategory,
    selectedStock,
    setSelectedStock,
}) => {
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

    const handleClearFilters = () => {
        setSelectedCategory('');
        setSelectedStock('');
    };

    const activeFilterCount =
        (selectedCategory ? 1 : 0) +
        (selectedStock ? 1 : 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black bg-opacity-50 animate-fadeIn" onClick={onClose} />

            {/* Drawer */}
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-2xl animate-slideInRight flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                    <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                        {activeFilterCount > 0 && (
                            <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {activeFilterCount}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Filters Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Category Filter */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <Tag className="w-4 h-4 text-indigo-600" />
                            Category
                        </label>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedCategory('')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all ${selectedCategory === ''
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                    }`}
                            >
                                All Categories
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all ${selectedCategory === cat.id
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Stock Status Filter */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                            <Package className="w-4 h-4 text-indigo-600" />
                            Stock Status
                        </label>
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedStock('')}
                                className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all ${selectedStock === ''
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                    }`}
                            >
                                All Stock
                            </button>
                            {(['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'] as StockStatus[]).map(status => (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStock(status)}
                                    className={`w-full text-left px-4 py-2.5 rounded-lg border transition-all ${selectedStock === status
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-medium'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                        }`}
                                >
                                    {status.replace(/_/g, ' ')}
                                </button>
                            ))}
                        </div>
                    </div>


                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 space-y-2">
                    <button
                        onClick={handleClearFilters}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                    >
                        Clear All Filters
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};
