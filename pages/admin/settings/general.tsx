import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../AdminLayout';
import { NextPageWithLayout } from '../../_app';
import { Breadcrumbs } from '../../../components/admin/Breadcrumbs';
import { Loader2, Save, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useStoreSettings } from '../../../contexts/StoreSettingsContext';
import { showToast } from '../../../components/ToastProvider';

const GeneralSettingsPage: NextPageWithLayout = () => {
    const { settings, refreshSettings } = useStoreSettings();
    const [formData, setFormData] = useState({
        storeName: '',
        logoUrl: '',
        faviconUrl: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);

    useEffect(() => {
        if (settings) {
            setFormData({
                storeName: settings.storeName || '',
                logoUrl: settings.logoUrl || '',
                faviconUrl: settings.faviconUrl || ''
            });
        }
    }, [settings]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'faviconUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast.error('Please upload an image file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast.error('Image size must be less than 5MB');
            return;
        }

        if (field === 'logoUrl') setUploadingLogo(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setFormData(prev => ({ ...prev, [field]: data.url }));
            showToast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            showToast.error('Failed to upload image');
        } finally {
            if (field === 'logoUrl') setUploadingLogo(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update settings');

            await refreshSettings();
            showToast.success('Settings updated successfully');
        } catch (error) {
            console.error('Save error:', error);
            showToast.error('Failed to save settings');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Settings', href: '/admin/settings/general' }, { label: 'General', href: '/admin/settings/general' }]} />

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">General Settings</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Store Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Store Name</label>
                        <input
                            type="text"
                            value={formData.storeName}
                            onChange={e => setFormData({ ...formData, storeName: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g. My Awesome Store"
                        />
                    </div>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Store Logo</label>
                        <div className="flex items-start gap-6">
                            <div className="flex-shrink-0">
                                {formData.logoUrl ? (
                                    <div className="relative group w-40 h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden">
                                        <img src={formData.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain p-2" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, logoUrl: '' })}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-40 h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400">
                                        <ImageIcon className="w-8 h-8 mb-2" />
                                        <span className="text-xs">No Logo</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow space-y-3">
                                <p className="text-sm text-gray-500">
                                    Upload a logo for your store. Recommended size: 200x60px. Transparent PNG or SVG works best.
                                </p>
                                <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors text-sm font-medium text-gray-700 shadow-sm">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e, 'logoUrl')}
                                        disabled={uploadingLogo}
                                        className="hidden"
                                    />
                                    {uploadingLogo ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload className="w-4 h-4" />
                                            <span>Upload Logo</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <button
                            type="submit"
                            disabled={loading || uploadingLogo}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md font-medium flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

GeneralSettingsPage.getLayout = function getLayout(page: React.ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default GeneralSettingsPage;
