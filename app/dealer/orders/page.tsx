"use client";

import { useState, useEffect } from 'react';
import { fetchUserOrders } from '@/api/orders';
import { Package, Search, Loader2, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { product: { _id: string, name: string, images: string[] }, quantity: number, price: number }[];
}

export default function DealerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchUserOrders();
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter(o => o._id.includes(searchQuery));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">Track and manage your bulk purchases.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No orders found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredOrders.map((order) => (
              <div key={order._id} className="p-6 hover:bg-gray-50/50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      Order #{order._id.slice(-8).toUpperCase()}
                      <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ml-2 ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-sky-100 text-sky-700'
                      }`}>
                        {order.status}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <div className="text-2xl font-bold text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                    <button className="text-sky-600 hover:text-sky-700 text-sm font-medium mt-1 flex items-center justify-end">
                      View Invoice <ExternalLink className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white border border-gray-100 p-3 rounded-xl">
                      <div className="h-14 w-14 bg-gray-50 rounded-lg relative overflow-hidden border border-gray-200 flex-shrink-0">
                        <Image src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1620064567006-25807ebc6319?auto=format&fit=crop&q=80&w=800'} alt={item.product?.name || 'Product'} fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{item.product?.name || 'Product unavailable'}</h4>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.quantity} units × ₹{item.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}