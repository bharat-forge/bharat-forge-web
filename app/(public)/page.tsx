"use client";

import { motion } from 'framer-motion';
import { Settings, Battery, ShieldCheck, Truck, ArrowRight, Plus, Minus, Send } from 'lucide-react';
import { useState } from 'react';

const categories = [
  {
    title: 'Premium Tyres',
    desc: 'High-durability tyres for passenger vehicles, SUVs, and commercial trucks.',
    icon: Settings,
  },
  {
    title: 'Automotive Batteries',
    desc: 'Reliable lead-acid and advanced Li-ion batteries for modern vehicles.',
    icon: Battery,
  },
  {
    title: 'Quality Assurance',
    desc: 'All imports meet stringent BIS, ISO, and DOT certification standards.',
    icon: ShieldCheck,
  },
  {
    title: 'Bulk Logistics',
    desc: 'Streamlined nationwide delivery and inventory management for dealers.',
    icon: Truck,
  },
];

const faqs = [
  {
    q: "What is the minimum order quantity (MOQ) for dealers?",
    a: "Our standard MOQ varies by product category. For passenger tyres, the MOQ is typically 50 units. For commercial batteries, it is 20 units. Registered dealers can view tier-specific MOQs in their dashboard."
  },
  {
    q: "How do I become an authorized Bharat Forge dealer?",
    a: "You can apply through our Partner With Us page. We require a valid GSTIN, business registration details, and a physical store location for verification."
  },
  {
    q: "What certifications do your products carry?",
    a: "All our imported products are fully compliant with Indian regulations, including BIS certification. International products also carry DOT and ISO certifications where applicable."
  }
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="bg-[#f8fafc] w-full">
      <section className="relative pt-20 pb-32 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e0f2fe_1px,transparent_1px),linear-gradient(to_bottom,#e0f2fe_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sky-500 font-semibold tracking-wider uppercase text-sm mb-4 block">
              Premium Importers & Distributors
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              Engineered for <span className="text-sky-500">Performance.</span><br />
              Built for India.
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-10">
              Leading the supply chain for world-class automotive tyres and advanced battery systems. Partner with us for unparalleled B2B wholesale pricing and reliable inventory.
            </p>
            <div className="flex justify-center gap-4">
              <button className="bg-sky-500 text-white px-8 py-4 rounded-full font-medium hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/30 flex items-center gap-2">
                Become a Dealer <ArrowRight className="h-4 w-4" />
              </button>
              <button className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full font-medium hover:border-sky-200 hover:bg-sky-50 transition-all">
                Explore Catalog
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-gray-500 text-sm font-medium uppercase tracking-widest">What we excel at</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2">Core Categories</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="h-14 w-14 bg-sky-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-sky-500 transition-colors">
                <item.icon className="h-7 w-7 text-sky-500 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              Partner <span className="text-sky-500">FAQ</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx} 
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === idx ? 'border-sky-200 bg-sky-50/50' : 'border-gray-100 bg-white'}`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-gray-900">{faq.q}</span>
                    <span className={`flex-shrink-0 ml-4 h-8 w-8 rounded-full flex items-center justify-center border ${openFaq === idx ? 'border-sky-500 text-sky-500' : 'border-gray-300 text-gray-500'}`}>
                      {openFaq === idx ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === idx ? 'auto' : 0, opacity: openFaq === idx ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                        <p className="px-6 pb-6 text-gray-600 leading-relaxed text-sm">
                      {faq.a}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-xl shadow-gray-200/40 rounded-3xl p-8 lg:p-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Ask <span className="text-sky-500">Question</span>
            </h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input 
                  type="text" 
                  placeholder="Your name" 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
                <input 
                  type="email" 
                  placeholder="Your e-mail" 
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
              </div>
              
              <div className="relative">
                <select defaultValue="" className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 appearance-none text-gray-600 transition-all cursor-pointer">
                  <option value="" disabled>Choose inquiry type...</option>
                  <option value="dealer">Dealer Application</option>
                  <option value="bulk">Bulk Order Quote</option>
                  <option value="support">General Support</option>
                </select>
              </div>

              <div className="relative">
                <textarea 
                  placeholder="Your Question" 
                  rows={5}
                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all resize-none"
                ></textarea>
                <button 
                  type="button"
                  className="absolute bottom-4 right-4 h-12 w-12 bg-sky-500 hover:bg-sky-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  <Send className="h-5 w-5 ml-1" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}