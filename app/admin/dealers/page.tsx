"use client";

import { useState, useEffect } from 'react';
import { fetchAllDealers, updateDealerStatus } from '@/api/dealers';
import { Search, Loader2, UserCheck, UserX, Building2, Phone, Mail } from 'lucide-react';

interface Dealer {
  _id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  user: { email: string };
  status: 'pending' | 'approved' | 'rejected';
  pricingTier: string;
  gstNumber: string;
  address: { city: string; state: string };
}

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadDealers();
  }, []);

  const loadDealers = async () => {
    try {
      const data = await fetchAllDealers();
      setDealers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string, currentTier: string) => {
    setActionLoading(id);
    try {
      await updateDealerStatus(id, { status: newStatus, pricingTier: currentTier });
      await loadDealers();
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDealers = dealers.filter(d => 
    d.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    d.gstNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dealer Network</h1>
        <p className="text-gray-500 mt-1">Review applications and manage active B2B partners.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Business Name or GSTIN..."
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
        ) : (
          <div className="grid grid-cols-1 gap-0 divide-y divide-gray-100">
            {filteredDealers.map((dealer) => (
              <div key={dealer._id} className="p-6 hover:bg-gray-50/50 transition-colors flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-gray-400" />
                      {dealer.businessName}
                    </h3>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${
                      dealer.status === 'approved' ? 'bg-green-100 text-green-700' :
                      dealer.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {dealer.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Contact:</span> {dealer.contactPerson}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" /> {dealer.phone}
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" /> {dealer.user?.email}
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-medium text-gray-900 font-sans">GSTIN:</span> {dealer.gstNumber}
                    </div>
                    <div className="flex items-center gap-2 md:col-span-2">
                      <span className="font-medium text-gray-900">Location:</span> {dealer.address?.city}, {dealer.address?.state}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 min-w-[200px]">
                  {dealer.status === 'pending' ? (
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => handleStatusChange(dealer._id, 'approved', dealer.pricingTier)}
                        disabled={actionLoading === dealer._id}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        {actionLoading === dealer._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <><UserCheck className="h-4 w-4 mr-2" /> Approve</>}
                      </button>
                      <button 
                        onClick={() => handleStatusChange(dealer._id, 'rejected', dealer.pricingTier)}
                        disabled={actionLoading === dealer._id}
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center disabled:opacity-50"
                      >
                        <UserX className="h-4 w-4 mr-2" /> Reject
                      </button>
                    </div>
                  ) : (
                    <div className="w-full">
                      <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Pricing Tier</label>
                      <select 
                        value={dealer.pricingTier}
                        onChange={(e) => handleStatusChange(dealer._id, dealer.status, e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-sky-500 focus:border-sky-500 block p-2.5 outline-none cursor-pointer"
                      >
                        <option value="standard">Standard</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                        <option value="platinum">Platinum</option>
                      </select>
                    </div>
                  )}
                  <button className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium transition-colors">
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}