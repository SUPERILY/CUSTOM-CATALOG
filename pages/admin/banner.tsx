import React, { ReactElement, useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { NextPageWithLayout } from '../_app';
import { Banner } from '../../types';
import { Loader2, Plus, Edit2, Trash2, X, Save, Image as ImageIcon, GripVertical, Eye, EyeOff, Upload, Smartphone, Monitor } from 'lucide-react';
import { Breadcrumbs } from '../../components/admin/Breadcrumbs';

const BannersManagerPage: NextPageWithLayout = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    mobileImageUrl: '',
    linkText: '',
    linkUrl: '',
    isActive: true,
    displayOrder: 0,
  });

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/banner');
      if (!response.ok) throw new Error('Failed to fetch banners');
      const data = await response.json();
      setBanners(data.sort((a: Banner, b: Banner) => a.displayOrder - b.displayOrder));
    } catch (error) {
      console.error('Failed to fetch banners:', error);
      alert('Error loading banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      mobileImageUrl: '',
      linkText: '',
      linkUrl: '',
      isActive: true,
      displayOrder: banners.length,
    });
    setEditingId(null);
    setIsAdding(false);
  };

  const startAdding = () => {
    resetForm();
    setIsAdding(true);
  };

  const startEditing = (banner: Banner) => {
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      mobileImageUrl: banner.mobileImageUrl || '',
      linkText: banner.linkText,
      linkUrl: banner.linkUrl,
      isActive: banner.isActive,
      displayOrder: banner.displayOrder,
    });
    setEditingId(banner.id);
    setIsAdding(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'desktop' | 'mobile') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size must be less than 10MB');
      return;
    }

    const setUploading = type === 'desktop' ? setUploadingDesktop : setUploadingMobile;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        [type === 'desktop' ? 'imageUrl' : 'mobileImageUrl']: data.url
      }));
    } catch (error) {
      console.error('Image upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        // Update existing banner
        const response = await fetch('/api/banner', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingId, ...formData }),
        });
        if (!response.ok) throw new Error('Failed to update banner');
        alert('Banner updated successfully!');
      } else {
        // Create new banner
        const response = await fetch('/api/banner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (!response.ok) throw new Error('Failed to create banner');
        alert('Banner created successfully!');
      }

      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Failed to save banner:', error);
      alert('Error saving banner');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const response = await fetch(`/api/banner?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete banner');
      alert('Banner deleted successfully!');
      fetchBanners();
    } catch (error) {
      console.error('Failed to delete banner:', error);
      alert('Error deleting banner');
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const response = await fetch('/api/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: banner.id, isActive: !banner.isActive }),
      });
      if (!response.ok) throw new Error('Failed to toggle banner');
      fetchBanners();
    } catch (error) {
      console.error('Failed to toggle banner:', error);
      alert('Error toggling banner status');
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Banners' }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Banner Carousel</h1>
          <p className="text-gray-500 mt-1">Manage homepage banner carousel</p>
        </div>
        <button
          onClick={startAdding}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {editingId ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={formData.linkText}
                      onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                    <input
                      type="text"
                      value={formData.linkUrl}
                      onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="/products"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      min="0"
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* Desktop Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    Desktop Image (Landscape)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors relative">
                    {formData.imageUrl ? (
                      <div className="relative group">
                        <img
                          src={formData.imageUrl}
                          alt="Desktop preview"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                            className="text-white hover:text-red-400"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        {uploadingDesktop ? (
                          <Loader2 className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload desktop image</p>
                            <p className="text-xs text-gray-400 mt-1">Recommended: 1920x600px</p>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'desktop')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingDesktop || !!formData.imageUrl}
                    />
                  </div>
                </div>

                {/* Mobile Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Mobile Image (Portrait/Square)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors relative">
                    {formData.mobileImageUrl ? (
                      <div className="relative group">
                        <img
                          src={formData.mobileImageUrl}
                          alt="Mobile preview"
                          className="w-32 h-32 mx-auto object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, mobileImageUrl: '' })}
                            className="text-white hover:text-red-400"
                          >
                            <Trash2 className="w-6 h-6" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="py-4">
                        {uploadingMobile ? (
                          <Loader2 className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Click to upload mobile image</p>
                            <p className="text-xs text-gray-400 mt-1">Recommended: 800x800px</p>
                          </>
                        )}
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'mobile')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={uploadingMobile || !!formData.mobileImageUrl}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                {editingId ? 'Update Banner' : 'Create Banner'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Banners List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700">All Banners ({banners.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : banners.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No banners yet. Click "Add Banner" to create one.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {banners.map((banner) => (
              <div key={banner.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 cursor-move text-gray-400 hover:text-gray-600">
                    <GripVertical className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{banner.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">{banner.subtitle}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                          <span>Order: {banner.displayOrder}</span>
                          <span>•</span>
                          <span className={banner.isActive ? 'text-green-600' : 'text-gray-400'}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                          {banner.mobileImageUrl && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 text-indigo-600">
                                <Smartphone className="w-3 h-3" /> Mobile Optimized
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {banner.imageUrl && (
                          <img
                            src={banner.imageUrl}
                            alt="Desktop"
                            className="w-24 h-16 object-cover rounded-lg border border-gray-200"
                            title="Desktop Image"
                          />
                        )}
                        {banner.mobileImageUrl && (
                          <img
                            src={banner.mobileImageUrl}
                            alt="Mobile"
                            className="w-12 h-16 object-cover rounded-lg border border-gray-200"
                            title="Mobile Image"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleActive(banner)}
                      className={`p-2 rounded-lg transition-colors ${banner.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                        }`}
                      title={banner.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => startEditing(banner)}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

BannersManagerPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default BannersManagerPage;
