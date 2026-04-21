"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import DealerSidebar from '@/components/layout/DealerSidebar';
import { getVerificationRequirements } from '@/api/dealer/verification';
import { Loader2 } from 'lucide-react';

export default function DealerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const pathname = usePathname();

  const [isReady, setIsReady] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'DEALER') {
      router.push('/login');
      return;
    }

    // If they are on the Hub page (/dealer), let page.tsx handle all logic and UI.
    if (pathname === '/dealer') {
      setShowSidebar(false);
      setIsReady(true);
      return;
    }

    const secureSubRoutes = async () => {
      try {
        const { data } = await getVerificationRequirements();
        const isFullyLocked = data.dealerStatus === 'REJECTED' || data.dealerStatus === 'SUSPENDED_FULL';
        const isReadyForProducts = (data.dealerStatus === 'APPROVED' || data.dealerStatus === 'SUSPENDED_PURCHASES') && data.overallDocsStatus === 'APPROVED';

        // 1. If locked, kick them back to the Hub to see the error message
        if (isFullyLocked) {
          router.replace('/dealer');
        }
        // 2. If trying to access products without being ready, kick to Verification
        else if (!isReadyForProducts && pathname !== '/dealer/verification') {
          router.replace('/dealer/verification');
        }
        // 3. THE FIX: If they are fully approved but lingering on the verification page, push them to products.
        else if (isReadyForProducts && pathname === '/dealer/verification') {
          router.replace('/dealer/products');
        }
        // 4. Otherwise, they are allowed here. Turn on the sidebar if they are approved.
        else {
          setShowSidebar(isReadyForProducts);
          setIsReady(true);
        }
      } catch (error) {
        router.replace('/dealer');
      }
    };
    secureSubRoutes();
  }, [isAuthenticated, user, router, pathname]);

  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {showSidebar && <DealerSidebar />}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}