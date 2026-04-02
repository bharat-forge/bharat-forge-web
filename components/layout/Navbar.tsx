"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, ShoppingCart, User, Globe, LogOut, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'dealer') return '/dealer/dashboard';
    return '/profile';
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight text-gray-900">
                Bharat<span className="text-sky-500">Forge</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/shop" className="text-sm font-medium text-gray-700 hover:text-sky-500 transition-colors">
              Products
            </Link>
            <Link href="/dealer-locator" className="text-sm font-medium text-gray-700 hover:text-sky-500 transition-colors">
              Dealer Network
            </Link>
            <Link href="/apply-dealer" className="text-sm font-medium text-gray-700 hover:text-sky-500 transition-colors">
              Partner With Us
            </Link>
            
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
              <button className="text-gray-500 hover:text-sky-500 transition-colors">
                <ShoppingCart className="h-5 w-5" />
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link href={getDashboardLink()} className="text-sm font-medium text-sky-600 hover:text-sky-700 flex items-center gap-1">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 transition-colors">
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 bg-sky-50 text-sky-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-sky-100 transition-colors">
                  <User className="h-4 w-4" />
                  Login
                </Link>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-500">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-gray-100"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/shop" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-500 hover:bg-sky-50 rounded-md">Products</Link>
            <Link href="/dealer-locator" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-500 hover:bg-sky-50 rounded-md">Dealer Network</Link>
            <Link href="/apply-dealer" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-sky-500 hover:bg-sky-50 rounded-md">Partner With Us</Link>
            
            {isAuthenticated ? (
              <>
                <Link href={getDashboardLink()} className="block px-3 py-2 text-base font-medium text-sky-600 hover:bg-sky-50 rounded-md">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">Logout</button>
              </>
            ) : (
              <Link href="/login" className="block px-3 py-2 text-base font-medium text-sky-600 hover:bg-sky-50 rounded-md">Login / Register</Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
}