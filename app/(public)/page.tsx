"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight, Plus, Minus, Send, BarChart3, Globe2, Truck, ShieldCheck,
  Star, ChevronRight, Quote, Package, Loader2, PlayCircle
} from 'lucide-react';
import { getCategories } from '@/api/public/catalog';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
}

const stats = [
  { value: '10K+', label: 'Active Dealers' },
  { value: '500+', label: 'SKUs Available' },
  { value: '99%', label: 'Fulfillment Rate' },
  { value: '24/7', label: 'B2B Support' },
];

const features = [
  {
    title: 'Global Sourcing',
    desc: 'Direct partnerships with top-tier international manufacturers ensuring premium quality.',
    icon: Globe2,
  },
  {
    title: 'Just-in-Time Delivery',
    desc: 'Advanced logistics network ensuring your inventory is replenished exactly when needed.',
    icon: Truck,
  },
  {
    title: 'Certified Quality',
    desc: 'All products undergo rigorous testing and carry BIS, ISO, and DOT certifications.',
    icon: ShieldCheck,
  },
  {
    title: 'Data-Driven Insights',
    desc: 'Access market trends and predictive inventory analytics through our dealer portal.',
    icon: BarChart3,
  },
];

const testimonials = [
  {
    quote: "Bharat Forge's supply chain reliability has transformed our business. We rarely face stockouts now, and their wholesale pricing is unmatched.",
    author: "Rajeev Sharma",
    company: "Apex Motors & Spares",
    rating: 5
  },
  {
    quote: "The quality of imported tyres we receive is consistently excellent. The B2B portal makes reordering seamless, saving us hours.",
    author: "Anita Desai",
    company: "Desai Auto Hub",
    rating: 5
  },
  {
    quote: "Exceptional warranty support. On the rare occasion we have a defect claim, their team resolves it within 48 hours. A professional partner.",
    author: "Vikram Singh",
    company: "Standard Transport Solutions",
    rating: 5
  }
];

const faqs = [
  {
    q: "What is the minimum order quantity (MOQ) for dealers?",
    a: "Our standard MOQ varies by product category. For passenger tyres, the MOQ is typically 50 units. For commercial batteries, it is 20 units. Registered dealers can view tier-specific MOQs directly in their dashboard."
  },
  {
    q: "How do I become an authorized Bharat Forge dealer?",
    a: "You can apply through our Partner With Us page. We require a valid GSTIN, business registration details, and a physical store location for verification. Approval usually takes 48-72 hours."
  },
  {
    q: "What certifications do your products carry?",
    a: "All our imported products are fully compliant with Indian regulations, including BIS certification. International products also carry DOT, ECE, and ISO certifications where applicable."
  },
  {
    q: "Do you offer credit facilities for high-volume dealers?",
    a: "Yes. After an initial probationary period of 3 months, high-volume dealers can apply for our 30-day or 45-day rolling credit facilities, subject to financial review."
  }
];

const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" as const } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

useEffect(() => {
    const fetchDynamicCategories = async () => {
      try {
        const res = await getCategories();
        // Extract the data array from the Axios response
        const categoryData = Array.isArray(res.data) ? res.data : [];
        setCategories(categoryData);
      } catch (error) {
        console.error("Failed to fetch categories");
      } finally {
        setLoadingCats(false);
      }
    };
    fetchDynamicCategories();
  }, []);
  return (
    <div className="bg-slate-50 min-h-screen w-full font-sans selection:bg-sky-500 selection:text-white">

      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]">
          <motion.div
            animate={{ backgroundPosition: ['0px 0px', '64px 64px'] }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] bg-[size:4rem_4rem]"
          />
        </div>

        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob" />
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pt-20">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="max-w-4xl mx-auto">
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-sky-100 shadow-sm mb-8">
              <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="text-sky-700 font-bold text-xs tracking-widest uppercase">Premium Importers & Distributors</span>
            </motion.div>

            <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]">
              Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">Performance.</span><br />
              Built for India.
            </motion.h1>

            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              Leading the supply chain for world-class automotive tyres and advanced battery systems. Partner with us for unparalleled B2B wholesale pricing and reliable inventory.
            </motion.p>

            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="/apply-dealer" className="w-full sm:w-auto bg-sky-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 group">
                Become a Dealer <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/shop" className="w-full sm:w-auto bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:border-sky-500 hover:text-sky-600 hover:shadow-lg transition-all flex items-center justify-center gap-2">
                <PlayCircle className="h-5 w-5" /> Explore Catalog
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-transparent py-16 relative z-20 -mt-16 mx-4 md:mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 text-center hover:-translate-y-1 transition-transform"
            >
              <h3 className="text-4xl font-black text-slate-900 mb-2">{stat.value}</h3>
              <p className="text-sky-600 font-bold text-xs tracking-wider uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4 block">Our Inventory</motion.span>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-black text-slate-900">
            Dynamic Categories
          </motion.h2>
        </div>

        {loadingCats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-[450px] bg-white rounded-[2rem] border border-slate-100 shadow-sm animate-pulse flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-sky-200 animate-spin" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: idx * 0.15 }}
                className="group relative h-[450px] rounded-[2rem] overflow-hidden cursor-pointer bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-sky-900/10 transition-all duration-500"
              >
                <img
                  src={
                    cat.imageUrl ||
                    (cat.name.toLowerCase().includes('batter')
                      ? "https://adbattery.eu/wp-content/uploads/2019/11/509_px.png"
                      : "https://www.continental-tires.com/tire-knowledge/tire-types/_jcr_content/root/container/container_772073047/container_933190352/image.coreimg.jpeg/1684847851626/co-asc2.jpeg")
                  }
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:rotate-1 transition-transform duration-700 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent opacity-100" />

                <div className="absolute inset-0 p-10 flex flex-col justify-end">
                  <div className="w-14 h-14 bg-white shadow-lg shadow-slate-200/50 rounded-2xl flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                    <Package className="h-6 w-6 text-sky-500" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-3">{cat.name}</h3>
                  <p className="text-slate-600 mb-8 max-w-md line-clamp-2 font-medium">{cat.description || `Browse our extensive collection of ${cat.name.toLowerCase()} available for wholesale.`}</p>
                  <Link href={`/shop?categoryId=${cat.id}`} className="inline-flex items-center gap-2 bg-slate-900 hover:bg-sky-600 text-white w-fit px-6 py-3.5 rounded-xl font-bold transition-all shadow-md group-hover:px-8">
                    Browse Selection <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No categories available at the moment.</p>
          </div>
        )}
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/3"
            >
              <span className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4 block">The Advantage</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
                Built for the <br />Modern B2B <br />Ecosystem.
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                We remove the friction from automotive wholesale. From transparent pricing to digitized inventory management, we empower our dealers to scale faster.
              </p>
              <Link href="/apply-dealer" className="inline-flex items-center gap-2 text-sky-600 font-bold hover:text-sky-700 bg-sky-50 px-6 py-3 rounded-xl transition-colors">
                Partner with us <ArrowRight className="h-5 w-5" />
              </Link>
            </motion.div>

            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-sky-100 transition-all duration-300 group"
                >
                  <div className="h-14 w-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:scale-110 transition-all duration-300">
                    <feature.icon className="h-7 w-7 text-sky-600 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4 block">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Trusted by Industry Leaders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30 relative hover:-translate-y-2 transition-transform duration-300"
              >
                <Quote className="absolute top-8 right-8 h-10 w-10 text-sky-100" />
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(test.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 text-lg leading-relaxed mb-8 font-medium">"{test.quote}"</p>
                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                  <div className="h-12 w-12 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-black text-xl">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{test.author}</p>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{test.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16">

          <div>
            <span className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4 block">Knowledge Base</span>
            <h2 className="text-4xl font-black text-slate-900 mb-10">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-sky-200 bg-sky-50 shadow-sm' : 'border-slate-200 bg-white hover:border-sky-100'}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                  >
                    <span className="font-bold text-slate-900 pr-8">{faq.q}</span>
                    <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${openFaq === idx ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-200 text-slate-400 bg-slate-50'}`}>
                      {openFaq === idx ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-slate-600 font-medium leading-relaxed">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-slate-50 border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] p-8 md:p-12 h-fit"
          >
            <h2 className="text-3xl font-black text-slate-900 mb-2">Get in Touch</h2>
            <p className="text-slate-500 mb-8 font-medium">Our B2B specialists will respond within 24 hours.</p>

            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900 font-medium" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Business Email</label>
                  <input type="email" placeholder="john@company.com" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-slate-900 font-medium" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Inquiry Type</label>
                <select defaultValue="" className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 appearance-none transition-all cursor-pointer text-slate-900 font-medium">
                  <option value="" disabled>Select a topic...</option>
                  <option value="dealer">Dealer Application Status</option>
                  <option value="bulk">Bulk Order Request</option>
                  <option value="support">Technical Support</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Message</label>
                <div className="relative">
                  <textarea
                    placeholder="How can we help your business grow?"
                    rows={4}
                    className="w-full px-5 py-4 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none text-slate-900 font-medium"
                  ></textarea>
                  <button
                    type="button"
                    className="absolute bottom-4 right-4 h-12 w-12 bg-sky-600 hover:bg-sky-700 text-white rounded-xl flex items-center justify-center shadow-lg shadow-sky-600/30 transition-all hover:scale-105"
                  >
                    <Send className="h-5 w-5 ml-1" />
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

        </div>
      </section>
    </div>
  );
}