import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShoppingBag, Lock, Menu, X } from 'lucide-react';
import { useStoreSettings } from '../contexts/StoreSettingsContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { settings } = useStoreSettings();

  const isAdmin = router.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.storeName} className="h-10 w-auto object-contain" />
                ) : (
                  <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 text-white p-1.5 rounded-lg shadow-sm">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-display font-bold text-xl tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-800 uppercase leading-none">
                    {settings?.storeName || 'Eljarjini'}
                  </span>
                  {!settings?.logoUrl && (
                    <span className="font-display italic text-sm text-yellow-600 leading-none self-end -mt-1">
                      Complexe
                    </span>
                  )}
                </div>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden sm:flex sm:items-center sm:gap-6">
              <Link href="/" className="text-gray-600 hover:text-yellow-700 font-medium transition-colors">Catalog</Link>
              <Link href="/admin" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 font-medium transition-colors">
                <Lock className="h-4 w-4" />
                Admin
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="sm:hidden bg-white border-t">
            <div className="pt-2 pb-3 space-y-1">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-yellow-500 hover:text-yellow-700"
              >
                Catalog
              </Link>
              <Link
                href="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-500 hover:text-gray-700"
              >
                Admin Console
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Eljarjini Complexe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};