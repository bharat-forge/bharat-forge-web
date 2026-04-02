"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, verifyOTP, resendOTP } from '@/api/auth';
import { fetchDealerProfile } from '@/api/dealers';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { RootState } from '@/store/store';
import { Globe, Loader2, Mail, Lock, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'credentials' | 'otp'>('credentials');
  
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [pendingMessage, setPendingMessage] = useState('');
  const [countdown, setCountdown] = useState(60);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') router.replace('/admin/dashboard');
      else if (user.role === 'dealer') router.replace('/dealer/dashboard');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  const handleRouting = async (userData: any) => {
    if (userData.role === 'dealer') {
      try {
        const profile = await fetchDealerProfile();
        if (profile.status === 'pending') {
          setPendingMessage('Your dealer application is currently under review. Please wait for a confirmation email.');
          dispatch(logout());
          setLoading(false);
          return;
        }
      } catch (profileErr) {
        setError('Failed to verify dealer status');
        dispatch(logout());
        setLoading(false);
        return;
      }
      router.push('/dealer/dashboard');
    } else if (userData.role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPendingMessage('');

    try {
      await loginUser({ email, password });
      setStep('otp');
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await verifyOTP({ email, otp });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      await handleRouting(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      await resendOTP({ email, type: 'login' });
      setMessage('A new OTP has been sent to your email.');
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Globe className="h-12 w-12 text-sky-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your portal</h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-sky-100/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {error && <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">{error}</div>}
          {message && <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-xl text-sm border border-green-100">{message}</div>}
          {pendingMessage && <div className="mb-4 bg-orange-50 text-orange-700 p-4 rounded-xl text-sm border border-orange-100 font-medium leading-relaxed">{pendingMessage}</div>}

          {step === 'credentials' ? (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign In'}
              </button>
            </motion.form>
          ) : (
            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6" onSubmit={handleVerifyOTP}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Two-Factor Authentication</label>
                <p className="text-xs text-gray-500 mt-1 mb-3">Enter the OTP sent to {email}</p>
                <div className="mt-1">
                  <input
                    type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 text-center tracking-[0.5em] font-bold text-lg"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 focus:outline-none disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify & Login'}
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
                
                <button type="button" onClick={() => { setStep('credentials'); setPassword(''); }} className="text-sm text-gray-500 hover:text-gray-700 mt-2">
                  Back to login
                </button>
              </div>
            </motion.form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Want to partner with us?{' '}
              <Link href="/register" className="font-medium text-sky-600 hover:text-sky-500">
                Apply to become a dealer
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}