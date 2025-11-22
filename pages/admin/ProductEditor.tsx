import React, { useEffect, useState } from 'react';
import { Product, Category, StockStatus } from '../../types';
import { Save, ArrowLeft, Loader2, Plus, X, Upload } from 'lucide-react';

// Define the shape of the form data
// We Omit 'category' (the object) and 'features' (the object array) from Product.
// We keep 'categoryId' which is inherited from PrismaProduct (via Product).
// We redefine 'features' as string[].
interface ProductFormData extends Omit<Product, 'features' | 'category'> {
  features: string[];
}

const stockStatuses: StockStatus[] = ['IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'BACKORDER'];

export const ProductEditor: React.FC = () => {
  const [id, setId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    id: crypto.randomUUID(),
    name: '',
    sku: '',
    price: 0,
    hidePrice: false,
    description: '',
    features: [''],
    categoryId: '', // Changed from category to categoryId
    images: [],
    stockStatus: 'IN_STOCK',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const potentialId = pathParts[pathParts.length - 1];
    if (potentialId && potentialId !== 'new') {
      setId(potentialId);
    }

    const init = async () => {
      try {
        const catRes = await fetch('/api/categories');
        const cats = await catRes.json();
        setCategories(cats);

        if (potentialId && potentialId !== 'new') {
          const prodRes = await fetch(`/api/products/${potentialId}`);
          if (prodRes.ok) {
            const p: Product = await prodRes.json();
            // Ensure we map the incoming Product to ProductFormData
            setFormData({
              ...p,
              features: p.features.map(f => f.text),
              categoryId: p.category.id // Map category object to categoryId
            });
          }
        } else if (cats.length > 0) {
          setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);



  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      if (!res.ok) throw new Error('Upload failed');

      const result = await res.json();
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, {
          id: crypto.randomUUID(),
          url: result.url,
          productId: prev.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }]
      }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      categoryId: formData.categoryId,
      features: formData.features.filter(f => f.trim() !== ''),
      images: formData.images.map(i => i.url)
    };

    try {
      const url = id ? `/api/products/${id}` : '/api/products';
      const method = id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save');

      window.location.href = '/admin/products';
    } catch (error) {
      console.error("Save error:", error);
      alert("Failed to save product.");
      setLoading(false);
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  if (loading && id) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <a href="/admin/products" className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="w-6 h-6" />
        </a>
        <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">SKU</label>
            <input
              required
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={formData.sku}
              onChange={e => setFormData({ ...formData, sku: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
              value={formData.categoryId}
              onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Price ($)</label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <input
                required
                type="number"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              />
              <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hidePrice || false}
                  onChange={e => setFormData({ ...formData, hidePrice: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                Hide Price on Catalog
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Product Images</label>
          <div className="flex flex-wrap gap-4">
            {formData.images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-200 group">
                <img src={img.url} alt="Product" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              {uploading ? <Loader2 className="w-6 h-6 animate-spin text-gray-400" /> : <Upload className="w-6 h-6 text-gray-400" />}
              <span className="text-xs text-gray-500 mt-1">Upload</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Enter full product description..."
          />
          <p className="text-xs text-gray-500 text-right">Powered by Gemini 2.5 Flash</p>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">Key Features</label>
          {formData.features.map((feature, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                type="text"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                value={feature}
                onChange={e => updateFeature(idx, e.target.value)}
                placeholder="e.g. Wireless Connectivity"
              />
              <button
                type="button"
                onClick={() => removeFeature(idx)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addFeature}
            className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          >
            <Plus className="w-4 h-4" /> Add Feature
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Stock Status</label>
          <div className="flex gap-4 flex-wrap">
            {stockStatuses.map(status => (
              <label key={status} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${formData.stockStatus === status ? 'bg-indigo-50 border-indigo-500 text-indigo-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="stockStatus"
                  value={status}
                  checked={formData.stockStatus === status}
                  onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value as StockStatus })}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                {status}
              </label>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t flex justify-end gap-4">
          <a
            href="/admin/products"
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            Cancel
          </a>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium flex items-center gap-2 disabled:opacity-70"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            Save Product
          </button>
        </div>

      </form>
    </div>
  );
};