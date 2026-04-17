"use client";

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { 
  ChevronRight, Search, MessageCircleQuestion, HelpCircle, 
  Eye, ArrowRight, Activity, TrendingUp
} from 'lucide-react';
import { getPaginatedFaqs } from '@/api/public/faq';

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function PublicFaqListingPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('');
  
  const categories = ['All', 'Dealership', 'Products & Tech', 'Shipping & Logistics', 'Returns & Support', 'General'];

  useEffect(() => {
    const fetchFaqs = async () => {
      setIsLoading(true);
      try {
        const res = await getPaginatedFaqs({ 
          search, 
          category: activeCategory === 'All' ? '' : activeCategory,
          limit: 20
        });
        setFaqs(res.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const timeoutId = setTimeout(() => fetchFaqs(), 300);
    return () => clearTimeout(timeoutId);
  }, [search, activeCategory]);

  return (
    <div className="bg-slate-50 min-h-screen w-full font-sans selection:bg-sky-500 selection:text-white pb-20">
      
      <section className="pt-28 pb-16 bg-white border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-[linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">
            <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-sky-600">Knowledge Base</span>
          </div>

          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="text-center">
            <motion.div variants={fadeUpVariant} className="inline-flex items-center justify-center h-16 w-16 bg-sky-50 rounded-2xl mb-6 shadow-sm">
              <MessageCircleQuestion className="h-8 w-8 text-sky-600" />
            </motion.div>
            <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Questions</span>
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-lg text-slate-500 font-medium mb-12 max-w-2xl mx-auto">
              Everything you need to know about our supply chain, dealer programs, and technical specifications.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="relative max-w-3xl mx-auto shadow-2xl shadow-sky-900/10 rounded-2xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-sky-500" />
              <input
                type="text"
                placeholder="Search for answers (e.g. 'minimum order', 'warranty')..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-16 pr-6 py-6 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-lg text-slate-900 placeholder:text-slate-400"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
                (activeCategory === cat) || (activeCategory === '' && cat === 'All')
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse"></div>
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-500">We couldn't find any FAQs matching your search.</p>
            <button onClick={() => setSearch('')} className="mt-6 text-sky-600 font-bold hover:underline">Clear Search</button>
          </div>
        ) : (
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
            <div className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm uppercase tracking-widest pl-2">
              <TrendingUp className="w-4 h-4" /> Most Viewed
            </div>
            
            {faqs.map((faq, idx) => (
              <motion.div key={faq.id} variants={fadeUpVariant}>
                <Link 
                  href={`/faq/${faq.id}`}
                  className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 group"
                >
                  <div className="flex justify-between items-center gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">{faq.category}</span>
                        <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                          <Eye className="w-3.5 h-3.5" /> {faq.viewCount} views
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="h-10 w-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-sky-500 transition-colors">
                      <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}