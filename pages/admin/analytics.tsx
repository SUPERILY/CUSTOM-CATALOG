import React, { useEffect, useState, ReactElement } from 'react';
import { AdminLayout } from './AdminLayout';
import { NextPageWithLayout } from '../_app';
import { DollarSign, Package, List, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Product, StockStatus } from '../../types';

interface DashboardStats {
    productCount: number;
    categoryCount: number;
    totalStockValue: number;
    productsInStock: number;
    productsLowStock: number;
    productsOutOfStock: number;
    productsBackorder: number;
    avgProductPrice: number;
    stockByCategory: { name: string; count: number; value: number }[];
    recentProducts: Product[];
}

const AnalyticsDashboardPage: NextPageWithLayout = () => {
    const [stats, setStats] = useState<DashboardStats>({
        productCount: 0,
        categoryCount: 0,
        totalStockValue: 0,
        productsInStock: 0,
        productsLowStock: 0,
        productsOutOfStock: 0,
        productsBackorder: 0,
        avgProductPrice: 0,
        stockByCategory: [],
        recentProducts: [],
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

                const products: Product[] = await prodRes.json();
                const categories = await catRes.json();

                const productCount = products.length;
                const categoryCount = categories.length;
                const totalStockValue = products.reduce((acc, p) => acc + p.price, 0);
                const productsInStock = products.filter(p => p.stockStatus === 'IN_STOCK').length;
                const productsLowStock = products.filter(p => p.stockStatus === 'LOW_STOCK').length;
                const productsOutOfStock = products.filter(p => p.stockStatus === 'OUT_OF_STOCK').length;
                const productsBackorder = products.filter(p => p.stockStatus === 'BACKORDER').length;
                const avgProductPrice = productCount > 0 ? totalStockValue / productCount : 0;

                // Stock by category
                const categoryMap = new Map<string, { count: number; value: number }>();
                products.forEach(p => {
                    const catName = p.category?.name || 'Uncategorized';
                    const existing = categoryMap.get(catName) || { count: 0, value: 0 };
                    categoryMap.set(catName, {
                        count: existing.count + 1,
                        value: existing.value + p.price,
                    });
                });
                const stockByCategory = Array.from(categoryMap.entries())
                    .map(([name, data]) => ({ name, ...data }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5);

                // Recent products (last 5)
                const recentProducts = products
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5);

                setStats({
                    productCount,
                    categoryCount,
                    totalStockValue,
                    productsInStock,
                    productsLowStock,
                    productsOutOfStock,
                    productsBackorder,
                    avgProductPrice,
                    stockByCategory,
                    recentProducts,
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
            trend: null,
        },
        {
            title: 'Total Categories',
            value: stats.categoryCount,
            icon: List,
            color: 'text-indigo-600 bg-indigo-100',
            trend: null,
        },
        {
            title: 'Est. Stock Value',
            value: `$${stats.totalStockValue.toLocaleString()}`,
            icon: DollarSign,
            color: 'text-green-600 bg-green-100',
            trend: null,
        },
        {
            title: 'Avg. Product Price',
            value: `$${stats.avgProductPrice.toFixed(2)}`,
            icon: TrendingUp,
            color: 'text-amber-600 bg-amber-100',
            trend: null,
        },
    ];

    const stockStatusCards = [
        {
            label: 'In Stock',
            count: stats.productsInStock,
            icon: CheckCircle,
            color: 'bg-green-50 border-green-200 text-green-700',
            iconColor: 'text-green-600',
        },
        {
            label: 'Low Stock',
            count: stats.productsLowStock,
            icon: AlertCircle,
            color: 'bg-yellow-50 border-yellow-200 text-yellow-700',
            iconColor: 'text-yellow-600',
        },
        {
            label: 'Out of Stock',
            count: stats.productsOutOfStock,
            icon: TrendingDown,
            color: 'bg-red-50 border-red-200 text-red-700',
            iconColor: 'text-red-600',
        },
        {
            label: 'Backorder',
            count: stats.productsBackorder,
            icon: Clock,
            color: 'bg-blue-50 border-blue-200 text-blue-700',
            iconColor: 'text-blue-600',
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500">Real-time insights into your inventory</p>
            </div>

            {/* Main Stats */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-gray-200 h-36 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map(card => (
                        <div key={card.title} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition-shadow">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color}`}>
                                <card.icon className="w-6 h-6" />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Stock Status Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Stock Status Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {stockStatusCards.map(status => (
                        <div key={status.label} className={`p-4 rounded-lg border-2 ${status.color}`}>
                            <div className="flex items-center justify-between mb-2">
                                <status.icon className={`w-5 h-5 ${status.iconColor}`} />
                                <span className="text-2xl font-bold">{status.count}</span>
                            </div>
                            <p className="text-sm font-medium">{status.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stock by Category */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Top Categories by Product Count</h2>
                    {stats.stockByCategory.length === 0 ? (
                        <p className="text-gray-500 text-sm">No category data available</p>
                    ) : (
                        <div className="space-y-4">
                            {stats.stockByCategory.map((cat, idx) => {
                                const percentage = stats.productCount > 0 ? (cat.count / stats.productCount) * 100 : 0;
                                return (
                                    <div key={cat.name}>
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                            <span className="text-sm text-gray-500">{cat.count} products</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Est. Value: ${cat.value.toFixed(2)}</p>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Recent Products */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Recently Added Products</h2>
                    {stats.recentProducts.length === 0 ? (
                        <p className="text-gray-500 text-sm">No recent products</p>
                    ) : (
                        <div className="space-y-3">
                            {stats.recentProducts.map(product => (
                                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                                        <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${product.stockStatus === 'IN_STOCK' ? 'bg-green-100 text-green-700' :
                                            product.stockStatus === 'LOW_STOCK' ? 'bg-yellow-100 text-yellow-700' :
                                                product.stockStatus === 'OUT_OF_STOCK' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {product.stockStatus.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Insights */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">💡 Quick Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stats.productsLowStock > 0 && (
                        <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900">Low Stock Alert</p>
                                <p className="text-sm text-gray-600">{stats.productsLowStock} product(s) running low on stock</p>
                            </div>
                        </div>
                    )}
                    {stats.productsOutOfStock > 0 && (
                        <div className="flex items-start gap-3 bg-white p-4 rounded-lg">
                            <TrendingDown className="w-5 h-5 text-red-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900">Out of Stock</p>
                                <p className="text-sm text-gray-600">{stats.productsOutOfStock} product(s) need restocking</p>
                            </div>
                        </div>
                    )}
                    {stats.productCount === 0 && (
                        <div className="flex items-start gap-3 bg-white p-4 rounded-lg col-span-2">
                            <Package className="w-5 h-5 text-gray-600 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-900">Get Started</p>
                                <p className="text-sm text-gray-600">Add your first products to start tracking inventory</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

AnalyticsDashboardPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AnalyticsDashboardPage;
