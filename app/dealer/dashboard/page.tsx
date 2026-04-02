"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, TrendingUp, Clock, FileText, Loader2 } from 'lucide-react';
import { fetchDealerProfile } from '@/api/dealers';
import { fetchUserOrders } from '@/api/orders';

export default function DealerDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profileData, ordersData] = await Promise.all([
          fetchDealerProfile(),
          fetchUserOrders()
        ]);
        setProfile(profileData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
      </div>
    );
  }

  const recentOrders = orders.slice(0, 5);
  const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile?.businessName || 'Dealer'}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-gray-500">Account Status:</span>
          <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
            profile?.status === 'approved' ? 'bg-green-100 text-green-700' : 
            profile?.status === 'pending' ? 'bg-orange-100 text-orange-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {profile?.status || 'Pending'}
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-gray-500">Pricing Tier:</span>
          <span className="bg-sky-100 text-sky-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">
            {profile?.pricingTier || 'Standard'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-sky-100 flex items-center justify-center mb-4">
            <Package className="h-6 w-6 text-sky-600" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{orders.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Spent</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">₹{totalSpent.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Pending Delivery</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">
            {orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Available Invoices</h3>
          <p className="text-3xl font-bold text-gray-900 mt-1">{orders.filter(o => o.paymentStatus === 'completed').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
        </div>
        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {recentOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-50 last:border-0">
                    <td className="py-4 font-mono text-gray-900">...{order._id.slice(-6)}</td>
                    <td className="py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 text-gray-900">{order.items.length} items</td>
                    <td className="py-4 font-medium text-gray-900">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-sky-50 text-sky-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No orders found. Head over to the Bulk Order section to place your first order.
          </div>
        )}
      </div>
    </div>
  );
}