import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ReduxProvider from '@/store/ReduxProvider';
import SplashScreen from '@/components/layout/SplashScreen'; // Import the loader

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bharat Forge | B2B Portal',
  description: 'Premium Importers & Distributors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SplashScreen /> {/* High z-index loader overlay */}
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}