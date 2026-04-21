"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getProductDetails, getProductSuggestions } from '@/api/public/catalog';
import { addToCart } from '@/api/shared/cart';
import { requestDealership } from '@/api/dealer/requests';
import { Loader2, Star, ShoppingCart, ShieldCheck, MessageSquareText, ChevronLeft, Plus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DealerProductDetailsPage() {
  const { id } = useParams();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState('');
  
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [dealershipMsg, setDealershipMsg] = useState('');

  const fetchProductAndSimilar = async () => {
    try {
      const { data } = await getProductDetails(id as string);
      setProduct(data);
      
      const simRes = await getProductSuggestions(id as string);
      setSimilarProducts(simRes.data || []);
      
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchProductAndSimilar();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) return;
    setAddingToCart(true);
    setCartMsg('');
    try {
      await addToCart({ productId: product.id, quantity });
      setCartMsg('Added to cart successfully!');
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err: any) {
      setCartMsg(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleRequestDealership = async () => {
    try {
      setRequestingId(product.id);
      setDealershipMsg('');
      await requestDealership({ productId: product.id });
      setDealershipMsg('Dealership request submitted!');
      setProduct((prev: any) => ({ ...prev, dealershipStatus: 'PENDING' }));
      setTimeout(() => setDealershipMsg(''), 3000);
    } catch (err: any) {
      setDealershipMsg(err.response?.data?.message || 'Failed to request');
      setTimeout(() => setDealershipMsg(''), 4000);
    } finally {
      setRequestingId(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-transparent"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-transparent text-xl font-bold text-slate-700">Product not found.</div>;

  const isApproved = product.dealershipStatus === 'APPROVED';
  const isPending = product.dealershipStatus === 'PENDING';
  const hasDiscount = isApproved && product.discountPercentage > 0;
  const finalPrice = hasDiscount ? product.basePrice * (1 - product.discountPercentage / 100) : product.basePrice;

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-8 flex flex-col flex-1 pb-20">
      <div className="relative z-10 w-full">
        <Link href="/dealer/products" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
          <ChevronLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full">
            <div className="bg-slate-50 min-h-[400px] lg:min-h-[600px] p-12 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-slate-100 w-full">
              {hasDiscount && (
                <div className="absolute top-6 left-6 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-black uppercase tracking-wider shadow-sm z-10">
                  {product.discountPercentage}% OFF
                </div>
              )}
              <img src={product.images?.[0] || '/logo.svg'} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-2xl mix-blend-multiply" />
            </div>

            <div className="p-8 lg:p-14 flex flex-col justify-center w-full">
              <div className="mb-4 flex flex-col items-start gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-black rounded-full tracking-wider uppercase border border-sky-100">{product.categoryName}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">SKU: {product.sku}</span>
                </div>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-8 bg-amber-50 self-start px-3 py-1.5 rounded-lg border border-amber-100">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-4 w-4 ${star <= Math.round(product.averageRating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200 fill-slate-200'}`} />
                  ))}
                </div>
                <span className="text-sm font-black text-slate-800 ml-1">{product.averageRating.toFixed(1)}</span>
                <span className="text-xs font-bold text-slate-500">({product.reviewCount} reviews)</span>
              </div>

              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1 tracking-wider">Wholesale Base Price</p>
                <div className="flex items-end gap-3">
                  <p className="text-4xl lg:text-5xl font-black text-sky-600 tracking-tight">₹{finalPrice.toLocaleString()}</p>
                  {hasDiscount && (
                    <p className="text-xl font-bold text-slate-400 line-through mb-1">₹{product.basePrice.toLocaleString()}</p>
                  )}
                </div>
                {hasDiscount && (
                  <p className="text-xs font-bold text-emerald-600 mt-2">You save ₹{(product.basePrice - finalPrice).toLocaleString()} with your approved dealership.</p>
                )}
              </div>

              <p className="text-slate-600 text-base font-medium leading-relaxed mb-10">{product.description}</p>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="flex items-center border-2 border-slate-200 rounded-xl bg-white w-full sm:w-36 shadow-sm overflow-hidden">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 font-bold text-xl transition-colors">-</button>
                  <input type="text" value={quantity} readOnly className="w-full text-center bg-transparent font-black text-slate-900 outline-none" />
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 text-slate-400 hover:text-slate-900 hover:bg-slate-50 font-bold text-xl transition-colors">+</button>
                </div>
                <button 
                  onClick={handleAddToCart} disabled={addingToCart}
                  className="flex-1 flex justify-center items-center gap-2 py-4 px-8 rounded-xl font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors disabled:opacity-50 shadow-md shadow-sky-500/20"
                >
                  {addingToCart ? <Loader2 className="animate-spin h-5 w-5" /> : <ShoppingCart className="h-5 w-5" />}
                  Add to Cart
                </button>
                
                {isApproved ? (
                  <div className="flex-1 flex justify-center items-center gap-2 py-4 px-8 rounded-xl font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 cursor-default">
                    <ShieldCheck className="h-5 w-5" /> Dealership Approved
                  </div>
                ) : isPending ? (
                  <div className="flex-1 flex justify-center items-center gap-2 py-4 px-8 rounded-xl font-bold text-amber-600 bg-amber-50 border border-amber-200 cursor-default">
                    <Clock className="h-5 w-5" /> Request Pending
                  </div>
                ) : (
                  <button 
                    onClick={handleRequestDealership} disabled={requestingId === product.id}
                    className="flex-1 flex justify-center items-center gap-2 py-4 px-8 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors disabled:opacity-50 shadow-md shadow-slate-900/20"
                  >
                    {requestingId === product.id ? <Loader2 className="animate-spin h-5 w-5" /> : <ShieldCheck className="h-5 w-5" />}
                    Request Dealership
                  </button>
                )}
              </div>
              
              {cartMsg && <p className={`text-sm font-bold mt-2 p-3 rounded-lg border ${cartMsg.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{cartMsg}</p>}
              {dealershipMsg && <p className={`text-sm font-bold mt-2 p-3 rounded-lg border ${dealershipMsg.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{dealershipMsg}</p>}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm w-full">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-sky-500" /> Technical Specifications
            </h3>
            {product.compatibilities ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {Object.entries(product.compatibilities).map(([key, value]) => (
                  <div key={key} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-sky-100 hover:bg-sky-50/30 transition-colors">
                    <p className="text-[10px] font-black text-slate-400 mb-1 uppercase tracking-wider">{key}</p>
                    <p className="font-bold text-slate-900">{String(value)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-500 font-bold">No specific compatibilities listed.</p>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-200 shadow-sm w-full">
            <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Star className="w-6 h-6 text-amber-400" /> Customer Reviews
            </h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 w-full">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review: any) => (
                  <div key={review.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-sm hover:border-slate-200 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center font-black text-xs">
                          {review.userEmail?.charAt(0).toUpperCase() || 'V'}
                        </div>
                        <span className="font-bold text-slate-900">{review.userEmail?.split('@')[0] || 'Verified Buyer'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex bg-white px-2 py-1 rounded-full border border-slate-100">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 font-medium text-sm leading-relaxed">{review.comment}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-3">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                  <MessageSquareText className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-bold">No reviews yet for this product.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {similarProducts.length > 0 && (
          <div className="w-full mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900">Explore Similar Products</h2>
              <Link href="/dealer/products" className="text-sm font-bold text-sky-600 hover:underline">View Full Catalog</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {similarProducts.map((simProduct) => {
                const simIsApproved = simProduct.dealershipStatus === 'APPROVED';
                const simHasDiscount = simIsApproved && simProduct.discountPercentage > 0;
                const simFinalPrice = simHasDiscount ? simProduct.basePrice * (1 - simProduct.discountPercentage / 100) : simProduct.basePrice;

                return (
                  <Link 
                    href={`/dealer/products/${simProduct.id}`} 
                    key={simProduct.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full"
                  >
                    <div className="relative h-48 bg-slate-50 overflow-hidden p-4 border-b border-slate-100 flex-shrink-0 flex items-center justify-center">
                      {simHasDiscount && (
                        <div className="absolute top-2 left-2 bg-emerald-500 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm z-10">
                          {simProduct.discountPercentage}% OFF
                        </div>
                      )}
                      <img 
                        src={simProduct.images?.[0] || '/logo.svg'} 
                        alt={simProduct.name} 
                        className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                      />
                      <div className="absolute top-3 right-3 bg-white px-2 py-0.5 rounded-full text-[9px] font-black text-slate-500 border border-slate-200 uppercase tracking-wide shadow-sm">
                        {simProduct.categoryName}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1 bg-white">
                      <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">SKU: {simProduct.sku}</p>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                        {simProduct.name}
                      </h3>
                      <div className="mt-auto flex items-end justify-between pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-lg font-black text-sky-600">₹{simFinalPrice.toLocaleString()}</p>
                          {simHasDiscount && (
                            <p className="text-[10px] font-bold text-slate-400 line-through">₹{simProduct.basePrice.toLocaleString()}</p>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
                          <Plus className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}