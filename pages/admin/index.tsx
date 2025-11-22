import React, { ReactElement, useEffect, useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { NextPageWithLayout } from '../_app';
import { DollarSign, Package, List, Hash, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { QuickActions } from '../../components/admin/QuickActions';

const AdminDashboardPage: NextPageWithLayout = () => {
  const [stats, setStats] = useState({
    productCount: 0,
    categoryCount: 0,
    totalStockValue: 0,
    productsInStock: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories'),
        ]);

        if (!prodRes.ok || !catRes.ok) throw new Error('Failed to fetch data');

        const products = await prodRes.json();
        const categories = await catRes.json();

        const productCount = products.length;
        const categoryCount = categories.length;
        const totalStockValue = products.reduce((acc: number, p: any) => acc + p.price, 0);
        const productsInStock = products.filter((p: any) => p.stockStatus === 'IN_STOCK').length;
        const lowStockCount = products.filter((p: any) => p.stockStatus === 'LOW_STOCK').length;
        const outOfStockCount = products.filter((p: any) => p.stockStatus === 'OUT_OF_STOCK').length;

        setStats({
          productCount,
          categoryCount,
          totalStockValue,
          productsInStock,
          lowStockCount,
          outOfStockCount,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.productCount,
      icon: Package,
      color: 'text-blue-600 bg-blue-100',
      bgGradient: 'from-blue-50 to-blue-100/50',
    },
    {
      title: 'Categories',
      value: stats.categoryCount,
      icon: List,
      color: 'text-indigo-600 bg-indigo-100',
      bgGradient: 'from-indigo-50 to-indigo-100/50',
    },
    {
      title: 'In Stock',
      value: `${stats.productsInStock}/${stats.productCount}`,
      icon: Hash,
      color: 'text-green-600 bg-green-100',
      bgGradient: 'from-green-50 to-green-100/50',
      trend: stats.productsInStock > stats.productCount / 2 ? 'up' : 'down',
    },
    {
      title: 'Stock Value',
      value: `$${stats.totalStockValue.toLocaleString()}`,
      icon: DollarSign,
      color: 'text-amber-600 bg-amber-100',
      bgGradient: 'from-amber-50 to-amber-100/50',
    },
  ];

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') return <ArrowUp className="w-4 h-4 text-green-600" />;
    if (trend === 'down') return <ArrowDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-36 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={card.title}
              className={`bg-gradient-to-br ${card.bgGradient} p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    {card.title}
                    {card.trend && getTrendIcon(card.trend)}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${card.color} shadow-sm`}>
                  <card.icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* Stock Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Stock Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-900">In Stock</span>
              <span className="text-2xl font-bold text-green-600">{stats.productsInStock}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <span className="text-sm font-medium text-yellow-900">Low Stock</span>
              <span className="text-2xl font-bold text-yellow-600">{stats.lowStockCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-900">Out of Stock</span>
              <span className="text-2xl font-bold text-red-600">{stats.outOfStockCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Tips</h3>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Use bulk import to add multiple products at once</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Organize products with categories for better navigation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Update stock status regularly to keep customers informed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-600 font-bold">•</span>
              <span>Customize your homepage banner to highlight promotions</span>
            </li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

AdminDashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default AdminDashboardPage;
