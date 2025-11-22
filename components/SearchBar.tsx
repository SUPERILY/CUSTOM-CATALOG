import React from 'react';
import { Search, ArrowUpDown, SlidersHorizontal } from 'lucide-react';
import { Category, StockStatus } from '../types';
import { SortOption } from '../hooks/useProductFilter';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    selectedStock: string;
    setSelectedStock: (stock: string) => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
    categories: Category[];
    onOpenMobileFilters?: () => void;
}

const stockStatuses: StockStatus[] = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'];

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'price-asc', label: 'Price (Low-High)' },
    { value: 'price-desc', label: 'Price (High-Low)' },
    { value: 'newest', label: 'Newest First' },
];

export const SearchBar: React.FC<SearchBarProps> = ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStock,
    setSelectedStock,
    sortBy,
    setSortBy,
    categories,
    onOpenMobileFilters,
}) => {
    const activeFilterCount =
        (selectedCategory ? 1 : 0) +
        (selectedStock ? 1 : 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6 space-y-4 sticky top-20 z-30">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Desktop Filters & Sort */}
            <div className="hidden lg:flex gap-2 w-full flex-wrap">
                <select
                    className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>

                <select
                    className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                    value={selectedStock}
                    onChange={(e) => setSelectedStock(e.target.value)}
                >
                    <option value="">All Stock</option>
                    {stockStatuses.map(status => (
                        <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                    ))}
                </select>

                <div className="relative">
                    <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                    <select
                        className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Mobile Filter Button & Sort */}
            <div className="flex lg:hidden gap-2">
                <button
                    onClick={onOpenMobileFilters}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors relative"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="font-medium">Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                <div className="relative flex-1">
                    <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                    <select
                        className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-indigo-500 appearance-none cursor-pointer"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            </div>


        </div>
    );
};
