"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ChevronRight, Shield, Target, Settings, Plus, Minus, PhoneCall,
  Globe2, Trophy, Users, Building2, Leaf, Activity, ArrowRight,
  Quote, Star, CheckCircle2, Award, Truck
} from 'lucide-react';

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const fadeLeftVariant: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const fadeRightVariant: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// Array of images for the animated hero box
const heroImages = [
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=1200",
  "https://etimg.etb2bimg.com/thumb/msid-117038737,width-1200,height-900,resizemode-4/.jpg?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=1200"
];

const statsData = [
  { icon: Building2, value: '25+', label: 'Years of Excellence', suffix: '' },
  { icon: Users, value: '10,000', label: 'B2B Partners Globally', suffix: '+' },
  { icon: Globe2, value: '45', label: 'Countries Served', suffix: '+' },
  { icon: Trophy, value: '150', label: 'Industry Awards', suffix: '+' }
];

const timelineData = [
  { year: '1998', title: 'Foundation', desc: 'Established as a specialized metallurgical engineering hub in Pune, India.' },
  { year: '2005', title: 'Global Expansion', desc: 'Opened first international distribution center and partnered with global automotive brands.' },
  { year: '2012', title: 'Digital Integration', desc: 'Launched first-generation B2B portal for seamless inventory management.' },
  { year: '2018', title: 'Advanced Facilities', desc: 'Inaugurated state-of-the-art automated forging and testing facilities.' },
  { year: '2023', title: 'Sustainability Initiative', desc: 'Achieved 100% carbon-neutral manufacturing processes across core plants.' },
  { year: '2026', title: 'Modern Ecosystem', desc: 'Redefining automotive wholesale with predictive analytics and just-in-time delivery.' }
];

const valuesData = [
  { icon: Target, title: 'Precision Engineering', desc: 'Every component is manufactured to exact microscopic tolerances, ensuring flawless performance under extreme industrial conditions.' },
  { icon: Shield, title: 'Uncompromising Quality', desc: 'Rigorous multi-stage quality assurance protocols guarantee that only the finest products reach our distribution network.' },
  { icon: Users, title: 'Partner Centricity', desc: 'Our growth is inextricably linked to our dealers. We build long-term relationships based on transparency and mutual success.' },
  { icon: Leaf, title: 'Sustainable Practices', desc: 'Committed to reducing our environmental footprint through eco-friendly manufacturing and responsible resource management.' },
];

const capabilitiesData = [
  { title: 'Custom Die Forging', desc: 'High-pressure precision forging for complex geometries.' },
  { title: 'CNC Machining', desc: 'Automated multiaxis machining for exact specifications.' },
  { title: 'Thermal Treatments', desc: 'Advanced tempering and hardening processes.' },
  { title: 'Automotive Batteries', desc: 'High-capacity, maintenance-free power storage.' },
  { title: 'Commercial Tyres', desc: 'Heavy-duty tread designs for maximum durability.' },
  { title: 'Supply Chain Logistics', desc: 'Global warehousing and just-in-time fulfillment.' },
];

const teamData = [
  { name: 'Rajiv Mehra', role: 'Chief Executive Officer', desc: 'Visionary leader with 25 years shaping the industrial sector.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600&h=800' },
  { name: 'Sarah Thomas', role: 'Head of Global Supply', desc: 'Mastermind behind our robust international logistics network.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600&h=800' },
  { name: 'Vikram Singh', role: 'Chief Engineering Officer', desc: 'Pioneer in advanced metallurgical treatments and die forging.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600&h=800' },
  { name: 'Anita Desai', role: 'VP of B2B Relations', desc: 'Dedicated to fostering growth and trust with our dealer network.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600&h=800' }
];

const testimonialsData = [
  { quote: "The integration with their digital portal revolutionized our stock management. We reduced stockouts by 85% in the first quarter alone.", author: "Arun Jaitley", company: "Metro Auto Spares", rating: 5 },
  { quote: "Unparalleled metallurgical quality. The custom forged components we source from them have drastically improved our machinery lifespan.", author: "Samantha Croft", company: "BuildRight Heavy Industries", rating: 5 },
  { quote: "Their global sourcing network means we get premium commercial tyres at prices that allow us to dominate our local market.", author: "Rishabh Pant", company: "Express Transport Ltd", rating: 5 },
];

const partnersData = [
  "GLOBAL STEEL CORP", "NEXA AUTOMOTIVE", "TITAN MACHINERY", 
  "APEX LOGISTICS", "QUANTUM METALS", "HORIZON TRANSPORT"
];

const certificationsData = [
  { title: "ISO 9001:2015", desc: "Quality Management Systems" },
  { title: "IATF 16949", desc: "Automotive Quality Standards" },
  { title: "ISO 14001:2015", desc: "Environmental Management" },
  { title: "BIS Certified", desc: "Bureau of Indian Standards" }
];

export default function AboutPage() {
  const [openCapability, setOpenCapability] = useState<number | null>(0);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Interval for changing hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImgIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // changes every 4 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen w-full font-sans selection:bg-sky-500 selection:text-white pb-0 pt-20 overflow-hidden">
      
      <div className="pt-5 pb-5 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-sky-600">About Us</span>
        </div>
      </div>

      <section className="py-5 lg:py-5 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeLeftVariant}
              className="order-2 lg:order-1 relative"
            >
              <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-sky-900/10 border border-slate-100 bg-slate-900">
                {/* Animated Image Carousel */}
                <AnimatePresence>
                  <motion.div
                    key={currentImgIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image 
                      src={heroImages[currentImgIndex]} 
                      alt={`Industrial Facility ${currentImgIndex + 1}`} 
                      fill 
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={currentImgIndex === 0}
                      className="object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl z-10">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 bg-sky-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-500/30">
                      <Settings className="h-8 w-8 text-white animate-[spin_10s_linear_infinite]" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-xl">Advanced Manufacturing</h4>
                      <p className="text-sky-100 text-sm">State-of-the-art facilities across 3 continents.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="order-1 lg:order-2"
            >
              <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-600 font-bold text-xs tracking-widest uppercase mb-8">
                <span className="h-2 w-2 rounded-full bg-sky-500 animate-pulse"></span>
                Excellence Has Been Our Hallmark
              </motion.div>
              
              <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">History</span> of Our Company
              </motion.h1>
              
              <motion.div variants={fadeUpVariant} className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                <p>
                  Founded with a vision to revolutionize the industrial supply chain, Bharat Forge began as a specialized engineering hub. Over the past decades, we have aggressively expanded our technological footprint, moving into state-of-the-art facilities to meet the growing demands of the modern B2B ecosystem.
                </p>
                <p>
                  Today, guided by our core values of precision and reliability, we have grown into one of the largest importers and distributors of premium forged components, automotive batteries, and commercial tyres.
                </p>
              </motion.div>

              <motion.div variants={fadeUpVariant} className="mt-10 flex flex-wrap gap-4">
                <Link href="#timeline" className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-sky-600 transition-colors flex items-center gap-2">
                  View Timeline <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {statsData.map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5, type: "spring" }}
                className="flex flex-col items-center text-center group"
              >
                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500 group-hover:-translate-y-2 transition-all duration-300 shadow-sm">
                  <stat.icon className="h-8 w-8 text-sky-500 group-hover:text-white transition-colors" />
                </div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{stat.value}</span>
                  <span className="text-2xl font-bold text-sky-500">{stat.suffix}</span>
                </div>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-900 mb-6"
            >
              Our Core <span className="text-sky-500">Values</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valuesData.map((val, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group"
              >
                <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500 transition-all duration-500">
                  <val.icon className="h-8 w-8 text-sky-500 group-hover:text-white transition-all duration-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{val.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="timeline" className="py-32 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">The Journey So Far</h2>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-slate-100 rounded-full"></div>
            
            <div className="space-y-16">
              {timelineData.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex items-center justify-between w-full ${idx % 2 === 0 ? 'flex-row-reverse' : ''}`}
                >
                  <div className="hidden md:block w-[45%]"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-sky-500 rounded-full shadow-lg z-10"></div>
                  
                  <div className={`w-full md:w-[45%] ${idx % 2 === 0 ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right text-left pl-12 md:pl-0'}`}>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group overflow-hidden">
                      <span className="text-5xl font-black text-slate-200 absolute right-6 top-6 opacity-50">{item.year}</span>
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 relative z-10">{item.title}</h3>
                      <p className="text-slate-600 font-medium leading-relaxed relative z-10">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.span variants={fadeLeftVariant} className="text-sky-400 font-bold tracking-widest uppercase text-sm mb-4 block">Infrastructure</motion.span>
              <motion.h2 variants={fadeLeftVariant} className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                Industrial Engineering <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">Capabilities</span>
              </motion.h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                {capabilitiesData.map((cap, idx) => (
                  <motion.div key={idx} variants={fadeLeftVariant} className="flex gap-4 group">
                    <div className="mt-1 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sky-500 transition-colors">
                      <CheckCircle2 className="h-4 w-4 text-sky-400 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">{cap.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{cap.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRightVariant}>
              <div className="space-y-4">
                {[
                  { title: 'Company Mission', content: 'To deliver the most professional and reliable manufacturing supply chain available by way of an unmatched client experience, resulting in the highest levels of industrial efficiency and a rewarding environment for our partners to succeed.' },
                  { title: 'Company Vision', content: 'To be the apex platform connecting global B2B manufacturing ecosystems with the Indian market, setting new standards in metallurgical quality, digital transparency, and logistical speed.' },
                  { title: 'Corporate Responsibility', content: 'We hold ourselves accountable to the highest ethical and environmental standards, ensuring our growth positively impacts the communities and ecosystems in which we operate.' }
                ].map((item, idx) => (
                  <div 
                    key={idx}
                    className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openCapability === idx ? 'border-sky-500/50 bg-sky-900/40' : 'border-white/10 bg-white/5'}`}
                  >
                    <button
                      onClick={() => setOpenCapability(openCapability === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <span className="font-bold text-white text-lg">{item.title}</span>
                      <span className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${openCapability === idx ? 'border-sky-500 bg-sky-500 text-white' : 'border-white/20 text-slate-400'}`}>
                        {openCapability === idx ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    <AnimatePresence>
                      {openCapability === idx && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="px-6 pb-6 text-slate-300 font-medium leading-relaxed">{item.content}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 border-b border-slate-100 bg-white overflow-hidden flex flex-col items-center">
        <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-widest mb-10">Trusted Supply Chain Partners</p>
        <div className="flex gap-16 md:gap-24 w-[200%] sm:w-[150%] md:w-full overflow-hidden relative">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
            className="flex gap-16 md:gap-24 whitespace-nowrap items-center w-full"
          >
            {[...partnersData, ...partnersData].map((partner, idx) => (
              <span key={idx} className="text-2xl md:text-3xl font-black text-slate-200 uppercase tracking-tighter hover:text-sky-500 transition-colors">
                {partner}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <span className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4 block">The People Behind The Metal</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Engineering & Leadership</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40 hover:-translate-y-3 transition-all duration-500 group"
              >
                <div className="relative h-72 overflow-hidden bg-slate-100">
                  <Image 
                    src={member.img} 
                    alt={member.name} 
                    fill 
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-black text-slate-900 mb-1">{member.name}</h3>
                  <h4 className="text-sm font-bold text-sky-600 mb-4 tracking-wide">{member.role}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Client Experiences</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="bg-slate-50 p-10 rounded-3xl border border-slate-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500"
              >
                <Quote className="absolute top-10 right-10 h-12 w-12 text-slate-200 group-hover:text-sky-100 transition-colors" />
                <div className="flex gap-1 mb-6">
                  {[...Array(test.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-700 text-lg leading-relaxed mb-10 font-medium relative z-10">"{test.quote}"</p>
                <div className="flex items-center gap-4 border-t border-slate-200 pt-6 mt-auto">
                  <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center text-sky-600 font-black text-xl">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{test.author}</h4>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{test.company}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}