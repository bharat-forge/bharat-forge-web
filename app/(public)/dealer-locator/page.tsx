"use client";

import { useState, useEffect } from 'react';
import { fetchAllDealers } from '@/api/dealers';
import { Search, MapPin, Phone, Building2, Loader2, Star, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

interface Dealer {
  _id: string;
  businessName: string;
  contactPerson: string;
  phone: string;
  status: string;
  pricingTier: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function DealerLocatorPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  useEffect(() => {
    const loadDealers = async () => {
      try {
        const data = await fetchAllDealers();
        const approvedDealers = data.filter((d: Dealer) => d.status === 'approved');
        setDealers(approvedDealers);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadDealers();
  }, []);

  const cities = ['All', ...Array.from(new Set(dealers.map(d => d.address.city)))];

  const filteredDealers = dealers.filter(dealer => {
    const matchesSearch = dealer.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dealer.address.pincode.includes(searchQuery);
    const matchesCity = selectedCity === 'All' || dealer.address.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="bg-white border-b border-gray-200 pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Find an Authorized <span className="text-sky-500">Dealer</span></h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Locate a certified Bharat Forge partner near you for authentic products, expert installation, and reliable after-sales service.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Dealer Name or Pincode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-sm"
            />
          </div>
          
          <div className="w-full md:w-auto flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Filter by City:</span>
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full md:w-48 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-sky-500 focus:border-sky-500 p-3 outline-none cursor-pointer"
            >
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 text-sky-500 animate-spin" />
          </div>
        ) : filteredDealers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No dealers found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or selecting a different city.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDealers.map((dealer, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={dealer._id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-sky-100 transition-all group flex flex-col p-6 relative"
              >
                {dealer.pricingTier === 'gold' && (
                  <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-amber-700" /> Premium Partner
                  </div>
                )}
                
                <div className="h-12 w-12 bg-sky-50 rounded-xl flex items-center justify-center mb-6 text-sky-600">
                  <Building2 className="h-6 w-6" />
                </div>
                
                <h3 className="font-bold text-xl text-gray-900 mb-2">{dealer.businessName}</h3>
                
                <div className="space-y-3 mt-4 flex-1">
                  <div className="flex items-start text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span>{dealer.address.street}, {dealer.address.city}, {dealer.address.state} - {dealer.address.pincode}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                    <span>{dealer.phone}</span>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-gray-100">
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(`${dealer.businessName} ${dealer.address.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-sky-50 hover:bg-sky-500 text-sky-600 hover:text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center text-sm"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Get Directions
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}