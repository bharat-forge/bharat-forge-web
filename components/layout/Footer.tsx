import Link from 'next/link';
import { Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <Globe className="h-8 w-8 text-sky-500" />
            <span className="font-bold text-2xl tracking-tight text-white">
              Bharat<span className="text-sky-500">Forge</span>
            </span>
          </Link>
          <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
            India's premium B2B importer and distributor for high-performance automotive tyres and advanced battery systems.
          </p>
          <div className="text-sm font-medium">
            <p>support@bharatforge.com</p>
            <p className="mt-1">+91 1800-123-4567</p>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Platform</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/shop" className="hover:text-sky-400 transition-colors">Product Catalog</Link></li>
            <li><Link href="/dealer-locator" className="hover:text-sky-400 transition-colors">Find a Dealer</Link></li>
            <li><Link href="/apply-dealer" className="hover:text-sky-400 transition-colors">Become a Partner</Link></li>
            <li><Link href="/track-order" className="hover:text-sky-400 transition-colors">Track Shipment</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6 uppercase text-sm tracking-wider">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><Link href="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
            <li><Link href="/compliance" className="hover:text-sky-400 transition-colors">Certifications & GST</Link></li>
            <li><Link href="/terms" className="hover:text-sky-400 transition-colors">Terms of Trade</Link></li>
            <li><Link href="/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} Bharat Forge Importers. All rights reserved.
      </div>
    </footer>
  );
}