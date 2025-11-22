import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LayoutDashboard, Package, List, Image as ImageIcon, LogOut, Lock, Upload, TrendingUp, Menu, X, Settings } from 'lucide-react';
import { useStoreSettings } from '../../contexts/StoreSettingsContext';

const MOCK_ADMIN_TOKEN = 'horizon_admin_token';

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { settings } = useStoreSettings();

  useEffect(() => {
    const token = localStorage.getItem(MOCK_ADMIN_TOKEN);
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [router.pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      localStorage.setItem(MOCK_ADMIN_TOKEN, 'valid');
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password. Try "admin123"');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(MOCK_ADMIN_TOKEN);
    setIsAuthenticated(false);
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
            <p className="text-gray-500">Secure Dashboard Login</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter admin password"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              Login to Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/analytics', label: 'Analytics', icon: TrendingUp },
    { href: '/admin/products', label: 'Products & Stock', icon: Package },
    { href: '/admin/import', label: 'Bulk Import', icon: Upload },
    { href: '/admin/categories', label: 'Categories', icon: List },
    { href: '/admin/banner', label: 'Banner', icon: ImageIcon },
    { href: '/admin/settings/general', label: 'General Settings', icon: Settings },
    { href: '/admin/settings/stock', label: 'Stock Status', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header with Hamburger */}
      <div className="lg:hidden sticky top-16 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Admin Console</h2>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            lg:col-span-3 xl:col-span-2
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            w-64 lg:w-auto
          `}
        >
          <div className="bg-white rounded-none lg:rounded-xl shadow-lg lg:shadow-sm border-r lg:border border-gray-100 overflow-hidden sticky top-16 lg:top-24 h-[calc(100vh-4rem)] lg:h-auto">
            <div className="p-4 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <h3 className="font-bold text-gray-900 text-lg">Admin Console</h3>
              <p className="text-xs text-gray-500 mt-0.5">{settings?.storeName || 'Manage your store'}</p>
            </div>
            <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
              {navItems.map((item) => {
                const isActive = router.pathname === item.href || (item.href !== '/admin' && router.pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t mt-auto bg-gray-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-9 xl:col-span-10">
          {children}
        </main>
      </div>
    </>
  );
};