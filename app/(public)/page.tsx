"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { 
  ArrowRight, Plus, Minus, Send, Globe2, Truck, ShieldCheck, ChevronRight, 
  Package, Loader2, Phone, MessageCircle, HelpCircle, X, CheckCircle2, 
  TrendingUp, Users, Clock, Building, ArrowUpRight, MapPin, Mail, 
  ShoppingCart, Cpu, Network, Lock, Activity, Layers, Repeat, Calendar, 
  FileText, Award, BarChart, Settings, Anchor, Star, Quote, ThumbsUp, Zap
} from 'lucide-react';
import { getCategories, browseProducts } from '@/api/public/catalog';
import { getPaginatedArticles } from '@/api/public/articles';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const CustomStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @keyframes seamlessMarquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    .animate-seamless-marquee { animation: seamlessMarquee 40s linear infinite; }
    .animate-seamless-marquee-slow { animation: seamlessMarquee 60s linear infinite; }
    .pause-on-hover:hover { animation-play-state: paused; }
    .text-glow { text-shadow: 0 0 20px rgba(14, 165, 233, 0.5); }
    .hide-scrollbar::-webkit-scrollbar { display: none; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
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
  { icon: Activity, title: "Real-time Telemetry", desc: "Track high-value shipments via GPS and IoT sensors right from your dealer dashboard." }
];

const faqs = [
  { q: "What is the minimum order quantity (MOQ)?", a: "MOQs vary strictly by product category to optimize shipping economics. Passenger tyres generally require 50 units, while commercial batteries require 20 units." },
  { q: "How do I become an authorized dealer?", a: "Submit an application via our 'Partner With Us' portal with your GSTIN and business registration. Digital approval usually occurs within 48 hours." },
  { q: "Do you offer API access for inventory syncing?", a: "Yes. Enterprise-tier dealers receive full REST API access to synchronize live inventory and dynamic pricing directly into their existing ERPs." },
  { q: "What are your payment and credit terms?", a: "Following a 3-month probationary period, high-volume dealers can unlock 30 to 45-day rolling credit facilities, subject to financial review." }
];

const b2bCards = [
  { img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80", title: "Bulk Container Shipping", desc: "Optimized logistics for high-volume enterprise orders." },
  { img: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80", title: "API & ERP Sync", desc: "Direct integration into your existing systems." },
  { img: "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80", title: "Extended Credit Lines", desc: "Net 45-60 payment terms for platinum partners." },
  { img: "https://plus.unsplash.com/premium_photo-1661266851970-7f2bf75fdc40?auto=format&fit=crop&q=80", title: "Dedicated Account Manager", desc: "Priority 24/7 routing to dedicated support." }
];

const b2cCards = [
  { img: "https://plus.unsplash.com/premium_photo-1682141811863-f8d97e951857?auto=format&fit=crop&q=80", title: "Retail Purchases", desc: "Buy authentic OEM components directly." },
  { img: "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80", title: "Installation Network", desc: "Access certified mechanics in your area." },
  { img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80", title: "Warranty Registration", desc: "Instant digital warranty activation." },
  { img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80", title: "Consumer Support", desc: "Friendly consumer assistance 24/7." }
];

const testimonials = [
  { name: "Rajesh Kumar", role: "Fleet Director", text: "BharatForge completely revolutionized our procurement. The predictive analytics ensure we never run out of critical components.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80" },
  { name: "Anita Desai", role: "Retail Customer", text: "Got authentic OEM parts for my Audi delivered within 48 hours. The certified installation network is an absolute lifesaver.", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80" },
  { name: "Vikram Singh", role: "Workshop Owner", text: "The API integration into our ERP system is flawless. Ordering wholesale stock is now a one-click process.", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80" },
  { name: "Priya Sharma", role: "Logistics Manager", text: "Global sourcing used to be a nightmare with middlemen. BharatForge gives us direct Tier-1 pricing with transparent shipping.", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80" },
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

const BloomingButton = ({ href, children }: { href: string, children: React.ReactNode }) => {
  return (
    <Link href={href} className="relative group inline-flex items-center justify-center w-full sm:w-auto z-20">
      <div className="absolute inset-0 bg-sky-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-100 transition-all duration-500"></div>
      <div className="relative flex items-center gap-2 bg-slate-950 text-white px-8 py-4 rounded-[14px] font-bold transition-all group-hover:bg-slate-900 w-full justify-center border border-sky-500/30">
        {children}
      </div>
    </Link>
  );
};

const AnimatedStat = ({ value, suffix, label, icon: Icon }: any) => {
  const count = useCounter(value, 2.5);
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-2xl border border-slate-100/50 rounded-[2rem] shadow-sm hover:shadow-xl transition-transform duration-500 relative group">
      <div className="h-16 w-16 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
        <Icon className="h-8 w-8" />
      </div>
      <div className="flex items-baseline gap-1 relative z-10">
        <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{count.toLocaleString()}</span>
        <span className="text-2xl font-bold text-sky-500">{suffix}</span>
      </div>
      <p className="mt-3 text-xs font-black text-slate-500 uppercase tracking-widest text-center">{label}</p>
    </div>
  );
};

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [segmentProducts, setSegmentProducts] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingSegments, setLoadingSegments] = useState(false);
  
  const [serviceTab, setServiceTab] = useState<'b2b' | 'b2c'>('b2b');
  const [activeCat, setActiveCat] = useState<string>('');

  const { scrollYProgress } = useScroll();
  const opacityHero = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  const mapContainerStyle = { width: '100%', height: '100%' };
  const hqLocation = { lat: 18.5293, lng: 73.9042 };
  const [isMarkerOpen, setIsMarkerOpen] = useState(false);
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '' });

  // Initial Data Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [catRes, prodRes, artRes] = await Promise.all([
          getCategories(),
          browseProducts({ page: 1, limit: 12 }),
          getPaginatedArticles({ page: 1, limit: 3 })
        ]);
        const fetchedCats = Array.isArray(catRes.data) ? catRes.data : [];
        setCategories(fetchedCats);
        if (fetchedCats.length > 0) setActiveCat(fetchedCats[0].id);
        
        setTrendingProducts(prodRes.data?.data || []);
        setArticles(artRes.data?.data || []);
      } catch (error) {} finally {
        setLoadingInitial(false);
      }
    };
    fetchInitialData();
  }, []);

  // Filter Segment Products when Active Category Changes
  useEffect(() => {
    if (!activeCat) return;
    const fetchSegment = async () => {
      setLoadingSegments(true);
      try {
        const res = await browseProducts({ categoryId: activeCat, page: 1, limit: 8 });
        setSegmentProducts(res.data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSegments(false);
      }
    };
    fetchSegment();
  }, [activeCat]);

  const displayedServiceCards = serviceTab === 'b2b' ? b2bCards : b2cCards;

  return (
    <div className="bg-slate-50 min-h-screen w-full font-sans selection:bg-sky-500 selection:text-white">
      <CustomStyles />

      {/* HERO SECTION */}
      <section className="relative h-[100svh] flex items-center justify-center overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0 w-full h-full">
          <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-60">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950 z-10" />
        </div>

        <motion.div style={{ opacity: opacityHero }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-center pb-20 pt-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8 shadow-[0_0_30px_rgba(14,165,233,0.15)]">
            <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span></span>
            <span className="text-white font-bold text-xs tracking-widest uppercase">B2B & B2C Export & Dealership Network</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[1.05]">
            Engineered for <br className="hidden md:block"/><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-400 drop-shadow-[0_0_40px_rgba(14,165,233,0.4)]">Performance.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            The ultimate supply chain backbone for premium automotive parts, batteries, and accessories. Empower your business with global sourcing and predictive inventory.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <BloomingButton href="/shop">Explore Products <ArrowRight className="h-5 w-5 ml-1" /></BloomingButton>
            <Link href="/apply-dealer" className="relative group overflow-hidden rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 text-white px-8 py-4 font-bold transition-all hover:bg-white/10 flex items-center justify-center gap-2 w-full sm:w-auto">
              <Building className="h-5 w-5" /> Partner Network
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-slate-50 relative z-30 mx-4 md:mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => <AnimatedStat key={idx} {...stat} />)}
        </div>
      </section>

      {/* QUALITY SERVICES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80" alt="Tech" className="w-full h-48 object-cover rounded-3xl" />
              <img src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80" alt="Auto" className="w-full h-64 object-cover rounded-3xl" />
            </div>
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1725289339928-06ee31684df5?auto=format&fit=crop&q=80" alt="Engine" className="w-full h-64 object-cover rounded-3xl" />
              <img src="https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&q=80" alt="Mechanic" className="w-full h-48 object-cover rounded-3xl" />
            </div>
          </div>
          <div className="lg:w-1/2 w-full">
            <span className="text-slate-400 font-black tracking-widest uppercase text-[10px] mb-2 block">Your Infrastructure Experts</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Quality <span className="text-sky-600">B2B & B2C</span><br/>Services</h2>
            <p className="text-slate-600 font-medium text-lg mb-6 leading-relaxed">
              We provide customers with an industry-leading OEM warranty and predictive supply chain solutions. Whether you're a retail consumer or enterprise distributor, you receive uncompromising quality.
            </p>
            <p className="text-slate-600 font-medium text-lg mb-8 leading-relaxed">
              Our automated systems set us apart from competitors and show our commitment to speed, scale, and service.
            </p>
            <Link href="/about" className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3.5 rounded-full font-bold transition-colors inline-block shadow-md">
              READ MORE
            </Link>
          </div>
        </div>
      </section>

      {/* HOW CAN WE HELP YOU (TABS) */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-slate-400 font-black tracking-widest uppercase text-[10px] mb-2 block">Open 24/7 with office staff</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">How Can We Help You?</h2>
          <div className="flex justify-center mb-16">
            <div className="relative bg-white p-1.5 rounded-full flex shadow-sm border border-slate-200 w-full max-w-lg">
              {/* Sliding Background for Active Tab */}
              <div 
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-sky-500 rounded-full transition-all duration-300 ease-out z-0 shadow-md ${
                  serviceTab === 'b2b' ? 'left-[6px]' : 'left-1/2'
                }`}
              />
              <button 
                onClick={() => setServiceTab('b2b')} 
                className={`flex-1 py-3.5 rounded-full font-bold transition-colors z-10 text-sm md:text-base ${serviceTab === 'b2b' ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                B2B Dealership
              </button>
              <button 
                onClick={() => setServiceTab('b2c')} 
                className={`flex-1 py-3.5 rounded-full font-bold transition-colors z-10 text-sm md:text-base ${serviceTab === 'b2c' ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                B2C Purchase
              </button>
            </div>
          </div>

          <div className="min-h-[350px]">
            <AnimatePresence mode="wait">
              <motion.div 
                key={serviceTab} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                transition={{ duration: 0.3 }} 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left"
              >
                {displayedServiceCards.map((card, idx) => (
                  <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-200 group">
                    <div className="h-48 overflow-hidden">
                      <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black text-slate-900 mb-2">{card.title}</h3>
                      <p className="text-slate-500 font-medium text-sm">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* TRENDING PRODUCTS */}
      <section className="py-24 bg-white border-b border-slate-100 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="inline-block py-1.5 px-4 rounded-full bg-sky-100 text-sky-700 font-black tracking-widest uppercase text-[10px] mb-4 border border-sky-200">Live Inventory API</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Trending Products</h2>
            </div>
            <Link href="/shop" className="text-sm font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 group">
              View Live Catalog <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loadingInitial ? (
            <div className="flex justify-center items-center h-64"><Loader2 className="w-10 h-10 animate-spin text-sky-500" /></div>
          ) : trendingProducts.length > 0 ? (
            <div className="relative flex overflow-hidden w-full group py-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
              <div className="flex w-max animate-seamless-marquee-slow pause-on-hover items-stretch gap-6 px-6">
                {[...trendingProducts, ...trendingProducts, ...trendingProducts].map((product, idx) => (
                  <Link href={`/shop/${product.id}`} key={`${product.id}-${idx}`} className="w-[320px] bg-slate-50 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col shrink-0 overflow-hidden">
                    <div className="relative h-60 bg-white p-6 border-b border-slate-100 flex items-center justify-center">
                      <img src={product.images?.[0] || '/logo.svg'} alt={product.name} className="object-contain max-w-full max-h-full hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 right-4 bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 border border-slate-200 uppercase tracking-wider">{product.categoryName || 'Component'}</div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">SKU: {product.sku}</p>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-4 line-clamp-2">{product.name}</h3>
                      <div className="mt-auto pt-4 border-t border-slate-200 flex items-end justify-between">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">Wholesale Base</p>
                          <p className="text-2xl font-black text-sky-600">₹{product.basePrice?.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-sky-500 group-hover:text-white transition-colors"><ShoppingCart className="w-5 h-5" /></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* EXPLORE SEGMENTS (TABS FILTERED) */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Explore Segments</h2>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar justify-start md:justify-center mb-12 pb-4">
            <div className="flex bg-white p-1.5 rounded-full shadow-sm border border-slate-200 shrink-0 relative">
              {categories.slice(0, 6).map((cat) => {
                const isActive = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`relative px-6 py-3 rounded-full font-bold text-sm transition-colors whitespace-nowrap z-10 ${
                      isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeCategory"
                        className="absolute inset-0 bg-sky-500 rounded-full -z-10 shadow-md"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              {loadingSegments ? (
                <motion.div 
                  key="loading" 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex justify-center items-center h-64"
                >
                  <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
                </motion.div>
              ) : segmentProducts.length > 0 ? (
                <motion.div 
                  key={activeCat} 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                  className="relative flex overflow-hidden w-full group py-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
                >
                  <div className="flex w-max animate-seamless-marquee items-stretch gap-6 px-6 hover:[animation-play-state:paused]">
                    {[...segmentProducts, ...segmentProducts].map((product, idx) => (
                      <Link href={`/shop/${product.id}`} key={`${product.id}-${idx}`} className="w-[280px] bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col shrink-0 overflow-hidden group">
                        <div className="relative h-48 bg-slate-50 p-6 border-b border-slate-100 flex items-center justify-center">
                          <img src={product.images?.[0] || '/logo.svg'} alt={product.name} className="object-contain max-w-full max-h-full group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                          <h3 className="text-md font-bold text-slate-900 leading-tight mb-2 line-clamp-2">{product.name}</h3>
                          <div className="mt-auto flex items-end justify-between">
                            <p className="text-xl font-black text-sky-600">₹{product.basePrice?.toLocaleString()}</p>
                            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-sky-500" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-12 text-slate-500 font-bold">
                  No products found in this category.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* THE INFRASTRUCTURE */}
      <section className="py-32 relative bg-fixed bg-center bg-cover bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')]">
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="inline-block py-1.5 px-4 rounded-full bg-sky-50 text-sky-600 font-black tracking-widest uppercase text-[10px] mb-4 border border-sky-100">The Infrastructure</span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">Built for Absolute Scale.</h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">
              We provide more than just parts. Equip yourself with enterprise-grade tools, automated logistics, and pure data.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ecosystemCards.map((card, idx) => (
              <div key={idx} className="group relative bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="h-14 w-14 bg-sky-50 border border-sky-100 rounded-2xl flex items-center justify-center mb-6 text-sky-600 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300">
                  <card.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INDUSTRY INSIGHTS */}
      <section className="py-24 relative bg-fixed bg-center bg-cover border-t border-slate-200 bg-[url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80')]">
        <div className="absolute inset-0 bg-slate-50/95 backdrop-blur-md z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 pb-8">
            <div>
              <span className="inline-block py-1.5 px-4 rounded-full bg-white text-slate-500 font-black tracking-widest uppercase text-[10px] mb-4 border border-slate-200 shadow-sm">Market Intelligence</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Industry Insights</h2>
            </div>
            <Link href="/blogs" className="text-sm font-bold text-sky-600 hover:text-sky-700 flex items-center gap-2 group">
              Read More Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          {loadingInitial ? (
            <div className="flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map((post) => (
                <Link href={`/blogs/${post.slug}`} key={post.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden group shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img src={post.thumbnailUrl || '/logo.svg'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-white text-sky-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                      {post.categoryName}
                    </div>
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider"><Calendar className="w-4 h-4" /> {new Date(post.createdAt).toLocaleDateString()}</div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-snug">{post.title}</h3>
                    <div className="flex items-center text-sky-600 font-bold text-sm gap-2 mt-auto group-hover:text-sky-700">Read Full Report <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PARTNER CAROUSEL */}
      <section className="bg-white py-12 border-y border-slate-200 overflow-hidden relative z-10">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sourcing exclusively from global Tier-1 manufacturers</p>
        </div>
        <div className="relative flex overflow-hidden w-full bg-white [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-[200%] animate-seamless-marquee items-center justify-around">
            {[...marqueeLogos, ...marqueeLogos, ...marqueeLogos].map((logo, idx) => (
              <img key={idx} src={logo} alt="Partner Logo" className="h-12 w-auto max-w-[160px] object-contain mx-10 filter grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            ))}
          </div>
        </div>
      </section>

      {/* NEW TESTIMONIALS SECTION (Light Theme) */}
      <section className="py-32 relative bg-fixed bg-center bg-cover border-b border-slate-200 bg-[url('https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&q=80')]">
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 text-slate-600 font-black tracking-widest uppercase text-[10px] mb-4 border border-slate-200 shadow-sm">Client Success</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Trusted Worldwide</h2>
            <p className="text-slate-600 text-lg leading-relaxed font-medium">Don't just take our word for it. Hear what industry leaders and retail customers are saying.</p>
          </div>

          <div className="relative flex overflow-hidden w-full group py-4 [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
            <div className="flex w-max animate-seamless-marquee items-stretch gap-6 px-6 hover:[animation-play-state:paused]">
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div key={idx} className="w-[400px] bg-white rounded-3xl border border-slate-200 p-8 flex flex-col shrink-0 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <Quote className="w-10 h-10 text-slate-200 mb-4" />
                  <p className="text-slate-700 font-medium text-lg italic leading-relaxed flex-1 mb-8">"{testimonial.text}"</p>
                  <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                    <img src={testimonial.img} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-sky-500" />
                    <div>
                      <h4 className="text-slate-900 font-bold">{testimonial.name}</h4>
                      <p className="text-sky-600 text-sm font-medium">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW WHY CHOOSE US SECTION */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1.5 px-4 rounded-full bg-slate-50 text-slate-600 font-black tracking-widest uppercase text-[10px] mb-4 border border-slate-200 shadow-sm">The BharatForge Advantage</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">Why Choose Us?</h2>
            <p className="text-slate-600 font-medium text-lg leading-relaxed">
              We eliminate supply chain bottlenecks, guarantee authenticity, and optimize logistics from manufacturer to your door.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 flex flex-col items-center text-center hover:border-sky-300 transition-colors group">
              <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6 text-sky-500 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">100% Genuine Parts</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Every SKU is sourced directly from certified Tier-1 manufacturers, guaranteeing OEM compliance and safety.</p>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 flex flex-col items-center text-center hover:border-sky-300 transition-colors group">
              <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6 text-sky-500 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <Zap className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Lightning Fast Dispatch</h3>
              <p className="text-slate-600 font-medium leading-relaxed">With localized fulfillment centers globally, orders are processed and dispatched within 24 hours of placement.</p>
            </div>

            <div className="bg-slate-50 p-10 rounded-3xl border border-slate-200 flex flex-col items-center text-center hover:border-sky-300 transition-colors group">
              <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-6 text-sky-500 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all">
                <ThumbsUp className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">Unmatched Reliability</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Our 99.8% fulfillment success rate means you can confidently promise delivery to your end customers.</p>
            </div>
          </div>
        </div>
      </section>
      {/* SUPPORT DIRECTORY (FAQ + CONTACT) */}
      <section className="py-32 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="inline-block py-1.5 px-4 rounded-full bg-white text-slate-600 font-black tracking-widest uppercase text-[10px] mb-4 border border-slate-200 shadow-sm">Support Directory</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`border rounded-[1.5rem] overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-sky-500 bg-sky-50/30 shadow-md shadow-sky-900/5' : 'border-slate-200 bg-white hover:border-sky-200'}`}>
                  <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} className="w-full flex items-center justify-between p-6 text-left focus:outline-none group">
                    <span className={`text-lg font-bold pr-8 transition-colors ${openFaq === idx ? 'text-sky-600' : 'text-slate-900'}`}>{faq.q}</span>
                    <span className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${openFaq === idx ? 'bg-sky-500 text-white rotate-180' : 'bg-slate-50 text-slate-400 group-hover:bg-sky-50'}`}>
                      {openFaq === idx ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="px-6 pb-6 text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4 mt-2 mx-2">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-10 md:p-14 text-slate-900 border border-slate-200 shadow-xl shadow-sky-900/5">
            <h3 className="text-3xl font-black mb-3 tracking-tight">Direct Connect Portal</h3>
            <p className="text-slate-500 font-medium mb-10 text-lg">Key account managers respond within 2 hours.</p>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Business Name</label>
                  <input type="text" placeholder="Apex Auto Traders" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-medium transition-shadow" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Email Address</label>
                  <input type="email" placeholder="procurement@company.com" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-medium transition-shadow" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Inquiry Type</label>
                <select defaultValue="" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-medium appearance-none transition-shadow">
                  <option value="" disabled>Select requirement...</option>
                  <option value="dealership">Dealership Application</option>
                  <option value="bulk">Bulk Order</option>
                  <option value="api">API Integration</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Message</label>
                <textarea rows={4} placeholder="Outline your requirements..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none resize-none font-medium transition-shadow"></textarea>
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-sky-600 text-white font-black text-lg py-5 rounded-2xl flex items-center justify-center gap-2 transition-all mt-6 shadow-md hover:shadow-sky-500/25 border border-slate-800 hover:border-sky-500">
                Submit Request <Send className="h-6 w-6 ml-1" />
              </button>
            </form>
          </div>
        </div>
      </section>



      {/* MAP SECTION */}
      <section className="w-full relative h-[60vh] min-h-[500px]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={hqLocation}
            zoom={14}
            options={{ disableDefaultUI: false, zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: true }}
          >
            <Marker position={hqLocation} onClick={() => setIsMarkerOpen(true)} icon={{ path: window.google.maps.SymbolPath.CIRCLE, fillColor: '#0ea5e9', fillOpacity: 1, strokeWeight: 4, strokeColor: '#ffffff', scale: 14 }}>
              {isMarkerOpen && (
                <InfoWindow onCloseClick={() => setIsMarkerOpen(false)}>
                  <div className="p-4 max-w-[250px]">
                    <h3 className="font-black text-slate-900 mb-2 text-base">Bharat Forge HQ</h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">Pune Cantonment, Mundhwa<br />Pune 411036, Maharashtra, India</p>
                    <a href={`https://www.google.com/maps/dir/?api=1&destination=${hqLocation.lat},${hqLocation.lng}`} target="_blank" rel="noopener noreferrer" className="bg-sky-500 text-white px-4 py-2.5 rounded-xl text-xs font-black block text-center hover:bg-sky-600 transition-colors">Navigate Here</a>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          </GoogleMap>
        ) : (
          <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading Map Data...</p>
          </div>
        )}
      </section>

    </div>
  );
}