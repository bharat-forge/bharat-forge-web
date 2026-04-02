"use client";

import { useState, useEffect } from 'react';
import { fetchProducts } from '@/api/products';
import { createOrder } from '@/api/orders';
import { Search, Plus, Minus, ShoppingCart, Loader2, Package } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  sku: string;
  price: number;
  basePrice: number;
  stock: number;
  moq: number;
  images: string[];
  bulkPricing: { minQuantity: number; price: number }[];
}

export default function BulkOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleQuantityChange = (product: Product, newQuantity: number) => {
    if (newQuantity < 0) return;
    
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product._id === product._id);
      
      if (newQuantity === 0) {
        return prevCart.filter(item => item.product._id !== product._id);
      }

      if (existing) {
        return prevCart.map(item => 
          item.product._id === product._id ? { ...item, quantity: newQuantity } : item
        );
      }

      const initialQty = Math.max(newQuantity, product.moq || 1);
      return [...prevCart, { product, quantity: initialQty }];
    });
  };

  const getApplicablePrice = (product: Product, quantity: number) => {
    let currentPrice = product.basePrice;
    if (product.bulkPricing?.length > 0) {
      const applicableTier = [...product.bulkPricing]
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find(tier => quantity >= tier.minQuantity);
      if (applicableTier) currentPrice = applicableTier.price;
    }
    return currentPrice;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + (getApplicablePrice(item.product, item.quantity) * item.quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    
    try {
      const orderItems = cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        price: getApplicablePrice(item.product, item.quantity)
      }));

      const payload = {
        items: orderItems,
        shippingAddress: {
          street: "Dealer Registered Address",
          city: "Dealer City",
          state: "Dealer State",
          pincode: "000000",
          country: "India"
        },
        paymentMethod: "credit_term"
      };

      await createOrder(payload);
      setCart([]);
      router.push('/dealer/dashboard');
    } catch (error) {
      console.error("Failed to create order", error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 h-[calc(100vh-8rem)]">
      
      <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Order Catalog</h2>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by SKU or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filteredProducts.map(product => {
            const cartItem = cart.find(item => item.product._id === product._id);
            const currentQty = cartItem?.quantity || 0;
            const price = getApplicablePrice(product, currentQty || product.moq || 1);

            return (
              <div key={product._id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:border-sky-200 transition-colors">
                <div className="h-16 w-16 bg-gray-50 rounded-lg overflow-hidden relative flex-shrink-0">
                  <Image src={product.images[0] || ''} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-sky-600 font-mono mb-1">{product.sku}</div>
                  <h4 className="font-bold text-gray-900 truncate">{product.name}</h4>
                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                    <span>₹{price.toLocaleString('en-IN')} / unit</span>
                    {product.moq > 1 && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">MOQ: {product.moq}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => handleQuantityChange(product, currentQty > 0 ? currentQty - 1 : 0)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white rounded shadow-sm"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900 text-sm">
                    {currentQty}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange(product, currentQty === 0 ? Math.max(1, product.moq) : currentQty + 1)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-white rounded shadow-sm"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-sky-500" />
            Current Order
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Package className="h-12 w-12 mb-2 opacity-50" />
              <p className="text-sm">Cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product._id} className="flex justify-between items-start border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="pr-4">
                  <h5 className="font-bold text-gray-900 text-sm line-clamp-2">{item.product.name}</h5>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.quantity} units @ ₹{getApplicablePrice(item.product, item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="font-bold text-gray-900 text-sm whitespace-nowrap">
                  ₹{(getApplicablePrice(item.product, item.quantity) * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-500 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-gray-900">₹{calculateTotal().toLocaleString('en-IN')}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || submitting}
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-500/30 transition-all disabled:opacity-50 flex items-center justify-center"
          >
            {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm Order'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-4">
            Order will be placed against your authorized credit terms.
          </p>
        </div>
      </div>
    </div>
  );
}