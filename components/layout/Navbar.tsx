"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard, ChevronDown, Package, LifeBuoy, MessageSquare } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { setCart } from '@/store/slices/cartSlice';
import { getMyCart } from '@/api/shared/cart';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { totalQuantity } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { scrollY } = useScroll();

  const isHome = pathname === '/';
  const isTransparent = isHome && !scrolled;

  useEffect(() => {
    setMounted(true);
    const unsubscribe = scrollY.onChange((latest) => setScrolled(latest > 50));
    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) setIsMoreMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getMyCart()
        .then((res) => {
          const items = Array.isArray(res.data) ? res.data : res.data?.items || [];
          dispatch(setCart(items));
        })
        .catch(() => { });
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setIsUserMenuOpen(false);
    setIsOpen(false);
    router.push('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin/categories';
    if (user?.role === 'DEALER') return '/dealer/products';
    return '/profile';
  };

  const textColorClass = isTransparent ? 'text-white hover:text-sky-300' : 'text-slate-700 hover:text-sky-500';
  const iconColorClass = isTransparent ? 'text-white' : 'text-slate-700';
  const titleColorClass = isTransparent ? 'text-white' : 'text-slate-900';

  return (
    <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${isTransparent ? 'bg-transparent' : 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 relative">
              {isTransparent && <div className="absolute inset-0 bg-sky-400 blur-xl opacity-40 rounded-full" />}
              <Image src="/logo_round.svg" alt="Bharat Forge Logo" width={40} height={32} className="object-contain relative z-10" priority />
            </Link>
            <Link href="/" className="flex items-center gap-2">
              <span className={`font-bold text-xl tracking-tight ${titleColorClass}`}>
                Bharat<span className="text-sky-500">Forge</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center justify-end flex-1 space-x-4 lg:space-x-6 xl:space-x-8 pl-8">
            <Link href="/shop" className={`text-sm font-medium transition-colors whitespace-nowrap ${textColorClass}`}>Products</Link>
            <Link href="/about" className={`text-sm font-medium transition-colors whitespace-nowrap ${textColorClass}`}>About Us</Link>
            <Link href="/find-product" className={`hidden lg:block text-sm font-medium transition-colors whitespace-nowrap ${textColorClass}`}>Find Your Product</Link>
            <Link href="/dealer-locator" className={`hidden lg:block text-sm font-medium transition-colors whitespace-nowrap ${textColorClass}`}>Dealer Locator</Link>
            <Link href="/blogs" className={`hidden xl:block text-sm font-medium transition-colors whitespace-nowrap ${textColorClass}`}>Blogs</Link>
            <Link href="/contact" className={`hidden xl:block text-sm font-medium transition-colors whitespace-nowrap ${textColorClass}`}>Contact Us</Link>
            <Link href="/faq" className={`hidden xl:block text-sm font-medium transition-colors whitespace-nowrap ${textColorClass}`}>FAQ</Link>

            <div className="hidden md:block xl:hidden relative" ref={moreMenuRef}>
              <button onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)} className={`flex items-center gap-1 text-sm font-medium transition-colors ${textColorClass}`}>
                More <ChevronDown className={`h-4 w-4 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isMoreMenuOpen && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-4 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2">
                    <Link href="/find-product" onClick={() => setIsMoreMenuOpen(false)} className="block lg:hidden px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors">Find Your Product</Link>
                    <Link href="/dealer-locator" onClick={() => setIsMoreMenuOpen(false)} className="block lg:hidden px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors">Dealer Locator</Link>
                    <Link href="/blogs" onClick={() => setIsMoreMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors">Blogs</Link>
                    <Link href="/contact" onClick={() => setIsMoreMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors">Contact Us</Link>
                    <Link href="/faq" onClick={() => setIsMoreMenuOpen(false)} className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors">FAQ</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className={`flex items-center gap-4 ml-4 pl-4 border-l ${isTransparent ? 'border-white/20' : 'border-slate-200'}`}>
              {mounted && isAuthenticated && (
                <Link href="/cart" className={`${textColorClass} relative`}>
                  <ShoppingCart className="h-5 w-5" />
                  <AnimatePresence>
                    {totalQuantity > 0 && (
                      <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-2 -right-2 bg-sky-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                        {totalQuantity}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              )}

              {mounted ? (
                isAuthenticated ? (
                  user?.role === 'USER' ? (
                    <div className="relative" ref={userMenuRef}>
                      <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${isTransparent ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}>
                        <User className="h-4 w-4" /> Account <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {isUserMenuOpen && (
                          <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2">
                            <Link href="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"><User className="h-4 w-4" /> My Account</Link>
                            <Link href="/orders" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"><Package className="h-4 w-4" /> My Orders</Link>
                            <Link href="/support" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"><LifeBuoy className="h-4 w-4" /> Support</Link>
                            <Link href="/chat" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"><MessageSquare className="h-4 w-4" /> Chat</Link>
                            <div className="border-t border-slate-100 my-1"></div>
                            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"><LogOut className="h-4 w-4" /> Logout</button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Link href={getDashboardLink()} className={`text-sm font-medium flex items-center gap-1 ${isTransparent ? 'text-sky-300 hover:text-white' : 'text-sky-600 hover:text-sky-700'}`}>
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <button onClick={handleLogout} className={`${textColorClass}`}>
                        <LogOut className="h-5 w-5" />
                      </button>
                    </div>
                  )
                ) : (
                  <Link href="/login" className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${isTransparent ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-sky-50 border-sky-100 text-sky-600 hover:bg-sky-100'}`}>
                    <User className="h-4 w-4" /> Login
                  </Link>
                )
              ) : (
                <div className={`w-24 h-8 rounded-full animate-pulse ${isTransparent ? 'bg-white/20' : 'bg-slate-100'}`}></div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <Link href="/shop" className={`flex items-center text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${isTransparent ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-sky-50 border-sky-100 text-sky-600 hover:bg-sky-100'}`}>
              Products
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className={`p-1 transition-colors ${iconColorClass}`}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="md:hidden border-t border-slate-100 bg-white overflow-hidden shadow-xl">
            <div className="px-4 pt-2 pb-6 space-y-1">
              <Link href="/about" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg">About Us</Link>
              <Link href="/shop" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg">Products</Link>
              <Link href="/find-product" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg">Find Your Product</Link>
              <Link href="/dealer-locator" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg">Dealer Locator</Link>
              <Link href="/blogs" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg">Blogs</Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg">Contact Us</Link>
              
              {mounted && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg">
                        <span className="flex items-center gap-2"><ShoppingCart className="h-5 w-5" /> Cart</span>
                        {totalQuantity > 0 && <span className="bg-sky-500 text-white text-xs font-bold px-2 py-1 rounded-full">{totalQuantity}</span>}
                      </Link>
                      {user?.role === 'USER' ? (
                        <>
                          <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg"><User className="h-5 w-5" /> My Account</Link>
                          <Link href="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg"><Package className="h-5 w-5" /> My Orders</Link>
                          <Link href="/support" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-3 text-base font-medium text-slate-700 hover:text-sky-500 hover:bg-slate-50 rounded-lg"><LifeBuoy className="h-5 w-5" /> Support</Link>
                        </>
                      ) : (
                        <Link href={getDashboardLink()} onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-3 py-3 text-base font-medium text-sky-600 hover:bg-sky-50 rounded-lg"><LayoutDashboard className="h-5 w-5" /> Dashboard</Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-3 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-lg mt-2"><LogOut className="h-5 w-5" /> Logout</button>
                    </div>
                  ) : (
                    <Link href="/login" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-2 w-full bg-sky-50 text-sky-600 px-4 py-3 rounded-xl text-base font-medium hover:bg-sky-100 transition-colors mt-2"><User className="h-5 w-5" /> Login to Account</Link>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}