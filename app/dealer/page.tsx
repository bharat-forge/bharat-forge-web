"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { getVerificationRequirements } from '@/api/dealer/verification';
import { logout } from '@/store/slices/authSlice';
import { Loader2, ShieldAlert, Ban, LogOut, FileCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DealerHubPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [statusData, setStatusData] = useState<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const { data } = await getVerificationRequirements();
        setStatusData(data);
        
        const dealerStatus = data.dealerStatus;
        const docsStatus = data.overallDocsStatus;

        // SCENARIO 1: Action Required (Missing or Rejected Docs) -> Send to Verification
        if ((dealerStatus === 'PENDING' || dealerStatus === 'APPROVED' || dealerStatus === 'SUSPENDED_PURCHASES') && 
            (docsStatus === 'PENDING' || docsStatus === 'REJECTED')) {
          router.replace('/dealer/verification');
          return;
        }

        // SCENARIO 2: Fully Approved & Compliant -> Send to Products
        if ((dealerStatus === 'APPROVED' || dealerStatus === 'SUSPENDED_PURCHASES') && docsStatus === 'APPROVED') {
          router.replace('/dealer/products');
          return;
        }

        // SCENARIO 3: If neither, stay on this page to show the specific lock/waiting screen.
        setLoading(false);

      } catch (error) {
        console.error('Failed to route dealer', error);
        setLoading(false);
      }
    };

    fetchStatus();
  }, [router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-sky-500 mb-4" />
        <p className="text-slate-500 font-medium animate-pulse">Checking account status...</p>
      </div>
    );
  }

  const { dealerStatus, overallDocsStatus } = statusData || {};

  // SCREEN A: Fully Suspended
  if (dealerStatus === 'SUSPENDED_FULL') {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 max-w-lg w-full">
          <ShieldAlert className="w-16 h-16 text-rose-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">Account Suspended</h1>
          <p className="text-slate-600 mb-8">
            Your dealer account has been fully suspended by administration. You currently do not have access to the platform.
          </p>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>
    );
  }

  // SCREEN B: Rejected
  if (dealerStatus === 'REJECTED') {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 max-w-lg w-full">
          <Ban className="w-16 h-16 text-rose-500 mx-auto mb-6" />
          <h1 className="text-2xl font-black text-slate-900 mb-2">Account Rejected</h1>
          <p className="text-slate-600 mb-8">
            Unfortunately, your dealership application has been rejected. Please contact support if you believe this was a mistake.
          </p>
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors">
            <LogOut className="w-4 h-4" /> Return to Login
          </button>
        </div>
      </div>
    );
  }

  // SCREEN C: Under Review (Docs submitted, waiting on Admin)
  if (dealerStatus === 'PENDING' && (overallDocsStatus === 'PENDING_REVIEW' || overallDocsStatus === 'APPROVED')) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 max-w-lg w-full">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex justify-center mb-6">
            <div className="p-4 bg-sky-50 rounded-full">
              <FileCheck className="w-12 h-12 text-sky-500" />
            </div>
          </motion.div>
          <h1 className="text-2xl font-black text-slate-900 mb-3">Documents Under Review</h1>
          <p className="text-slate-600 mb-6">
            Your verification documents have been successfully submitted. Please wait while our administration team verifies your information to activate your account.
          </p>
          <div className="inline-flex items-center gap-2 text-sm font-bold text-sky-600 bg-sky-50 px-4 py-2 rounded-full">
            <Clock className="w-4 h-4" /> Verification Pending
          </div>
        </div>
      </div>
    );
  }

  return null;
}