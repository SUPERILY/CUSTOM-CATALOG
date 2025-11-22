import { useState, useMemo } from 'react';
import { Product } from '../types';

export type SortOption = 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'newest';

export const useProductFilter = (products: Product[]) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedStock, setSelectedStock] = useState<string>('');
    const [sortBy, setSortBy] = useState<SortOption>('name-asc');

    const filteredProducts = useMemo(() => {
        // First, filter products
        const filtered = products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory ? product.category.name === selectedCategory : true;
            const matchesStock = selectedStock ? product.stockStatus === selectedStock : true;
            return matchesSearch && matchesCategory && matchesStock;
        });

        // Then, sort the filtered products
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'newest':
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                default:
                    return 0;
            }
        });

        return sorted;
    }, [products, searchTerm, selectedCategory, selectedStock, sortBy]);

    return {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        selectedStock,
        setSelectedStock,
        sortBy,
        setSortBy,
        filteredProducts,
    };
};
