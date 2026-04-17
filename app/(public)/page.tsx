"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Plus, Minus, Send, BarChart3, Globe2, Truck, ShieldCheck,
  Star, ChevronRight, Package, Loader2, Phone, MessageCircle, HelpCircle, 
  X, CheckCircle2, Zap, TrendingUp, Users, Clock, Building, ArrowUpRight, 
  MapPin, Mail, ShoppingCart, Cpu, Network, Lock, Activity, Layers, Repeat,
  Calendar, Eye, BookOpen, Target, Award, Gem, FileText, Anchor, Settings,
  BarChart, Briefcase, ZapIcon
} from 'lucide-react';
import { getCategories, browseProducts } from '@/api/public/catalog';
import { getTrendingArticles, getPaginatedArticles } from '@/api/public/articles';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes seamlessMarquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-seamless-marquee {
      animation: seamlessMarquee 40s linear infinite;
    }
    .animate-seamless-marquee-slow {
      animation: seamlessMarquee 60s linear infinite;
    }
    .animate-seamless-marquee-fast {
      animation: seamlessMarquee 25s linear infinite;
    }
    .pause-on-hover:hover {
      animation-play-state: paused;
    }
    .bg-circuit {
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10h10v10H10V10zm20 0h10v10H30V10zm20 0h10v10H50V10zm20 0h10v10H70V10zm20 0h10v10H90V10zM10 30h10v10H10V30zm20 0h10v10H30V30zm20 0h10v10H50V30zm20 0h10v10H70V30zm20 0h10v10H90V30z' fill='%230ea5e9' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
    }
    .bg-grid-slate-100 {
      background-size: 40px 40px;
      background-image: linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px);
    }
    .text-glow {
      text-shadow: 0 0 20px rgba(14, 165, 233, 0.5);
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `}} />
);

const marqueeLogos = [
  "https://upload.wikimedia.org/wikipedia/commons/6/6e/Michelin-logo-blue%402x.webp",
  "https://bpando.org/wp-content/uploads/New-Bridgestone-Logo-Design-2011-BPO.jpg",
  "https://1000logos.net/wp-content/uploads/2022/11/Continental-Logo.png",
  "https://news.goodyear.com/image/GY_Wordmark_Logo_With_Wingfoot_Black_RGB_tile-crop.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Pirelli_-_logo_full_%28Italy%2C_1997%29.svg/960px-Pirelli_-_logo_full_%28Italy%2C_1997%29.svg.png?_=20251005130243",
  "https://upload.wikimedia.org/wikipedia/commons/c/c3/Bosch_logo.png",
  "https://upload.wikimedia.org/wikipedia/commons/b/b8/Hankook_logo.png",
  "https://docs.exideindustries.com/pdf/logo-jpg-hi-resolution.jpg"
];

const stats = [
  { value: 12400, suffix: '+', label: 'Active Dealers Globally', icon: Users },
  { value: 1500, suffix: '+', label: 'Premium SKUs Available', icon: Package },
  { value: 99.8, suffix: '%', label: 'Fulfillment Success Rate', icon: TrendingUp },
  { value: 24, suffix: '/7', label: 'Dedicated B2B Support', icon: Clock },
];

const ecosystemCards = [
  { icon: Cpu, title: "Predictive Analytics", desc: "AI-driven inventory forecasting ensures you stock what sells before demand spikes." },
  { icon: Network, title: "API Integration", desc: "Seamlessly connect our product catalog directly into your native ERP or SAP systems." },
  { icon: ShieldCheck, title: "OEM Compliance", desc: "Every component is heavily audited to meet or exceed original equipment manufacturer standards." },
  { icon: Truck, title: "Smart Routing", desc: "Automated logistics algorithms calculate the fastest shipping lanes for bulk container orders." },
  { icon: Lock, title: "Price Protection", desc: "Lock in commodity pricing for up to 6 months to protect your margins from market volatility." },
  { icon: Activity, title: "Real-time Telemetry", desc: "Track high-value shipments via GPS and IoT sensors right from your dealer dashboard." },
  { icon: Layers, title: "Multi-tier Warehousing", desc: "Access inventory from 5 global hubs, drastically reducing localized stockout risks." },
  { icon: Repeat, title: "Automated RMAs", desc: "A frictionless, digitized returns process that issues credit notes within 24 hours." },
  { icon: Globe2, title: "Global Sourcing", desc: "Direct manufacturing relationships bypass middlemen, passing pure wholesale margin to you." }
];

const timelineSteps = [
  { icon: FileText, title: "1. Dealer Application", desc: "Submit your KYC, GSTIN, and business details via our digital onboarding portal. Verification typically concludes within 48 hours." },
  { icon: ShieldCheck, title: "2. Tier Assessment", desc: "Our commercial team evaluates your monthly volume capacity to assign your initial purchasing tier and unlock wholesale pricing." },
  { icon: BarChart, title: "3. Portal Activation", desc: "Gain immediate access to live inventory, predictive demand forecasting tools, and your dedicated account manager." },
  { icon: Truck, title: "4. Initial Dispatch", desc: "Place your first bulk order with prioritized shipping routes. Real-time GPS tracking is enabled instantly." },
  { icon: Award, title: "5. Credit Facility", desc: "Following a 90-day successful probationary period, apply for 30 to 45-day rolling credit to scale operations rapidly." }
];

const tierBenefits = [
  { name: "Silver Partner", volume: "₹5L - ₹15L / month", perks: ["Standard Wholesale Pricing", "Access to Basic Portal", "Standard SLA Support", "Net 7 Payment Terms"], color: "bg-slate-300 text-slate-700 border-slate-400" },
  { name: "Gold Partner", volume: "₹15L - ₹50L / month", perks: ["Tier-2 Discount Brackets", "Priority Dispatch Queue", "Dedicated Account Manager", "Net 30 Payment Terms"], color: "bg-amber-300 text-amber-800 border-amber-400", popular: true },
  { name: "Platinum Enterprise", volume: "₹50L+ / month", perks: ["Maximum Margin Discounts", "Full API / ERP Integration", "Predictive Restocking Alerts", "Net 45-60 Payment Terms"], color: "bg-sky-200 text-sky-800 border-sky-300" }
];

const faqs = [
  { q: "What is the minimum order quantity (MOQ)?", a: "MOQs vary strictly by product category to optimize shipping economics. Passenger tyres generally require 50 units, while commercial batteries require 20 units." },
  { q: "How do I become an authorized dealer?", a: "Submit an application via our 'Partner With Us' portal with your GSTIN and business registration. Digital approval usually occurs within 48 hours." },
  { q: "Do you offer API access for inventory syncing?", a: "Yes. Enterprise-tier dealers receive full REST API access to synchronize live inventory and dynamic pricing directly into their existing ERPs." },
  { q: "What are your payment and credit terms?", a: "Following a 3-month probationary period, high-volume dealers can unlock 30 to 45-day rolling credit facilities, subject to financial review." },
  { q: "How are warranty claims processed?", a: "All RMAs are handled digitally through the dealer portal. Once a defect is verified via our diagnostic criteria, a credit note is issued within 24 hours." }
];

function useCounter(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  useEffect(() => {
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      countRef.current = Number((easeProgress * end).toFixed(end % 1 === 0 ? 0 : 1));
      setCount(countRef.current);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return count;
}

const BackgroundHalations = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen z-0">
    <motion.div 
      animate={{ x: [0, 100, -100, 0], y: [0, -100, 100, 0] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-sky-500/20 rounded-full blur-[120px]"
    />
    <motion.div 
      animate={{ x: [0, -150, 150, 0], y: [0, 150, -150, 0] }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]"
    />
  </div>
);

const HeroParticles = () => {
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    setParticles(Array.from({ length: 50 }).map((_, i) => ({
      id: i, x: Math.random() * 100, y: Math.random() * 100, 
      size: Math.random() * 3 + 1, duration: Math.random() * 15 + 10, delay: Math.random() * 5
    })));
  }, []);
  return (
    <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: `${p.y}vh`, x: `${p.x}vw` }}
          animate={{ opacity: [0, 0.8, 0], y: [`${p.y}vh`, `${p.y - 30}vh`] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          className="absolute rounded-full bg-sky-400 blur-[1px]"
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
};

const BloomingButton = ({ href, children }: { href: string, children: React.ReactNode }) => {
  return (
    <Link href={href} className="relative group inline-flex items-center justify-center w-full sm:w-auto z-20">
      <div className="absolute inset-0 bg-sky-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500"></div>
      <div className="absolute inset-[-2px] rounded-2xl bg-gradient-to-r from-sky-300 via-blue-500 to-sky-300 background-animate opacity-80 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto] animate-[gradient_2s_linear_infinite]"></div>
      <div className="relative flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-[14px] font-bold transition-all group-hover:bg-slate-900 w-full justify-center border border-sky-500/30">
        {children}
      </div>
    </Link>
  );
};

const AnimatedStat = ({ value, suffix, label, icon: Icon }: any) => {
  const count = useCounter(value, 2.5);
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-2xl border border-slate-100/50 rounded-[2rem] shadow-2xl shadow-sky-900/5 hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="h-16 w-16 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
        <Icon className="h-8 w-8" />
      </div>
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{count.toLocaleString()}</span>
        <span className="text-2xl font-bold text-sky-500">{suffix}</span>
      </div>
      <p className="mt-3 text-xs font-black text-slate-500 uppercase tracking-widest text-center relative z-10">{label}</p>
    </div>
  );
};

const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => setIsVisible(latest > 500));
  }, [scrollY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 50 }}
          className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4"
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: { transition: { staggerChildren: 0.1 } },
                  closed: { transition: { staggerChildren: 0.1, staggerDirection: -1 } }
                }}
                className="flex flex-col gap-3"
              >
                <motion.div variants={{ closed: { scale: 0, y: 20 }, open: { scale: 1, y: 0 } }} className="flex items-center gap-3">
                  <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-bold text-slate-700">Knowledge Base</span>
                  <Link href="/faq" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-sky-50 text-sky-600 border border-slate-100">
                    <HelpCircle className="w-5 h-5" />
                  </Link>
                </motion.div>
                <motion.div variants={{ closed: { scale: 0, y: 20 }, open: { scale: 1, y: 0 } }} className="flex items-center gap-3">
                  <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-bold text-slate-700">Corporate Sales</span>
                  <a href="tel:+1234567890" className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-xl hover:bg-emerald-50 text-emerald-600 border border-slate-100">
                    <Phone className="w-5 h-5" />
                  </a>
                </motion.div>
                <motion.div variants={{ closed: { scale: 0, y: 20 }, open: { scale: 1, y: 0 } }} className="flex items-center gap-3">
                  <span className="bg-white px-3 py-1.5 rounded-lg shadow-md text-sm font-bold text-slate-700">WhatsApp Support</span>
                  <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-xl hover:bg-[#1ebd5a] text-white">
                    <MessageCircle className="w-6 h-6" />
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform border border-sky-500 relative overflow-hidden"
          >
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
              {isOpen ? <X className="w-7 h-7 text-white" /> : <MessageCircle className="w-7 h-7 text-white" />}
            </motion.div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [realProducts, setRealProducts] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 300]);

  // Map configuration for Bharat Forge HQ
const mapContainerStyle = { width: '100%', height: '100%' };
const hqLocation = { lat: 18.5293, lng: 73.9042 }; // Mundhwa, Pune coordinates

const [isMarkerOpen, setIsMarkerOpen] = useState(false);

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, prodRes, artRes] = await Promise.all([
          getCategories(),
          browseProducts({ page: 1, limit: 12 }),
          getPaginatedArticles({ page: 1, limit: 3 })
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setRealProducts(prodRes.data?.data || []);
        setArticles(artRes.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch initial data");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen w-full font-sans selection:bg-sky-500 selection:text-white">
      <CustomStyles />

      <section className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-slate-950">
        <BackgroundHalations />
        <div className="absolute inset-0 z-0 w-full h-full">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-luminosity">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/70 to-slate-950 z-10" />
          <div className="absolute inset-0 bg-circuit z-10 opacity-20 pointer-events-none"></div>
        </div>
        
        <HeroParticles />

        <motion.div style={{ opacity: opacityHero, y: yHeroText }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8 shadow-[0_0_30px_rgba(14,165,233,0.15)]"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
            </span>
            <span className="text-white font-bold text-xs tracking-widest uppercase">B2B & B2C Export & Dealership Network</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[1.05]"
          >
            Engineered for <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 drop-shadow-[0_0_40px_rgba(14,165,233,0.4)]">
              Performance.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-medium"
          >
            The ultimate supply chain backbone for premium automotive parts, batteries, and accessories. Empower your business with global sourcing and predictive inventory.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-6"
          >
            <BloomingButton href="/shop">
              Explore Products <ArrowRight className="h-5 w-5 ml-1" />
            </BloomingButton>
            <Link href="/apply-dealer" className="relative group overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 font-bold transition-all hover:bg-white/10 flex items-center justify-center gap-2 w-full sm:w-auto">
              <Building className="h-5 w-5" /> Partner Network
            </Link>
          </motion.div>
        </motion.div>
      </section>

      <section className="relative z-30 -mt-24 mx-4 md:mx-auto max-w-7xl pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => <AnimatedStat key={idx} {...stat} />)}
        </div>
      </section>

      <section className="bg-white py-12 border-b border-slate-100 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sourcing exclusively from global Tier-1 manufacturers</p>
        </div>
        <div className="relative flex overflow-hidden w-full bg-white [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-[200%] animate-seamless-marquee items-center justify-around">
            {[...marqueeLogos, ...marqueeLogos, ...marqueeLogos].map((logo, idx) => (
              <img key={idx} src={logo} alt="Partner Logo" className="h-10 md:h-16 w-auto object-contain mx-12 filter grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 text-sky-600 font-black tracking-widest uppercase text-[10px] mb-4 border border-slate-200">Catalog Hierarchy</span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Explore Segments
              </h2>
            </div>
            <Link href="/shop" className="group flex items-center gap-2 text-slate-900 font-bold hover:text-sky-600 transition-colors pb-1 border-b-2 border-slate-900 hover:border-sky-600">
              Browse All Categories <ArrowUpRight className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-80 bg-slate-50 rounded-[2.5rem] border border-slate-100 animate-pulse"></div>)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.slice(0, 6).map((cat, idx) => (
                <Link
                  href={`/shop?categoryId=${cat.id}`}
                  key={cat.id} 
                  className="group relative h-80 rounded-[2.5rem] overflow-hidden bg-slate-50 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-sky-900/10 hover:border-sky-300 transition-all duration-500 flex flex-col p-10"
                >
                  <div className="h-16 w-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mb-6 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300 relative z-10">
                    <Package className="h-8 w-8" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight relative z-10">{cat.name}</h3>
                  <p className="text-slate-500 line-clamp-2 font-medium mb-auto relative z-10">{cat.description || `Browse extensive inventory of wholesale ${cat.name.toLowerCase()}.`}</p>
                  
                  <div className="mt-6 flex items-center gap-2 text-sky-600 font-bold relative z-10 group-hover:text-sky-700">
                    Enter Section <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                  </div>

                  <img 
                    src={cat.imageUrl || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=300"} 
                    alt="" 
                    className="absolute -bottom-16 -right-16 w-64 h-64 object-cover opacity-5 group-hover:opacity-15 group-hover:scale-110 transition-all duration-700 mix-blend-multiply" 
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-b border-slate-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="inline-block py-1.5 px-4 rounded-full bg-sky-100 text-sky-700 font-black tracking-widest uppercase text-[10px] mb-4 border border-sky-200">Live Inventory API</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Trending Products</h2>
          </div>
          <Link href="/shop" className="text-sm font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 group">
            View Live Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-sky-500" /></div>
        ) : realProducts.length > 0 ? (
          <div className="relative flex overflow-hidden w-full group py-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <div className="flex w-max animate-seamless-marquee-slow pause-on-hover items-stretch gap-6 px-6">
              {[...realProducts, ...realProducts, ...realProducts].map((product, idx) => (
                <Link 
                  href={`/shop/${product.id}`} 
                  key={`${product.id}-${idx}`}
                  className="w-[320px] bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-sky-300 transition-all duration-300 flex flex-col shrink-0 overflow-hidden"
                >
                  <div className="relative h-60 bg-white p-6 border-b border-slate-100 flex items-center justify-center">
                    <img 
                      src={product.images?.[0] || '/logo.svg'} 
                      alt={product.name} 
                      className="object-contain max-w-full max-h-full hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-wider">
                      {product.categoryName || 'Component'}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">SKU: {product.sku}</p>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mb-4 line-clamp-2">{product.name}</h3>
                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-end justify-between">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Wholesale Base</p>
                        <p className="text-2xl font-black text-sky-600">₹{product.basePrice?.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 font-bold">No trending products available.</div>
        )}
      </section>


      <section className="py-32 bg-slate-950 relative overflow-hidden">
        <BackgroundHalations />
        <div className="absolute inset-0 bg-circuit opacity-10 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block py-1.5 px-4 rounded-full bg-sky-500/10 text-sky-400 font-black tracking-widest uppercase text-[10px] mb-4 border border-sky-500/20">The Infrastructure</span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6">Built for Absolute Scale.</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We provide more than just parts. Bharat Forge equips you with enterprise-grade tools, automated logistics, and pure data to dominate your local market segment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemCards.map((card, idx) => (
              <div 
                key={idx}
                className="group relative bg-white/5 backdrop-blur-md p-8 rounded-[2rem] border border-white/10 hover:border-sky-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-sky-500/20 rounded-full blur-[50px] group-hover:bg-sky-400/40 transition-colors duration-500"></div>
                <div className="h-14 w-14 bg-slate-900/50 border border-white/10 rounded-2xl flex items-center justify-center mb-6 text-sky-400 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
             <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 text-slate-600 font-black tracking-widest uppercase text-[10px] mb-4 border border-slate-200">Partnership Blueprint</span>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">How Dealerships Scale With Us</h2>
             <p className="text-slate-500 font-medium text-lg">A streamlined, transparent onboarding process designed to get your first shipment dispatched within days, not weeks.</p>
          </div>

          <div className="relative">
             <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden lg:block"></div>
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 relative z-10">
               {timelineSteps.map((step, idx) => (
                 <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all flex flex-col items-center text-center group">
                   <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-6 text-sky-600 group-hover:bg-sky-500 group-hover:text-white transition-colors shadow-sm">
                     <step.icon className="h-7 w-7" />
                   </div>
                   <h3 className="text-lg font-black text-slate-900 mb-3 leading-tight">{step.title}</h3>
                   <p className="text-sm text-slate-500 font-medium">{step.desc}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Tiered Distribution Network</h2>
            <p className="text-slate-500 font-medium text-lg">Unlock deeper margins and enterprise features as your monthly volume grows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tierBenefits.map((tier, idx) => (
              <div key={idx} className={`bg-white rounded-[2.5rem] border-2 overflow-hidden shadow-sm hover:shadow-xl transition-all relative ${tier.popular ? 'border-sky-400 transform md:-translate-y-4' : 'border-slate-200'}`}>
                {tier.popular && <div className="absolute top-0 inset-x-0 bg-sky-500 text-white text-[10px] font-black uppercase tracking-widest text-center py-2">Most Popular Volume</div>}
                <div className={`p-8 border-b ${tier.popular ? 'mt-4' : ''}`}>
                  <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border ${tier.color} mb-4`}>{tier.name}</span>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">{tier.volume}</h3>
                  <p className="text-slate-500 text-sm font-medium">Estimated Monthly Commitment</p>
                </div>
                <div className="p-8 bg-slate-50/50">
                  <ul className="space-y-4">
                    {tier.perks.map((perk, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 ${tier.popular ? 'text-sky-500' : 'text-slate-400'}`} /> {perk}
                      </li>
                    ))}
                  </ul>
                  <Link href="/apply-dealer" className={`mt-10 w-full block text-center py-4 rounded-xl font-black transition-colors ${tier.popular ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-lg shadow-sky-500/20' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}>
                    Apply For {tier.name.split(' ')[0]}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-circuit opacity-10"></div>
        <BackgroundHalations />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-white/10 pb-8">
            <div>
              <span className="inline-block py-1.5 px-4 rounded-full bg-sky-500/10 text-sky-400 font-black tracking-widest uppercase text-[10px] mb-4 border border-sky-500/20">Market Intelligence</span>
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Industry Insights</h2>
            </div>
            <Link href="/blogs" className="text-sm font-bold text-sky-400 hover:text-sky-300 flex items-center gap-2 group">
              Read More Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((post, idx) => (
                <Link href={`/blogs/${post.slug}`} key={post.id} className="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden group hover:bg-white/10 hover:border-sky-500/50 transition-all">
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                    <img src={post.thumbnailUrl || '/logo.svg'} alt={post.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute top-4 left-4 bg-sky-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {post.categoryName}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                      <Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-snug">{post.title}</h3>
                    <div className="flex items-center text-sky-400 font-bold text-sm gap-2 mt-auto group-hover:text-sky-300">
                      Read Full Report <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-32 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
             <span className="inline-block py-1.5 px-4 rounded-full bg-white text-slate-600 font-black tracking-widest uppercase text-[10px] mb-4 border border-slate-200 shadow-sm">Support Directory</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`border-2 rounded-[1.5rem] overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-sky-500 bg-white shadow-lg shadow-sky-900/5' : 'border-slate-200 bg-white hover:border-sky-200'}`}>
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-6 md:p-8 text-left focus:outline-none group">
                  <span className={`text-lg md:text-xl font-bold pr-8 transition-colors ${openFaq === idx ? 'text-sky-600' : 'text-slate-900'}`}>{faq.q}</span>
                  <span className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === idx ? 'bg-sky-500 text-white rotate-180 shadow-md shadow-sky-500/20' : 'bg-slate-50 text-slate-400 border border-slate-100 group-hover:bg-sky-50'}`}>
                    {openFaq === idx ? <Minus className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-6 md:px-8 pb-8 text-slate-600 text-lg font-medium leading-relaxed border-t border-slate-100 pt-6 mt-2 mx-2">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-32 pb-48 bg-slate-950 text-white relative overflow-hidden border-t border-slate-900">
        <BackgroundHalations />
        <div className="absolute inset-0 bg-grid-slate-100 opacity-5 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <div>
              <span className="inline-block py-1.5 px-4 rounded-full bg-sky-500/10 text-sky-400 font-black tracking-widest uppercase text-[10px] mb-6 border border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.2)]">Global Partnership Inquiry</span>
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[1.1] text-glow">Secure Your <br/>Supply Chain Today.</h2>
              <p className="text-slate-400 text-xl mb-12 max-w-lg leading-relaxed font-medium">
                Connect directly with our corporate B2B onboarding team. We process and verify high-volume dealership applications within 48 business hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="h-16 w-16 bg-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400 border border-sky-500/30"><Phone className="h-7 w-7" /></div>
                  <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Dealer Priority Line</p>
                    <p className="text-2xl font-black tracking-tight text-white">+91 20 2682 4666</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors cursor-pointer">
                  <div className="h-16 w-16 bg-sky-500/20 rounded-2xl flex items-center justify-center text-sky-400 border border-sky-500/30"><Mail className="h-7 w-7" /></div>
                  <div>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Corporate Sales</p>
                    <p className="text-2xl font-black tracking-tight text-white">b2b@bharatforge.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 md:p-14 text-slate-900 shadow-[0_0_50px_rgba(14,165,233,0.15)] relative border border-slate-200">
              <h3 className="text-3xl font-black mb-3 tracking-tight">Direct Connect Portal</h3>
              <p className="text-slate-500 font-medium mb-10 text-lg">Key account managers respond within 2 hours.</p>
              
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Registered Business Name</label>
                    <input type="text" placeholder="Apex Auto Traders" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-medium" />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Work Email Address</label>
                    <input type="email" placeholder="procurement@company.com" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-medium" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Primary Inquiry Type</label>
                  <select defaultValue="" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-medium appearance-none">
                    <option value="" disabled>Select corporate requirement...</option>
                    <option value="dealership">Tier-1 Dealership Application</option>
                    <option value="bulk">Enterprise Bulk Container Order</option>
                    <option value="api">API / ERP Integration Request</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Message & Volume Details</label>
                  <textarea rows={4} placeholder="Outline your monthly volume requirements and current pain points..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none resize-none font-medium"></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-950 hover:bg-sky-600 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-sky-500/25 mt-6 border border-slate-800 hover:border-sky-500">
                  Initialize Official Request <Send className="h-6 w-6 ml-1" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* GLOBAL HEADQUARTERS MAP SECTION */}
      <section className="py-32 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 text-slate-600 font-black tracking-widest uppercase text-[10px] mb-4 border border-slate-200 shadow-sm">Global Operations</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">Visit Our Headquarters</h2>
              <p className="text-slate-500 font-medium text-lg">Located in the industrial heart of Pune, Maharashtra.</p>
            </div>
            <a 
              href={`https://www.google.com/maps/dir/?api=1&destination=${hqLocation.lat},${hqLocation.lng}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black hover:bg-sky-600 transition-colors shadow-lg hover:shadow-sky-500/25 flex items-center gap-2 shrink-0 border border-slate-800 hover:border-sky-500"
            >
              <MapPin className="w-5 h-5" /> Get Directions
            </a>
          </div>

          <div className="h-[500px] w-full rounded-[3rem] overflow-hidden border border-slate-200 shadow-[0_0_50px_rgba(14,165,233,0.1)] relative z-10">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={hqLocation}
                zoom={14}
                options={{ 
                  disableDefaultUI: false, 
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true,
                  styles: [
                    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] }
                  ]
                }}
              >
                <Marker
                  position={hqLocation}
                  onClick={() => setIsMarkerOpen(true)}
                  icon={{
                    path: window.google.maps.SymbolPath.CIRCLE,
                    fillColor: '#0ea5e9',
                    fillOpacity: 1,
                    strokeWeight: 4,
                    strokeColor: '#ffffff',
                    scale: 14,
                  }}
                >
                  {isMarkerOpen && (
                    <InfoWindow onCloseClick={() => setIsMarkerOpen(false)}>
                      <div className="p-4 max-w-[250px]">
                        <h3 className="font-black text-slate-900 mb-2 text-base">Bharat Forge HQ</h3>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                          Pune Cantonment, Mundhwa<br />
                          Pune 411036, Maharashtra, India
                        </p>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${hqLocation.lat},${hqLocation.lng}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-sky-500 text-white px-4 py-2.5 rounded-xl text-xs font-black block text-center hover:bg-sky-600 transition-colors"
                        >
                          Navigate Here
                        </a>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              </GoogleMap>
            ) : (
              <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full"></div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Map Data...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <FloatingActionButton />
    </div>
  );
}