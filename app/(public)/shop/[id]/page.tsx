"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { setCart } from '@/store/slices/cartSlice';
import { getProductDetails, getProductSuggestions } from '@/api/public/catalog';
import { addToCart, getMyCart } from '@/api/shared/cart';
import { submitProductReview } from '@/api/user/productReviews';
import { Loader2, Star, ShoppingCart, ShieldCheck, MapPin, MessageSquareText, Send, ChevronLeft, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  
  const [product, setProduct] = useState<any>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProductAndSimilar = async () => {
    try {
      const { data } = await getProductDetails(id as string);
      setProduct(data);

      const simRes = await getProductSuggestions(id as string);
      const simData = simRes.data?.data || Array.isArray(simRes.data) ? simRes.data : [];
      setSimilarProducts(simData.filter((p: any) => p.id !== data.id).slice(0, 4));

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
    if (!isAuthenticated) {
      setCartMsg('Please login to add items to cart.');
      return;
    }
    setAddingToCart(true);
    setCartMsg('');
    try {
      await addToCart({ productId: product.id, quantity });
      
      const cartRes = await getMyCart();
      const items = Array.isArray(cartRes.data) ? cartRes.data : cartRes.data?.items || [];
      dispatch(setCart(items));

      setCartMsg('Added to cart successfully!');
      setTimeout(() => setCartMsg(''), 3000);
    } catch (err: any) {
      setCartMsg(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return router.push('/login');
    if (!reviewText.trim()) return;
    
    setSubmittingReview(true);
    try {
      await submitProductReview({ productId: product.id, rating: reviewRating, comment: reviewText });
      setReviewText('');
      setReviewRating(5);
      await fetchProductAndSimilar();
      alert('Review submitted successfully!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-xl font-bold text-slate-700">Product not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 relative pb-20 w-full">
      <div className="absolute inset-0 z-0 h-[40vh] w-full bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12 space-y-8 flex flex-col flex-1 w-full">
        <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-2 transition-colors font-bold bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 self-start">
          <ChevronLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 w-full">
            <div className="bg-white min-h-[400px] lg:min-h-[600px] p-12 flex items-center justify-center relative border-b lg:border-b-0 lg:border-r border-slate-100 w-full">
              <img src={product.images?.[0] || '/logo.svg'} alt={product.name} className="max-w-full max-h-full object-contain drop-shadow-2xl" />
            </div>

            <div className="p-8 lg:p-14 flex flex-col justify-center w-full">
              <div className="mb-4 flex flex-col items-start gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-sky-50 text-sky-600 text-[10px] font-black rounded-full tracking-wider uppercase border border-sky-100">{product.categoryName}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">SKU: {product.sku}</span>
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
                <span className="text-xs font-bold text-slate-500">({product.reviewCount} verified reviews)</span>
              </div>

              <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs uppercase font-bold text-slate-400 mb-1 tracking-wider">Base Price</p>
                <p className="text-4xl lg:text-5xl font-black text-sky-600 tracking-tight">₹{product.basePrice.toLocaleString()}</p>
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
              </div>
              {cartMsg && <p className={`text-sm font-bold mt-2 p-3 rounded-lg border ${cartMsg.includes('success') ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>{cartMsg}</p>}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          <div className="lg:col-span-2 space-y-8 w-full">
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
              
              {(!user || user.role === 'USER') && (
                <form onSubmit={handleReviewSubmit} className="mb-10 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 mb-4">Write a Review</h4>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setReviewRating(star)} className="focus:outline-none transition-transform hover:scale-110">
                        <Star className={`h-8 w-8 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <textarea
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder={isAuthenticated ? "Share your experience with this product..." : "Please log in to write a review"}
                      disabled={!isAuthenticated || submittingReview}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none resize-none min-h-[120px] transition-colors disabled:bg-slate-50 text-sm font-medium"
                    />
                    <button type="submit" disabled={!isAuthenticated || submittingReview || !reviewText.trim()} className="absolute bottom-4 right-4 p-3 bg-sky-500 text-white rounded-xl hover:bg-sky-600 disabled:opacity-50 transition-colors shadow-md shadow-sky-500/20">
                      {submittingReview ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 ml-0.5" />}
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-4 w-full">
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
                    <p className="text-slate-500 font-bold">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900 rounded-3xl p-8 lg:p-10 shadow-lg shadow-slate-900/20 text-white h-fit sticky top-28 w-full">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="h-8 w-8 text-sky-400" />
              <h3 className="text-2xl font-black">Authorized Dealers</h3>
            </div>
            <p className="text-slate-400 text-sm mb-8 font-medium leading-relaxed">Purchase directly or get support from our certified partners in your region.</p>
            
            <div className="space-y-4 w-full">
              {product.authorizedDealers && product.authorizedDealers.length > 0 ? (
                product.authorizedDealers.map((dealer: any) => (
                  <div key={dealer.id} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-colors w-full">
                    <h4 className="text-lg font-bold text-white mb-2">{dealer.businessName}</h4>
                    <div className="flex items-center gap-2 text-sky-400 text-sm font-bold mb-5">
                      <MapPin className="h-4 w-4" /> {dealer.city}, {dealer.state}
                    </div>
                    <Link href={`/dealer-profile/${dealer.id}`} className="w-full py-3 bg-slate-700 hover:bg-sky-500 text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                      <MessageSquareText className="h-4 w-4" /> View Profile & Contact
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 bg-slate-800/50 rounded-2xl border border-slate-700 w-full">
                  <p className="text-slate-400 text-sm font-medium leading-relaxed">No localized dealers available for this product yet. Please purchase directly.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Similar Products Recommendation Section */}
        {similarProducts.length > 0 && (
          <div className="w-full mt-12 border-t border-slate-200 pt-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-black text-slate-900">Explore Similar Products</h2>
              <Link href="/shop" className="text-sm font-bold text-sky-600 hover:underline">View Full Catalog</Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
              {similarProducts.map((simProduct) => (
                <Link 
                  href={`/shop/${simProduct.id}`} 
                  key={simProduct.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full"
                >
                  <div className="relative h-56 bg-white overflow-hidden p-6 border-b border-slate-100 flex-shrink-0 flex items-center justify-center">
                    <img 
                      src={simProduct.images?.[0] || '/logo.svg'} 
                      alt={simProduct.name} 
                      className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-wide shadow-sm">
                      {simProduct.categoryName}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1 bg-white">
                    <p className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">SKU: {simProduct.sku}</p>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2 group-hover:text-sky-600 transition-colors line-clamp-2">
                      {simProduct.name}
                    </h3>
                    <div className="mt-auto flex items-end justify-between pt-5 border-t border-slate-50">
                      <p className="text-2xl font-black text-sky-600 tracking-tight">₹{simProduct.basePrice.toLocaleString()}</p>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-sm">
                        <Plus className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}