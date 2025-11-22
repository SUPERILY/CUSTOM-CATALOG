import React, { useEffect, useState } from 'react';
import { Category, Product } from '../../types';
import { DB } from '../../services/db';
import { Plus, Edit2, Trash2, Save, X, Loader2, AlertTriangle, List } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for adding new category
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const [cats, prods] = await Promise.all([
      DB.getCategories(),
      DB.getProducts()
    ]);
    setCategories(cats);
    setProducts(prods);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsAdding(true);
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName.trim()
    };
    await DB.saveCategory(newCategory);
    setCategories([...categories, newCategory]);
    setNewCategoryName('');
    setIsAdding(false);
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleUpdate = async (id: string) => {
    const oldCategory = categories.find(c => c.id === id);
    if (!oldCategory || !editName.trim()) return;
    
    // Optimistic UI update
    const updatedCategories = categories.map(c => c.id === id ? { ...c, name: editName.trim() } : c);
    setCategories(updatedCategories);
    setEditingId(null);

    // Persist Category Change
    await DB.saveCategory({ id, name: editName.trim() });

    // CASADING UPDATE: Update all products that used the old category name
    if (oldCategory.name !== editName.trim()) {
      const productsToUpdate = products.filter(p => p.category === oldCategory.name);
      
      if (productsToUpdate.length > 0) {
        await Promise.all(productsToUpdate.map(p => {
          return DB.saveProduct({ ...p, category: editName.trim() });
        }));
        // Refresh products in background to keep local state compliant
        const updatedProducts = await DB.getProducts();
        setProducts(updatedProducts);
      }
    }
  };

  const handleDelete = async (id: string, name: string) => {
    const productCount = products.filter(p => p.category === name).length;
    
    const confirmMessage = productCount > 0 
      ? `Warning: ${productCount} product(s) are in this category. Deleting it will leave them uncategorized (or keep the old tag). Continue?`
      : 'Are you sure you want to delete this category?';

    if (window.confirm(confirmMessage)) {
      await DB.deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
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
          <p className="text-sm text-gray-500">Manage product categories and organize your catalog.</p>
        </div>
      </div>

      {/* Add New Category Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Category</h2>
        <form onSubmit={handleAdd} className="flex gap-3">
          <input
            type="text"
            placeholder="Enter category name (e.g., Office Supplies)"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button
            type="submit"
            disabled={isAdding || !newCategoryName.trim()}
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </form>
      </div>

      {/* Category List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
           <h3 className="font-semibold text-gray-700">Existing Categories ({categories.length})</h3>
        </div>
        
        {loading ? (
          <div className="p-8 flex justify-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories found. Create one above to get started.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {categories.map(category => {
              const productCount = products.filter(p => p.category === category.name).length;
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
                        <button
                          onClick={() => handleUpdate(category.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                          title="Save"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="p-2 text-gray-400 hover:bg-gray-100 rounded-md"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-800">{category.name}</span>
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                            {productCount} products
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditing(category)}
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                            title="Edit Name"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category.id, category.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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