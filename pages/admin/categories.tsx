import React, { useEffect, useState, ReactElement } from 'react';
import { Category, Product } from '../../types';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { Plus, Edit2, Trash2, Save, X, Loader2, List } from 'lucide-react';
import { NextPageWithLayout } from '../_app';

const CategoryManagerPage: NextPageWithLayout = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newDisplayOrder, setNewDisplayOrder] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDisplayOrder, setEditDisplayOrder] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catsRes, prodsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/products')
      ]);

      if (!catsRes.ok || !prodsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const cats = await catsRes.json();
      const prods = await prodsRes.json();

      setCategories(cats.sort((a: Category, b: Category) => a.displayOrder - b.displayOrder));
      setProducts(prods);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      alert("Error loading categories. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsAdding(true);
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          displayOrder: newDisplayOrder,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      const newCategory = await response.json();
      setCategories([...categories, newCategory].sort((a, b) => a.displayOrder - b.displayOrder));
      setNewCategoryName('');
      setNewDisplayOrder(0);
    } catch (error) {
      console.error("Failed to add category:", error);
      alert("Error adding category.");
    } finally {
      setIsAdding(false);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDisplayOrder(category.displayOrder);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditDisplayOrder(0);
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name: editName.trim(), displayOrder: editDisplayOrder }),
      });

      if (!response.ok) {
        throw new Error('Failed to update category');
      }

      const updatedCategory = await response.json();
      setCategories(categories.map(c => c.id === id ? updatedCategory : c).sort((a, b) => a.displayOrder - b.displayOrder));
      cancelEditing();
    } catch (error) {
      console.error("Failed to update category:", error);
      alert("Error updating category.");
    }
  };

  const handleDelete = async (id: string) => {
    const productCount = products.filter(p => p.categoryId === id).length;

    const confirmMessage = productCount > 0
      ? `Warning: ${productCount} product(s) are in this category. Deleting the category will NOT delete the products, but they will become uncategorized. Continue?`
      : 'Are you sure you want to delete this category?';

    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`/api/categories?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete category');
        }

        setCategories(categories.filter(c => c.id !== id));
      } catch (error) {
        console.error("Failed to delete category:", error);
        alert("Error deleting category. Make sure no products are assigned to it.");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg">
          <List className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
          <p className="text-sm text-gray-500">Manage product categories and their display order.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Category Name"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Order"
            className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={newDisplayOrder}
            onChange={(e) => setNewDisplayOrder(parseInt(e.target.value, 10) || 0)}
          />
          <button
            type="submit"
            disabled={isAdding || !newCategoryName.trim()}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h3 className="font-semibold text-gray-700">Existing Categories ({categories.length})</h3>
        </div>

        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 text-indigo-600 animate-spin" /></div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No categories found.</div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map(category => {
              const productCount = products.filter(p => p.categoryId === category.id).length;
              const isEditing = editingId === category.id;

              return (
                <li key={category.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between gap-4">
                    {isEditing ? (
                      <div className="flex-grow flex items-center gap-3">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-grow px-3 py-1.5 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                          autoFocus
                        />
                        <input
                          type="number"
                          value={editDisplayOrder}
                          onChange={(e) => setEditDisplayOrder(parseInt(e.target.value, 10) || 0)}
                          className="w-24 px-3 py-1.5 border border-indigo-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                        />
                        <button onClick={() => handleUpdate(category.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-md" title="Save"><Save className="w-4 h-4" /></button>
                        <button onClick={cancelEditing} className="p-2 text-gray-400 hover:bg-gray-100 rounded-md" title="Cancel"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono bg-gray-100 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center">{category.displayOrder}</span>
                          <span className="font-medium text-gray-800">{category.name}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">{productCount} products</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => startEditing(category)} className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

CategoryManagerPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
}

export default CategoryManagerPage;
