import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../../components/admin/AdminLayout';
import { NextPageWithLayout } from '../../_app';
import { Breadcrumbs } from '../../../components/admin/Breadcrumbs';
import { Loader2, Plus, Edit2, Trash2, Save, X, Settings } from 'lucide-react';
import { StockStatusModel } from '../../../types';

const StockSettingsPage: NextPageWithLayout = () => {
    const [statuses, setStatuses] = useState<StockStatusModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        label: '',
        value: '',
        color: '#000000',
    });

    const fetchStatuses = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/stock-status');
            if (!response.ok) throw new Error('Failed to fetch statuses');
            const data = await response.json();
            setStatuses(data);
        } catch (error) {
            console.error('Error fetching statuses:', error);
            alert('Failed to load stock statuses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses();
    }, []);

    const resetForm = () => {
        setFormData({ label: '', value: '', color: '#000000' });
        setEditingId(null);
        setIsAdding(false);
    };

    const startAdding = () => {
        resetForm();
        setIsAdding(true);
    };

    const startEditing = (status: StockStatusModel) => {
        setFormData({
            label: status.label,
            value: status.value,
            color: status.color,
        });
        setEditingId(status.id);
        setIsAdding(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                const response = await fetch('/api/stock-status', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editingId, ...formData }),
                });
                if (!response.ok) throw new Error('Failed to update status');
            } else {
                // Auto-generate value from label if not provided or for new items
                const value = formData.value || formData.label.toUpperCase().replace(/[^A-Z0-9]/g, '_');

                const response = await fetch('/api/stock-status', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, value }),
                });
                if (!response.ok) throw new Error('Failed to create status');
            }

            resetForm();
            fetchStatuses();
        } catch (error) {
            console.error('Error saving status:', error);
            alert('Failed to save status');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This might affect products using this status.')) return;

        try {
            const response = await fetch(`/api/stock-status?id=${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete status');
            fetchStatuses();
        } catch (error) {
            console.error('Error deleting status:', error);
            alert('Failed to delete status');
        }
    };

    const predefinedColors = [
        { name: 'Green', value: 'green' },
        { name: 'Red', value: 'red' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Orange', value: 'orange' },
        { name: 'Blue', value: 'blue' },
        { name: 'Gray', value: 'gray' },
    ];

    return (
        <div className="space-y-6">
            <Breadcrumbs items={[{ label: 'Settings' }, { label: 'Stock Status' }]} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Stock Statuses</h1>
                    <p className="text-gray-500 mt-1">Manage product stock status labels and colors</p>
                </div>
                <button
                    onClick={startAdding}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Status
                </button>
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            {editingId ? 'Edit Status' : 'Add New Status'}
                        </h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                                    placeholder="e.g. Pre-order"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Value (Internal ID)</label>
                                <input
                                    type="text"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, '') })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                                    placeholder="AUTO_GENERATED"
                                    disabled={!!editingId}
                                />
                                <p className="text-xs text-gray-500 mt-1">Unique identifier (e.g. PRE_ORDER)</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                            <div className="flex flex-wrap gap-3 mb-3">
                                {predefinedColors.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, color: c.value })}
                                        className={`px-3 py-1 rounded-full text-sm border ${formData.color === c.value
                                            ? 'ring-2 ring-indigo-500 border-transparent'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        style={{ backgroundColor: c.value === 'white' ? '#f3f4f6' : undefined }}
                                    >
                                        <span className={`inline-block w-3 h-3 rounded-full mr-2 bg-${c.value}-500`} />
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={formData.color}
                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-32"
                                    placeholder="hex or name"
                                />
                                <div
                                    className="w-10 h-10 rounded-lg border border-gray-200"
                                    style={{ backgroundColor: predefinedColors.find(c => c.value === formData.color) ? undefined : formData.color }}
                                >
                                    {/* If it's a tailwind class name, we can't easily preview it with inline style unless we map it, 
                      but for custom hex it works. For tailwind names, the preview above works. */}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <Save className="w-4 h-4" />
                                {editingId ? 'Update Status' : 'Create Status'}
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

            {/* Status List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-700">Configured Statuses</h3>
                </div>

                {loading ? (
                    <div className="p-8 flex justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm">
                            <tr>
                                <th className="px-6 py-3 font-medium">Label</th>
                                <th className="px-6 py-3 font-medium">Value</th>
                                <th className="px-6 py-3 font-medium">Color</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {statuses.map((status) => (
                                <tr key={status.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{status.label}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono text-sm">{status.value}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${status.color}-100 text-${status.color}-800`}>
                                            {status.color}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => startEditing(status)}
                                            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        {!status.isDefault && (
                                            <button
                                                onClick={() => handleDelete(status.id)}
                                                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default StockSettingsPage;
