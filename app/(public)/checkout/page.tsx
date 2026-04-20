"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { clearCart } from '@/store/slices/cartSlice';
import { processCheckout, verifyCheckout } from '@/api/shared/checkout';
import { MapPin, CreditCard, ArrowRight, ShieldCheck, Truck, Package, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });
  const [error, setError] = useState('');

  const formDataRef = useRef(formData);
  const agreedToTermsRef = useRef(agreedToTerms);

  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  useEffect(() => {
    agreedToTermsRef.current = agreedToTerms;
  }, [agreedToTerms]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    } else if (items.length === 0) {
      router.push('/cart');
    }
  }, [isAuthenticated, items, router]);

  const subtotal = items.reduce((acc, item) => acc + ((item.price || 0) * item.quantity), 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const currentFormData = formDataRef.current;
    const currentAgreedToTerms = agreedToTermsRef.current;

    if (!currentFormData.street || !currentFormData.city || !currentFormData.state || !currentFormData.pincode) {
      setError('Please fill in all address fields.');
      return;
    }

    if (!currentAgreedToTerms) {
      setError('Please agree to the Terms and Conditions before proceeding.');
      return;
    }

    try {
      setIsLoading(true);

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setError('Failed to load payment gateway. Please check your connection.');
        setIsLoading(false);
        return;
      }

      const res = await processCheckout({
        shippingAddress: currentFormData,
        paymentMethod: 'razorpay'
      });

      const { razorpayOrder } = res.data;

      if (!razorpayOrder) {
        throw new Error('Invalid response from server');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', 
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Bharat Forge',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        prefill: {
          email: user?.email || '',
        },
        theme: {
          color: '#0ea5e9'
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await verifyCheckout({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyRes.data.success) {
              dispatch(clearCart());
              router.push('/orders?success=true');
            } else {
              setError('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            setError('An error occurred during payment verification.');
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description || 'Payment failed. Please try again.');
      });

      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong during checkout.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-20 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-sky-500" /> Secure Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-sky-500" /> Shipping Information
              </h2>
              
              {error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    placeholder="123 Main St, Apt 4B"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Mumbai"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Maharashtra"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="400001"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none"
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-500" /> Payment Method
              </h2>
              <div className="p-4 rounded-xl border-2 border-sky-500 bg-sky-50 flex items-center gap-4 cursor-pointer">
                <div className="w-6 h-6 rounded-full border-4 border-sky-500 bg-white"></div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900">Pay Online (Razorpay)</h3>
                  <p className="text-sm text-slate-500">Credit/Debit Card, UPI, NetBanking</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm sticky top-28">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 relative flex-shrink-0 border border-slate-100">
                      {item.images?.[0] ? (
                        <Image src={item.images[0]} alt={item.name} fill className="object-contain p-1" />
                      ) : (
                        <Package className="w-full h-full text-slate-300 p-2" />
                      )}
                      <div className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.sku}</p>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      ₹{((item.price || 0) * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-6 border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Tax (GST 18%)</span>
                  <span className="font-semibold text-slate-900">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  <span className="font-semibold text-emerald-600">Free</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">Total to Pay</span>
                  <span className="text-2xl font-black text-sky-600">₹{total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <input 
                  type="checkbox" 
                  id="terms" 
                  checked={agreedToTerms} 
                  onChange={(e) => setAgreedToTerms(e.target.checked)} 
                  className="w-5 h-5 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer" 
                />
                <label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer select-none font-medium">
                  I agree to the <Link href="/terms" target="_blank" className="text-sky-600 hover:text-sky-700 font-bold hover:underline">Terms and Conditions</Link>
                </label>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isLoading || !agreedToTerms}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>Complete Payment <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-4 font-medium flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL encryption
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}