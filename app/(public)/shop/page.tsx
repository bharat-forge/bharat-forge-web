"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Package, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { fetchProducts } from '@/api/products';

interface Product {
  _id: string;
  name: string;
  sku: string;
  category: { name: string; slug: string };
  price: number;
  basePrice: number;
  images: string[];
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Passenger Tyres', 'Commercial Tyres', 'SUV Tyres', 'EV Tyres', 'Batteries', 'Alloy Wheels', 'Lubricants'];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const params: any = {};
        if (activeCategory && activeCategory !== 'All') params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        
        const data = await fetchProducts(params);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      loadProducts();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [activeCategory, searchQuery]);

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white border-b border-gray-200 pt-10 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product <span className="text-sky-500">Catalog</span></h1>
          <p className="text-gray-500 max-w-2xl">Browse our extensive inventory of premium imported tyres and advanced battery systems. Registered dealers can access bulk pricing on product pages.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8 flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-6 pb-4 border-b border-gray-100">
              <Filter className="h-5 w-5 text-sky-500" />
              Categories
            </div>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${activeCategory === cat || (!activeCategory && cat === 'All') ? 'bg-sky-50 text-sky-600 font-medium' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex-1">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by SKU or product name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, idx) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={product._id}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-sky-100 transition-all group flex flex-col"
                >
                  <Link href={`/shop/${product._id}`} className="relative h-64 bg-gray-100 overflow-hidden block">
                    <Image 
                      src={product.images[0] || 'https://via.placeholder.com/800x600?text=No+Image'} 
                      alt={product.name} 
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                      {product.category?.name || 'Uncategorized'}
                    </div>
                  </Link>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-xs text-sky-500 font-mono mb-2">{product.sku}</div>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight flex-1">
                      <Link href={`/shop/${product._id}`} className="hover:text-sky-500 transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div>
                        <span className="text-xs text-gray-500 block mb-1">Base Price</span>
                        <span className="font-bold text-xl text-gray-900">₹{product.basePrice?.toLocaleString('en-IN')}</span>
                      </div>
                      <Link 
                        href={`/shop/${product._id}`}
                        className="h-10 w-10 bg-sky-50 hover:bg-sky-500 text-sky-600 hover:text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <Package className="h-5 w-5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}