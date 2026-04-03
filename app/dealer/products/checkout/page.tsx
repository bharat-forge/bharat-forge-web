"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { clearCart } from '@/store/slices/cartSlice';
import { processCheckout } from '@/api/shared/checkout';
import { CreditCard, ArrowRight, ShieldCheck, Truck, Package, ChevronLeft } from 'lucide-react';
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

export default function DealerCheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { items } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ street: '', city: '', state: '', pincode: '', country: 'India' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (items.length === 0) {
      router.push('/dealer/products/cart');
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
    if (!formData.street || !formData.city || !formData.state || !formData.pincode) {
      setError('Please fill in all address fields.');
      return;
    }

    try {
      setIsLoading(true);
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        setError('Failed to load payment gateway.');
        setIsLoading(false);
        return;
      }

      const res = await processCheckout({ shippingAddress: formData, paymentMethod: 'razorpay' });
      const { razorpayOrder } = res.data;

      if (!razorpayOrder) throw new Error('Invalid response from server');

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', 
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'Bharat Forge Dealer Portal',
        description: 'Wholesale Order Payment',
        order_id: razorpayOrder.id,
        prefill: { email: user?.email || '' },
        theme: { color: '#0ea5e9' },
        handler: async function () {
          dispatch(clearCart());
          router.push('/dealer/orders?success=true');
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setError(response.error.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-transparent pb-20">
      <Link href="/dealer/products/cart" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors font-medium">
        <ChevronLeft className="w-4 h-4" /> Back to Cart
      </Link>

      <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-8 flex items-center gap-3">
        <ShieldCheck className="w-8 h-8 text-sky-500" /> Secure Dealer Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-sky-500" /> Shipping Destination
            </h2>
            {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-sm font-bold">{error}</div>}

            <form id="checkout-form" onSubmit={handleCheckout} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Street Address</label>
                <input type="text" name="street" value={formData.street} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none" required />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">State</label>
                  <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none" required />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Pincode</label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleInputChange} className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Country</label>
                  <input type="text" name="country" value={formData.country} disabled className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed outline-none" />
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
                <p className="text-sm text-slate-500 font-medium">Credit/Debit Card, UPI, NetBanking</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-xl p-2 relative flex-shrink-0 border border-slate-100">
                    {item.images?.[0] ? <Image src={item.images[0]} alt={item.name} fill className="object-contain p-1" /> : <Package className="w-full h-full text-slate-300 p-2" />}
                    <div className="absolute -top-2 -right-2 bg-slate-800 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">{item.quantity}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-xs font-bold text-slate-400">SKU: {item.sku}</p>
                  </div>
                  <div className="text-sm font-black text-slate-900">₹{((item.price || 0) * item.quantity).toLocaleString()}</div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6 border-t border-slate-100 pt-6">
              <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                <span>Subtotal</span><span className="font-bold text-slate-900">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                <span>Tax (GST 18%)</span><span className="font-bold text-slate-900">₹{tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-slate-900">Total to Pay</span>
                <span className="text-2xl font-black text-sky-600">₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button type="submit" form="checkout-form" disabled={isLoading} className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-lg shadow-slate-900/20">
              {isLoading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <>Complete Payment <ArrowRight className="w-5 h-5" /></>}
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 font-bold flex items-center justify-center gap-1"><ShieldCheck className="w-4 h-4" /> Secure 256-bit SSL encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
}