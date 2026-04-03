"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail } from "lucide-react"

const Facebook = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
)

const Twitter = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
)

const Instagram = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
)

const Linkedin = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
)

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-gray-900 border-t border-gray-800">
      <style dangerouslySetInnerHTML={{__html: `
        .dot-mask {
          -webkit-mask-image: radial-gradient(circle, white 2px, transparent 2px);
          mask-image: radial-gradient(circle, white 2px, transparent 2px);
          -webkit-mask-size: 4px 4px;
          mask-size: 4px 4px;
        }
        @media (min-width: 768px) {
          .dot-mask {
            -webkit-mask-size: 6px 6px;
            mask-size: 6px 6px;
          }
        }
        @media (min-width: 1024px) {
          .dot-mask {
            -webkit-mask-size: 8px 8px;
            mask-size: 8px 8px;
          }
        }
      `}} />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col items-center justify-center pointer-events-none z-0 select-none overflow-hidden opacity-20">
        <motion.span 
          animate={{ backgroundPosition: ["200% center", "-200% center"] }}
          transition={{ repeat: Infinity, repeatType: "reverse", ease: "easeInOut", duration: 12 }}
          className="text-[18vw] font-black leading-[0.8] tracking-tighter whitespace-nowrap bg-clip-text text-transparent bg-[length:200%_auto] dot-mask bg-gradient-to-r from-gray-800 via-sky-500/50 to-gray-800"
        >
          BHARAT
        </motion.span>
        <motion.span 
          animate={{ backgroundPosition: ["-200% center", "200% center"] }}
          transition={{ repeat: Infinity, repeatType: "reverse", ease: "easeInOut", duration: 12 }}
          className="text-[18vw] font-black leading-[0.8] tracking-tighter whitespace-nowrap ml-[20vw] bg-clip-text text-transparent bg-[length:200%_auto] dot-mask bg-gradient-to-r from-gray-800 via-sky-500/50 to-gray-800"
        >
          FORGE
        </motion.span>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center mb-6">
              <span className="text-3xl font-black whitespace-nowrap text-white tracking-tighter">
                Bharat<span className="text-sky-500">Forge</span>
              </span>
            </Link>
            <p className="text-base text-gray-400 leading-relaxed max-w-sm mb-8 font-medium">
              India's premium B2B importer and distributor for high-performance automotive tyres and advanced battery systems.
            </p>
            
            <div className="flex gap-4">
              <Link href="#" className="p-2.5 rounded-full bg-gray-800 text-gray-400 hover:bg-sky-900/50 hover:text-sky-400 transition-all border border-gray-700 hover:scale-110">
                <Linkedin size={20} />
              </Link>
              <Link href="#" className="p-2.5 rounded-full bg-gray-800 text-gray-400 hover:bg-sky-900/50 hover:text-sky-400 transition-all border border-gray-700 hover:scale-110">
                <Twitter size={20} />
              </Link>
              <Link href="#" className="p-2.5 rounded-full bg-gray-800 text-gray-400 hover:bg-sky-900/50 hover:text-sky-400 transition-all border border-gray-700 hover:scale-110">
                <Facebook size={20} />
              </Link>
              <Link href="#" className="p-2.5 rounded-full bg-gray-800 text-gray-400 hover:bg-sky-900/50 hover:text-sky-400 transition-all border border-gray-700 hover:scale-110">
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-6 text-sm font-black text-white uppercase tracking-widest">Platform</h2>
            <ul className="text-gray-400 font-medium space-y-4">
              <li><Link href="/shop" className="hover:text-sky-400 transition-colors">Product Catalog</Link></li>
              <li><Link href="/dealer-locator" className="hover:text-sky-400 transition-colors">Find a Dealer</Link></li>
              <li><Link href="/apply-dealer" className="hover:text-sky-400 transition-colors">Become a Partner</Link></li>
              <li><Link href="/track-order" className="hover:text-sky-400 transition-colors">Track Shipment</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-6 text-sm font-black text-white uppercase tracking-widest">Company</h2>
            <ul className="text-gray-400 font-medium space-y-4">
              <li><Link href="/about" className="hover:text-sky-400 transition-colors">About Us</Link></li>
              <li><Link href="/compliance" className="hover:text-sky-400 transition-colors">Certifications & GST</Link></li>
              <li><Link href="/terms" className="hover:text-sky-400 transition-colors">Terms of Trade</Link></li>
              <li><Link href="/privacy" className="hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h2 className="mb-6 text-sm font-black text-white uppercase tracking-widest">Reach Out</h2>
            <ul className="text-gray-400 font-medium space-y-5">
              <li className="flex items-start gap-3 text-sm group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-sky-900/50 transition-colors">
                  <MapPin size={16} className="text-sky-400" />
                </div>
                <span className="mt-1 leading-relaxed">Bharat Forge Distribution Center, New Delhi, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-sky-900/50 transition-colors">
                  <Phone size={16} className="text-sky-400" />
                </div>
                <span className="leading-relaxed">+91 1800-123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm group">
                <div className="p-2 bg-gray-800 rounded-lg group-hover:bg-sky-900/50 transition-colors">
                  <Mail size={16} className="text-sky-400" />
                </div>
                <span>support@bharatforge.com</span>
              </li>
            </ul>
          </div>
          
        </div>

        <hr className="my-8 border-gray-800" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-sm font-medium text-gray-500">
            © {new Date().getFullYear()} Bharat Forge Importers. All rights reserved.
          </span>
          
          <div className="flex gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest">
             <span className="px-3 py-1.5 bg-gray-800 rounded-md">GST Compliant</span>
             <span className="px-3 py-1.5 bg-gray-800 rounded-md">B2B Verified</span>
          </div>
        </div>
      </div>
    </footer>
  )
}