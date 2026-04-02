"use client";

import { useState, useEffect } from 'react';
import { fetchUserOrders } from '@/api/orders';
import { FileText, Download, Search, Loader2 } from 'lucide-react';

interface Order {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentStatus: string;
}

export default function DealerInvoicesPage() {
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

  const completedOrders = orders.filter(o => o.paymentStatus === 'completed' || o.status === 'delivered');
  const filteredInvoices = completedOrders.filter(o => o._id.includes(searchQuery));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tax Invoices</h1>
        <p className="text-gray-500 mt-1">Download GST compliant invoices for your completed orders.</p>
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
        ) : filteredInvoices.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No invoices generated yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-sm text-gray-500 bg-white">
                  <th className="py-4 px-6 font-medium">Invoice Number</th>
                  <th className="py-4 px-6 font-medium">Order ID</th>
                  <th className="py-4 px-6 font-medium">Date Issued</th>
                  <th className="py-4 px-6 font-medium">Amount</th>
                  <th className="py-4 px-6 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredInvoices.map((order, idx) => (
                  <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900">
                      INV-{new Date(order.createdAt).getFullYear()}-{idx.toString().padStart(4, '0')}
                    </td>
                    <td className="py-4 px-6 font-mono text-gray-500">
                      {order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      ₹{order.totalAmount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="inline-flex items-center justify-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-700 px-4 py-2 rounded-lg font-medium transition-colors">
                        <Download className="h-4 w-4" /> Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}