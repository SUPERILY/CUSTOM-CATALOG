import React from 'react';
import Link from 'next/link';
import { Plus, Upload, TrendingUp, List, LucideIcon } from 'lucide-react';

interface QuickAction {
    title: string;
    description: string;
    href: string;
    icon: LucideIcon;
    color: string;
}

export const QuickActions: React.FC = () => {
    const actions: QuickAction[] = [
        {
            title: 'Add Product',
            description: 'Create a new product',
            href: '/admin/product/edit/new',
            icon: Plus,
            color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
            title: 'Import Products',
            description: 'Bulk CSV import',
            href: '/admin/import',
            icon: Upload,
            color: 'bg-green-500 hover:bg-green-600',
        },
        {
            title: 'View Analytics',
            description: 'Check performance',
            href: '/admin/analytics',
            icon: TrendingUp,
            color: 'bg-purple-500 hover:bg-purple-600',
        },
        {
            title: 'Manage Categories',
            description: 'Edit categories',
            href: '/admin/categories',
            icon: List,
            color: 'bg-amber-500 hover:bg-amber-600',
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {actions.map((action) => (
                <Link
                    key={action.title}
                    href={action.href}
                    className="group relative bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg text-white ${action.color} transition-colors`}>
                            <action.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {action.title}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};
