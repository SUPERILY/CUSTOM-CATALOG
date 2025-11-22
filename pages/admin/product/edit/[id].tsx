import React, { useEffect, useState, ReactElement } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { Product, Category, StockStatus, StockStatusModel } from '../../../../types';
import { DB } from '../../../../services/db';
import { showToast } from '../../../../components/ToastProvider';
import { Save, ArrowLeft, Loader2, Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '../../../../components/admin/AdminLayout';
import { NextPageWithLayout } from '../../../_app';

interface ProductEditorProps {
  product?: Product;
  categories: Category[];
  stockStatuses: StockStatusModel[];
}

const ProductEditorPage: NextPageWithLayout<ProductEditorProps> = ({ product, categories, stockStatuses }) => {
  const router = useRouter();
  const [isNew, setIsNew] = useState(!product);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'category' | 'images' | 'features'> & { categoryId: string; features: string[]; images: string[] }>({
    name: product?.name || '',
    sku: product?.sku || '',
    price: product?.price || 0,
    hidePrice: product?.hidePrice || false,
    description: product?.description || '',
    stockStatus: product?.stockStatus || (stockStatuses.length > 0 ? stockStatuses[0].value : 'IN_STOCK'),
    categoryId: product?.categoryId || (categories.length > 0 ? categories[0].id : ''),
    features: product?.features.map(f => f.text) || [''],
    images: product?.images.map(i => i.url) || [],
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // ... (handleImageUpload, removeImage, handleSubmit, handleFeatureChange, addFeature, removeFeature remain same)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast.error('Please upload an image file');
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      showToast.error('Image size must be less than 10MB');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, data.url],
      }));
      showToast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Image upload error:', error);
      showToast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
      // Reset input
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.images.length === 0) {
      showToast.error('Please upload at least one product image');
      return;
    }

    setLoading(true);
    try {
      // Prepare product data - don't send id for new products
      const productData = isNew
        ? { ...formData } // No id for new products
        : { ...formData, id: product?.id }; // Include id for updates

      console.log('Saving product:', { isNew, productData });

      // For new products, use /api/products/new (which matches [id] = 'new')
      // For existing products, use /api/products/{id}
      const url = isNew ? '/api/products/new' : `/api/products/${product?.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.error || 'Failed to save product');
      }

      const savedProduct = await response.json();
      console.log('Product saved successfully:', savedProduct);

      showToast.success(isNew ? 'Product created successfully' : 'Product updated successfully');
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      showToast.error(error instanceof Error ? error.message : 'Failed to save product');
      setLoading(false);
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => setFormData({ ...formData, features: [...formData.features, ''] });
  const removeFeature = (index: number) => setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.push('/admin/products')} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Add New Product' : 'Edit Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Name *</label>
            <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SKU *</label>
            <input required type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category *</label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.categoryId} onChange={e => setFormData({ ...formData, categoryId: e.target.value })}>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Price ($) *</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input required type="number" step="0.01" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.price} onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} />
              <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap select-none cursor-pointer">
                <input type="checkbox" checked={formData.hidePrice} onChange={e => setFormData({ ...formData, hidePrice: e.target.checked })} className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                Hide Price
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
        </div>

        {/* Image Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Product Images *</label>

          {/* Image Grid */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {formData.images.map((url, idx) => (
                <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                  <img src={url} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-indigo-600 text-white text-xs rounded font-medium">
                      Primary
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Upload Button */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors border border-gray-300">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
              {uploadingImage ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Upload Image</span>
                </>
              )}
            </label>
            <span className="text-sm text-gray-500">Max 10MB, JPG/PNG/WEBP</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Key Features</label>
          {formData.features.map((feature, idx) => (
            <div key={idx} className="flex gap-2">
              <input type="text" className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" value={feature} onChange={e => handleFeatureChange(idx, e.target.value)} placeholder="Enter a feature" />
              <button type="button" onClick={() => removeFeature(idx)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
          ))}
          <button type="button" onClick={addFeature} className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"><Plus className="w-4 h-4" /> Add Feature</button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Stock Status *</label>
          <div className="flex gap-4 flex-wrap">
            {stockStatuses.map(status => (
              <label key={status.id} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.stockStatus === status.value ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                <input type="radio" name="stockStatus" value={status.value} checked={formData.stockStatus === status.value} onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })} className="text-indigo-600 focus:ring-indigo-500" />
                <span className={`w-2 h-2 rounded-full bg-${status.color}-500`} style={{ backgroundColor: status.color.startsWith('#') ? status.color : undefined }} />
                {status.label}
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end gap-4">
          <button type="button" onClick={() => router.push('/admin/products')} className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
          <button type="submit" disabled={loading || uploadingImage} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

ProductEditorPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

// Helper to serialize Date objects for Next.js props
const serializeForJSON = (obj: any): any => {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  }));
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };
  const categories = await DB.getCategories();
  const stockStatuses = await DB.getStockStatuses();

  if (id === 'new') {
    return {
      props: {
        categories: serializeForJSON(categories),
        stockStatuses: serializeForJSON(stockStatuses),
      },
    };
  }

  const product = await DB.getProductById(id);

  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      product: serializeForJSON(product),
      categories: serializeForJSON(categories),
      stockStatuses: serializeForJSON(stockStatuses),
    },
  };
};

export default ProductEditorPage;
