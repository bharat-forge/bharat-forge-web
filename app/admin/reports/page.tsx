"use client";

import { BarChart3, TrendingUp, Download, IndianRupee, PieChart } from 'lucide-react';

export default function AdminReportsPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Reports</h1>
          <p className="text-gray-500 mt-1">Analytics and insights across all dealer networks.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-colors flex items-center hover:bg-gray-50">
          <Download className="h-5 w-5 mr-2 text-sky-500" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-sky-500" /> Revenue Overview
            </h3>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-3 py-1.5 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-64 flex items-end justify-between gap-4">
            {[45, 60, 35, 80, 55, 95].map((height, i) => (
              <div key={i} className="w-full relative group">
                <div 
                  className="bg-sky-100 group-hover:bg-sky-500 w-full rounded-t-lg transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                ></div>
                <div className="text-center mt-3 text-xs text-gray-500 font-medium">
                  {['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-sky-500" /> Top Categories
            </h3>
          </div>
          <div className="space-y-6 mt-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-900">Commercial Tyres</span>
                <span className="text-gray-500">45%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-sky-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-900">Lead-Acid Batteries</span>
                <span className="text-gray-500">30%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-900">Passenger Tyres</span>
                <span className="text-gray-500">15%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-gray-900">EV Specific Units</span>
                <span className="text-gray-500">10%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-violet-400 h-2 rounded-full" style={{ width: '10%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-6">
          <TrendingUp className="h-5 w-5 text-sky-500" /> Top Performing Dealers
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm text-gray-500">
                <th className="pb-4 font-medium">Dealer Name</th>
                <th className="pb-4 font-medium">Location</th>
                <th className="pb-4 font-medium">Total Orders</th>
                <th className="pb-4 font-medium text-right">Revenue Generated</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-gray-50 last:border-0">
                <td className="py-5 font-bold text-gray-900">Apex Auto Parts</td>
                <td className="py-5 text-gray-600">Kolkata, WB</td>
                <td className="py-5 text-gray-900 font-medium">142</td>
                <td className="py-5 text-right font-bold text-green-600">₹85,40,000</td>
              </tr>
              <tr className="border-b border-gray-50 last:border-0">
                <td className="py-5 font-bold text-gray-900">Northern Tyres Ltd.</td>
                <td className="py-5 text-gray-600">Delhi, DL</td>
                <td className="py-5 text-gray-900 font-medium">98</td>
                <td className="py-5 text-right font-bold text-green-600">₹62,15,500</td>
              </tr>
              <tr className="border-b border-gray-50 last:border-0">
                <td className="py-5 font-bold text-gray-900">Western Auto Care</td>
                <td className="py-5 text-gray-600">Mumbai, MH</td>
                <td className="py-5 text-gray-900 font-medium">76</td>
                <td className="py-5 text-right font-bold text-green-600">₹45,90,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}