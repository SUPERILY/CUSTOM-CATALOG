import React, { useState } from 'react';
import type { GetServerSideProps, NextPage } from 'next';
import { Product, Category, Banner } from '../types';
import { DB } from '../services/db';
import { ProductCard } from '../components/ProductCard';
import { BannerCarousel } from '../components/BannerCarousel';
import { SearchBar } from '../components/SearchBar';
import { MobileFilterDrawer } from '../components/MobileFilterDrawer';
import { useProductFilter } from '../hooks/useProductFilter';
import { Filter } from 'lucide-react';

interface HomeProps {
  products: Product[];
  categories: Category[];
  banners: Banner[];
}

const Home: NextPage<HomeProps> = ({ products, categories, banners }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStock,
    setSelectedStock,
    sortBy,
    setSortBy,
    filteredProducts,
  } = useProductFilter(products);

  const sortedCategories = [...categories].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-8">
      {/* Banner Carousel */}
      <BannerCarousel banners={banners} />

      {/* Search and Filter Bar */}
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={sortedCategories}
        onOpenMobileFilters={() => setMobileFiltersOpen(true)}
      />

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        categories={sortedCategories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
      />

      {/* Product Grid - Categorized */}
      <div id="catalog">
        {filteredProducts.length > 0 ? (
          <div className="space-y-12">
            {sortedCategories.map(category => {
              const categoryProducts = filteredProducts.filter(p => p.category?.name === category.name);

              if (categoryProducts.length === 0) return null;

              return (
                <div key={category.id} className="scroll-mt-28">
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 font-display tracking-tight whitespace-nowrap">
                      {category.name}
                    </h2>
                    <div className="h-px bg-gray-200 flex-grow"></div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {categoryProducts.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}

            {(() => {
              const knownCategoryNames = categories.map(c => c.name);
              const uncategorized = filteredProducts.filter(p => !p.category || !knownCategoryNames.includes(p.category.name));

              if (uncategorized.length === 0) return null;

              return (
                <div className="scroll-mt-28">
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 font-display tracking-tight">Other</h2>
                    <div className="h-px bg-gray-200 flex-grow"></div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {uncategorized.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Filter className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedStock('');
              }}
              className="mt-6 text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const [products, categories, banners] = await Promise.all([
      DB.getProducts(),
      DB.getCategories(),
      DB.getBanners()
    ]);

    // Serialize data to handle Date objects
    const serializedProducts = JSON.parse(JSON.stringify(products));
    const serializedCategories = JSON.parse(JSON.stringify(categories));
    const serializedBanners = JSON.parse(JSON.stringify(banners));

    return {
      props: {
        products: serializedProducts,
        categories: serializedCategories,
        banners: serializedBanners,
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);
    throw error;
  }
};

export default Home;
