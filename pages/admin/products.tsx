import React, { useEffect, useState, ReactElement } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, StockStatus } from '../../types';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Edit2, Trash2, Plus, Loader2, Search, EyeOff, ImageIcon, Copy, Download, CheckSquare, Square } from 'lucide-react';
import { NextPageWithLayout } from '../_app';
import { showToast } from '../../components/ToastProvider';
import { exportProductsToCSV, downloadCSV } from '../../utils/exportUtils';

const stockStatuses: StockStatus[] = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'];

const ProductManagerPage: NextPageWithLayout = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      showToast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleStockUpdate = async (product: Product, newStatus: StockStatus) => {
    // Optimistic update
    const originalProducts = [...products];
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stockStatus: newStatus } : p));

    try {
      const payload = {
        ...product,
        stockStatus: newStatus,
        categoryId: product.category.id,
        features: product.features.map(f => f.text),
        images: product.images.map(i => i.url),
      };

      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update stock');
      showToast.success('Stock status updated');
    } catch (error) {
      console.error("Failed to update stock:", error);
      setProducts(originalProducts);
      showToast.error('Failed to update stock status');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete product');
        setProducts(prev => prev.filter(p => p.id !== id));
        showToast.success('Product deleted successfully');
      } catch (error) {
        console.error("Failed to delete product:", error);
        showToast.error('Failed to delete product');
      }
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}/duplicate`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to duplicate product');
      const newProduct = await res.json();
      setProducts(prev => [...prev, newProduct]);
      showToast.success('Product duplicated successfully');
    } catch (error) {
      console.error("Failed to duplicate product:", error);
      showToast.error('Failed to duplicate product');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} product(s)? This cannot be undone.`)) {
      try {
        const res = await fetch('/api/products/bulk-delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productIds: Array.from(selectedIds) }),
        });

        if (!res.ok) throw new Error('Failed to delete products');
        const result = await res.json();

        setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
        setSelectedIds(new Set());
        showToast.success(result.message);
      } catch (error) {
        console.error("Failed to bulk delete:", error);
        showToast.error('Failed to delete products');
      }
    }
  };

  const handleBulkStockUpdate = async (newStatus: StockStatus) => {
    if (selectedIds.size === 0) return;

    try {
      const res = await fetch('/api/products/bulk-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: Array.from(selectedIds), stockStatus: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update products');
      const result = await res.json();

      // Update local state
      setProducts(prev => prev.map(p =>
        selectedIds.has(p.id) ? { ...p, stockStatus: newStatus } : p
      ));
      setSelectedIds(new Set());
      showToast.success(result.message);
    } catch (error) {
      console.error("Failed to bulk update:", error);
      showToast.error('Failed to update products');
    }
  };

  const handleExportCSV = () => {
    const csvContent = exportProductsToCSV(filteredProducts);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvContent, `products-${timestamp}.csv`);
    showToast.success('CSV exported successfully');
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.sku.toLowerCase().includes(filter.toLowerCase())
  );

  const allSelected = filteredProducts.length > 0 && selectedIds.size === filteredProducts.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
        <div className="flex gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <Link
            href="/admin/product/edit/new"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </Link>
        </div>
      </div>

      {/* Bulk Actions Toolbar */}
      {selectedIds.size > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 flex items-center justify-between">
          <span className="text-indigo-900 font-medium">{selectedIds.size} product(s) selected</span>
          <div className="flex gap-2">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleBulkStockUpdate(e.target.value as StockStatus);
                  e.target.value = '';
                }
              }}
              className="px-3 py-1.5 border border-indigo-300 rounded-md bg-white text-sm"
              defaultValue=""
            >
              <option value="" disabled>Update Stock Status</option>
              {stockStatuses.map(status => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </select>
            <button
              onClick={handleBulkDelete}
              className="px-4 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex items-center gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-indigo-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-medium border-b">
                <th className="px-6 py-3">
                  <button onClick={toggleSelectAll} className="flex items-center">
                    {allSelected ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock Status (Quick Update)</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const imageUrl = product.images?.[0]?.url;
                  const isSelected = selectedIds.has(product.id);

                  return (
                    <tr key={product.id} className={`hover:bg-gray-50 transition-colors ${isSelected ? 'bg-indigo-50' : ''}`}>
                      <td className="px-6 py-4">
                        <button onClick={() => toggleSelect(product.id)}>
                          {isSelected ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-gray-400" />}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            {imageUrl ? (
                              <Image src={imageUrl} alt={product.name} width={40} height={40} className="object-cover rounded-md" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{product.category?.name || 'N/A'}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {product.hidePrice ? (
                          <div className="flex items-center gap-1.5 text-gray-500" title="Price hidden on catalog">
                            <EyeOff className="w-4 h-4" />
                            <span>${product.price.toFixed(2)}</span>
                          </div>
                        ) : (
                          `$${product.price.toFixed(2)}`
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={product.stockStatus}
                          onChange={(e) => handleStockUpdate(product, e.target.value as StockStatus)}
                          className={`block w-full max-w-[180px] rounded-md border-gray-300 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-1.5 pl-3 pr-8 cursor-pointer
                             ${product.stockStatus === 'IN_STOCK' ? 'bg-green-50 text-green-700 border-green-200' :
                              product.stockStatus === 'OUT_OF_STOCK' ? 'bg-red-50 text-red-700 border-red-200' :
                                product.stockStatus === 'LOW_STOCK' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                  'bg-blue-50 text-blue-700 border-blue-200'}`}
                        >
                          {stockStatuses.map(status => (
                            <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDuplicate(product.id)}
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                            title="Duplicate"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <Link
                            href={`/admin/product/edit/${product.id}`}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

ProductManagerPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default ProductManagerPage;
