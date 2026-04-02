"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fetchProductById } from '@/api/products';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { Loader2, ArrowLeft, ShieldCheck, Truck, Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface PricingTier {
  minQuantity: number;
  price: number;
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  hsnCode: string;
  category: { name: string; slug: string };
  description: string;
  specifications: Record<string, string>;
  images: string[];
  basePrice: number;
  bulkPricing: PricingTier[];
  moq: number;
  stock: number;
  certifications: string[];
  warrantyInfo: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchProductById(params.id as string);
        setProduct(data);
        setQuantity(data.moq || 1);
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) loadProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loader2 className="h-12 w-12 text-sky-500 animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <button onClick={() => router.back()} className="text-sky-600 hover:text-sky-700 font-medium flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </button>
      </div>
    );
  }

  const isDealer = isAuthenticated && user?.role === 'dealer';
  
  let currentPrice = product.basePrice;
  if (isDealer && product.bulkPricing?.length > 0) {
    const applicableTier = [...product.bulkPricing]
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find(tier => quantity >= tier.minQuantity);
    if (applicableTier) {
      currentPrice = applicableTier.price;
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-sky-600">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link href="/shop" className="hover:text-sky-600">Catalog</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 font-medium">{product.category?.name}</span>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:border-r border-gray-100">
              <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden mb-6 border border-gray-100">
                <Image 
                  src={product.images[activeImage] || 'https://images.unsplash.com/photo-1620064567006-25807ebc6319?auto=format&fit=crop&q=80&w=800'} 
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-sky-500 shadow-md' : 'border-transparent hover:border-gray-200'}`}
                    >
                      <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-8 lg:p-12 flex flex-col">
              <div className="mb-2">
                <span className="text-xs font-bold tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-full uppercase">
                  {product.category?.name}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
                <div>SKU: <span className="font-mono text-gray-900">{product.sku}</span></div>
                <div>HSN: <span className="font-mono text-gray-900">{product.hsnCode}</span></div>
                <div className={`flex items-center font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </div>
              </div>

              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">Price per unit</div>
                <div className="text-4xl font-bold text-gray-900 flex items-end gap-3">
                  ₹{currentPrice.toLocaleString('en-IN')}
                  {isDealer && quantity >= (product.bulkPricing?.[0]?.minQuantity || 0) && (
                    <span className="text-lg text-gray-400 line-through mb-1">₹{product.basePrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>

              {isDealer && product.bulkPricing?.length > 0 && (
                <div className="mb-8 bg-sky-50 rounded-2xl p-6 border border-sky-100">
                  <h4 className="font-bold text-sky-900 mb-4 text-sm uppercase tracking-wider">Dealer Bulk Pricing</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-sky-700 pb-2 border-b border-sky-200/50">
                      <span>Quantity</span>
                      <span>Price / Unit</span>
                    </div>
                    {product.bulkPricing.map((tier, idx) => (
                      <div key={idx} className="flex justify-between font-medium text-sky-900">
                        <span>{tier.minQuantity}+ units</span>
                        <span>₹{tier.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50">
                  <button 
                    onClick={() => setQuantity(Math.max(product.moq || 1, quantity - 1))}
                    className="px-5 py-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-l-xl transition-colors font-medium"
                  >-</button>
                  <div className="px-6 py-4 font-bold text-gray-900 min-w-[4rem] text-center border-x border-gray-200 bg-white">
                    {quantity}
                  </div>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-5 py-4 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-r-xl transition-colors font-medium"
                  >+</button>
                </div>
                <button 
                  disabled={product.stock === 0}
                  className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                <div className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-sky-500 mr-3 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Certified Genuine</h5>
                    <p className="text-xs text-gray-500 mt-1">{product.certifications?.join(', ')}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Truck className="h-6 w-6 text-sky-500 mr-3 flex-shrink-0" />
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">Nationwide Delivery</h5>
                    <p className="text-xs text-gray-500 mt-1">Dispatched within 24-48 hours</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Product Description</h3>
            <div className="prose max-w-none text-gray-600 leading-relaxed">
              {product.description}
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Warranty Information</h3>
            <p className="text-gray-600 leading-relaxed">{product.warrantyInfo}</p>
          </div>

          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100 h-fit">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Specifications</h3>
            <div className="space-y-4">
              {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex flex-col border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <span className="text-sm text-gray-500 mb-1">{key}</span>
                  <span className="font-medium text-gray-900">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}