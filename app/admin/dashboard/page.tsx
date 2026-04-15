"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  IndianRupee, ShoppingCart, Users, Package, 
  LifeBuoy, Activity, PieChart as PieChartIcon, TrendingUp, BarChart3, Calculator
} from 'lucide-react';
import { getAdminDashboardStats } from '@/api/admin/dashboard';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, BarChart, Bar, LineChart, Line
} from 'recharts';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await getAdminDashboardStats();
      setStats(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!stats) return null;

  const COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#ec4899'];

  const parsedPieData = stats.charts.orderStatusDistribution.map((item: any) => ({
    ...item,
    count: Number(item.count)
  }));

  const CustomTooltip = ({ active, payload, label, prefix = '' }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800">
          <p className="text-slate-400 text-xs font-bold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-black" style={{ color: entry.color }}>
              {entry.name}: {prefix}{entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 lg:p-10 w-full space-y-6">
      
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm w-full">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Platform Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time business metrics and graphical insights</p>
        </div>
        <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl hidden sm:block border border-sky-100">
          <Activity className="w-8 h-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-6 w-full">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">
              <IndianRupee className="w-6 h-6" />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Total Revenue</p>
            <h3 className="text-2xl font-black text-slate-900">₹{(stats.metrics.totalRevenue / 1000000).toFixed(2)}M</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-sky-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Total Orders</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.metrics.totalOrders.toLocaleString()}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
              <Calculator className="w-6 h-6" />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Avg Order Value</p>
            <h3 className="text-2xl font-black text-slate-900">₹{Math.round(stats.metrics.avgOrderValue).toLocaleString()}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Active Dealers</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.metrics.activeDealers}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-purple-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6" />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Catalog Items</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.metrics.totalProducts}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-150 transition-transform duration-500 z-0"></div>
          <div className="relative z-10">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
              <LifeBuoy className="w-6 h-6" />
            </div>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-1">Open Tickets</p>
            <h3 className="text-2xl font-black text-slate-900">{stats.metrics.openTickets}</h3>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-sky-500" /> Revenue Trend (6 Months)
            </h2>
          </div>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.charts.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Area type="monotone" dataKey="total" name="Revenue" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieChartIcon className="w-5 h-5 text-sky-500" /> Orders by Status
          </h2>
          <div className="w-full h-[350px] flex items-center justify-center relative">
            {parsedPieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={parsedPieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="status"
                    stroke="none"
                  >
                    {parsedPieData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#475569' }}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 font-bold">No order data available</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> Revenue by Category
            </h2>
          </div>
          <div className="w-full h-[350px]">
            {stats.charts.revenueByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.charts.revenueByCategory} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} tickFormatter={(value) => `₹${value >= 1000 ? (value/1000).toFixed(0) + 'k' : value}`} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 12, fontWeight: 700}} width={120} />
                  <Tooltip content={<CustomTooltip prefix="₹" />} />
                  <Bar dataKey="total" name="Revenue" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">No Category Data</div>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm w-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" /> New Dealer Onboarding
            </h2>
          </div>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.charts.dealerGrowthTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 600}} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="newDealers" name="New Dealers" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
}