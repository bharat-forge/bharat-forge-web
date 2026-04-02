"use client";

import { useState } from 'react';
import { Briefcase, FileText, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { submitDealerProfile } from '@/api/dealers';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

export default function ApplyDealerPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    businessName: '',
    gstNumber: '',
    contactPerson: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    interests: [] as string[]
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (value: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(value) 
        ? prev.interests.filter(i => i !== value)
        : [...prev.interests, value]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const payload = {
        businessName: formData.businessName,
        gstNumber: formData.gstNumber,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India'
        }
      };

      await submitDealerProfile(payload);
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
          <div className="h-20 w-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-8">Our team will review your details and contact you within 24-48 business hours to complete the verification process.</p>
          <button onClick={() => router.push('/')} className="bg-sky-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-sky-600 transition-colors">
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white border-b border-gray-200 pt-16 pb-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="text-sky-500 font-bold tracking-wider uppercase text-sm mb-4 block">
            B2B Partnership
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Become an Authorized <span className="text-sky-500">Dealer</span></h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join the Bharat Forge network and gain access to premium imported tyres and batteries at exclusive wholesale pricing.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Partner With Us?</h3>
            <ul className="space-y-6">
              <li className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-10 w-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Account Based Pricing</h4>
                  <p className="mt-1 text-sm text-gray-500">Access dynamic pricing tiers based on your volume and performance.</p>
                </div>
              </li>
              <li className="flex">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-10 w-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-bold text-gray-900">Certified Imports</h4>
                  <p className="mt-1 text-sm text-gray-500">100% genuine products with BIS, DOT, and ISO certifications.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Dealer Application Form</h2>
            
            {!isAuthenticated && (
              <div className="mb-8 p-4 bg-sky-50 border border-sky-100 rounded-xl text-sky-800 text-sm">
                You must be logged in to submit a dealer application. You will be redirected to login upon submission.
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Name <span className="text-red-500">*</span></label>
                  <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GSTIN Number <span className="text-red-500">*</span></label>
                  <input type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all uppercase" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person <span className="text-red-500">*</span></label>
                  <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" required />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address <span className="text-red-500">*</span></label>
                  <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City <span className="text-red-500">*</span></label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State <span className="text-red-500">*</span></label>
                  <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pincode <span className="text-red-500">*</span></label>
                  <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all" required />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button type="submit" disabled={loading} className="w-full bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin h-6 w-6" /> : <><span className="mr-2">Submit Application</span> <ArrowRight className="h-5 w-5" /></>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}