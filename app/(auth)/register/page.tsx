"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { registerUser, verifyOTP, resendOTP } from '@/api/auth';
import { submitDealerProfile } from '@/api/dealers';
import { setCredentials, logout } from '@/store/slices/authSlice';
import axiosInstance from '@/api/axiosInstance';
import { Building2, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [countdown, setCountdown] = useState(60);

  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '', 
    businessName: '', gstNumber: '',
    contactPerson: '', phone: '', street: '', city: '', state: '', pincode: '',
    requestedCategories: [] as string[]
  });

  const [otp, setOtp] = useState('');

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axiosInstance.get('/api/categories');
        setCategories(res.data);
      } catch (err) {}
    };
    fetchCats();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      requestedCategories: prev.requestedCategories.includes(categoryId)
        ? prev.requestedCategories.filter(id => id !== categoryId)
        : [...prev.requestedCategories, categoryId]
    }));
  };

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      await registerUser({ 
        email: formData.email, 
        role: 'dealer', 
        password: formData.password 
      });
      setStep('otp');
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      await resendOTP({ email: formData.email, type: 'register' });
      setMessage('A new OTP has been sent to your email.');
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const data = await verifyOTP({ email: formData.email, otp });
      
      dispatch(setCredentials({ user: data.user, token: data.token }));

      const profilePayload = {
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
        },
        productCategories: formData.requestedCategories
      };

      await submitDealerProfile(profilePayload);
      
      dispatch(logout());
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-10 rounded-3xl shadow-xl max-w-lg w-full text-center border border-gray-100">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Received</h2>
          <p className="text-gray-600 mb-8">Thank you for registering. Your application is currently under review by our team. We will send an approval email to <strong>{formData.email}</strong> once your account is activated.</p>
          <Link href="/login" className="bg-sky-500 text-white px-8 py-3 rounded-xl font-medium hover:bg-sky-600 transition-colors">
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <Building2 className="h-12 w-12 text-sky-500 mx-auto" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Dealer Registration</h2>
          <p className="mt-2 text-gray-600">Apply for a B2B account to access wholesale pricing</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          {error && <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>}
          {message && <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-100">{message}</div>}

          {step === 'form' ? (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleRequestOTP} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Email (Login ID) *</label><input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label><input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Password *</label><input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label><input required type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
                <div className="md:col-span-2 border-t pt-4 mt-2"></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label><input required type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">GSTIN Number *</label><input required type="text" name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50 uppercase" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Contact Person *</label><input required type="text" name="contactPerson" value={formData.contactPerson} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Street Address *</label><input required type="text" name="street" value={formData.street} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">City *</label><input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">State *</label><input required type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
                <div className="md:col-span-2"><label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label><input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50" /></div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Which product categories do you wish to sell?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(cat => (
                    <label key={cat._id} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${formData.requestedCategories.includes(cat._id) ? 'border-sky-500 bg-sky-50' : 'bg-white hover:bg-gray-50'}`}>
                      <input type="checkbox" className="h-5 w-5 text-sky-600 rounded" checked={formData.requestedCategories.includes(cat._id)} onChange={() => handleCategoryToggle(cat._id)} />
                      <span className="ml-3 font-medium text-gray-900">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading || formData.requestedCategories.length === 0} className="w-full bg-sky-500 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-sky-600 disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Request OTP'}
              </button>
            </motion.form>
          ) : (
             <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6" onSubmit={handleVerifyAndSubmit}>
               <div>
                 <label className="block text-sm font-medium text-gray-700">Enter OTP sent to {formData.email}</label>
                 <div className="mt-1">
                   <input
                     type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                     className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-center tracking-[0.5em] font-bold text-lg"
                   />
                 </div>
               </div>
 
               <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none disabled:opacity-50">
                 {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Verify & Submit Application'}
               </button>

               <div className="flex flex-col items-center justify-center mt-4 space-y-2">
                  {countdown > 0 ? (
                    <p className="text-sm text-gray-500">
                      Resend OTP in <span className="font-bold text-gray-700">{countdown}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendLoading}
                      className="text-sm font-medium text-sky-600 hover:text-sky-500 flex items-center gap-2"
                    >
                      {resendLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <RefreshCw className="h-4 w-4" />}
                      Resend OTP
                    </button>
                  )}
                  
                  <button type="button" onClick={() => setStep('form')} className="text-sm text-gray-500 hover:text-gray-700 mt-2">
                    Go back and edit details
                  </button>
               </div>
             </motion.form>
           )}
          
          <p className="text-center text-sm text-gray-500 mt-6">Already applied? <Link href="/login" className="text-sky-600 font-medium">Log in to check status</Link></p>
        </div>
      </div>
    </div>
  );
}