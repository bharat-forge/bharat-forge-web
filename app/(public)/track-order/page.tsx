"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Truck, CheckCircle, ArrowRight } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [tracking, setTracking] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setTracking(true);
    setTimeout(() => {
      setTracking(false);
      setSearched(true);
    }, 1500);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gray-900 pt-20 pb-24 border-b border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c80a30?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Track Your <span className="text-sky-500">Shipment</span></h1>
          <p className="text-gray-400 text-lg mb-10">Enter your tracking number or Order ID to get real-time status updates on your delivery.</p>
          
          <form onSubmit={handleTrack} className="bg-white p-2 rounded-2xl shadow-2xl flex items-center">
            <div className="pl-4">
              <Search className="h-6 w-6 text-sky-500" />
            </div>
            <input 
              type="text" 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="e.g. ORD-12345678"
              className="w-full px-4 py-4 focus:outline-none text-gray-900 text-lg bg-transparent uppercase"
            />
            <button 
              type="submit" 
              disabled={tracking}
              className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 rounded-xl font-medium transition-colors flex items-center disabled:opacity-50"
            >
              {tracking ? 'Locating...' : 'Track'}
            </button>
          </form>
        </div>
      </div>

      {searched && (
        <div className="max-w-4xl mx-auto px-4 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-gray-100 pb-8">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Order Number</p>
                <h2 className="text-2xl font-bold text-gray-900">{orderId.toUpperCase()}</h2>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <p className="text-sm text-gray-500 font-medium mb-1">Expected Delivery</p>
                <h2 className="text-2xl font-bold text-sky-600">02 April, 2026</h2>
              </div>
            </div>

            <div className="relative">
              <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-100 -translate-x-1/2"></div>
              
              <div className="space-y-12">
                <div className="relative flex items-center md:justify-center">
                  <div className="hidden md:block w-1/2 pr-12 text-right">
                    <h4 className="font-bold text-gray-900">Order Confirmed</h4>
                    <p className="text-sm text-gray-500">Your order has been verified and processed.</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-green-500 text-white flex items-center justify-center relative z-10 shadow-md ring-4 ring-white shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="md:w-1/2 pl-6 md:pl-12">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">March 28, 10:30 AM</span>
                    <div className="md:hidden">
                      <h4 className="font-bold text-gray-900">Order Confirmed</h4>
                      <p className="text-sm text-gray-500">Your order has been verified and processed.</p>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center md:justify-center">
                  <div className="hidden md:block w-1/2 pr-12 text-right">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">March 29, 02:15 PM</span>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-sky-500 text-white flex items-center justify-center relative z-10 shadow-md ring-4 ring-white shrink-0">
                    <Package className="h-6 w-6" />
                  </div>
                  <div className="md:w-1/2 pl-6 md:pl-12">
                    <h4 className="font-bold text-gray-900">Dispatched from Warehouse</h4>
                    <p className="text-sm text-gray-500">Package handed over to logistics partner.</p>
                    <div className="md:hidden mt-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">March 29, 02:15 PM</span>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center md:justify-center">
                  <div className="hidden md:block w-1/2 pr-12 text-right">
                    <h4 className="font-bold text-gray-900">In Transit</h4>
                    <p className="text-sm text-gray-500">Arrived at regional sorting hub (Kolkata).</p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center relative z-10 ring-4 ring-white shrink-0">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div className="md:w-1/2 pl-6 md:pl-12">
                    <span className="text-xs font-bold text-sky-600 uppercase tracking-wider block mb-1">March 31, 09:00 AM (Current)</span>
                    <div className="md:hidden">
                      <h4 className="font-bold text-gray-900">In Transit</h4>
                      <p className="text-sm text-gray-500">Arrived at regional sorting hub (Kolkata).</p>
                    </div>
                  </div>
                </div>

                <div className="relative flex items-center md:justify-center opacity-40">
                  <div className="hidden md:block w-1/2 pr-12 text-right">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Pending</span>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center relative z-10 ring-4 ring-white shrink-0">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div className="md:w-1/2 pl-6 md:pl-12">
                    <h4 className="font-bold text-gray-900">Delivered</h4>
                    <p className="text-sm text-gray-500">Package will be handed over to you.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}