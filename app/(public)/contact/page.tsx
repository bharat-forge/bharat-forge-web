"use client";

import React, { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { 
  ChevronRight, MapPin, Phone, Mail, Clock, Send, ShieldCheck, Building2
} from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { submitContactRequest } from '@/api/public/contactRequest';

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

// Map configuration for Bharat Forge HQ
const containerStyle = { width: '100%', height: '100%' };
const hqLocation = { lat: 18.5293, lng: 73.9042 }; // Mundhwa, Pune coordinates

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isMarkerOpen, setIsMarkerOpen] = useState(false);

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await submitContactRequest(formData);
      setIsSuccess(true);
      setFormData({ name: '', email: '', phone: '', company: '', inquiryType: '', message: '' });
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit your request. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen w-full font-sans selection:bg-sky-500 selection:text-white pb-0">
      
      <section className="pt-5 pb-12 lg:pt-5 lg:pb-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">
            <Link href="/" className="hover:text-sky-500 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <span className="text-sky-600">Contact Us</span>
          </div>

          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <motion.span variants={fadeUpVariant} className="text-sky-600 font-bold tracking-widest uppercase text-sm mb-4 block">
              Global Support Network
            </motion.span>
            <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 tracking-tight">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-700">Touch</span>
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-lg text-slate-600 font-medium">
              Whether you are looking to become an authorized dealer, place a bulk order, or need technical assistance with our components, our B2B specialists are ready to help.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
            
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-4 space-y-6"
            >
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/20 group hover:border-sky-200 transition-colors">
                <div className="h-14 w-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500 transition-colors">
                  <Phone className="h-6 w-6 text-sky-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Sales & Dealerships</h3>
                <p className="text-slate-500 font-medium mb-4">Dedicated line for bulk pricing and partnership inquiries.</p>
                <a href="tel:+912026824666" className="text-lg font-black text-sky-600 hover:text-sky-700">+91 20 2682 4666</a>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-xl shadow-slate-200/20 group hover:border-sky-200 transition-colors">
                <div className="h-14 w-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-sky-500 transition-colors">
                  <Mail className="h-6 w-6 text-sky-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Technical Support</h3>
                <p className="text-slate-500 font-medium mb-4">Assistance with technical specifications and warranty claims.</p>
                <a href="mailto:b2b@bharatforge.com" className="text-lg font-black text-sky-600 hover:text-sky-700">b2b@bharatforge.com</a>
              </div>

              <div className="bg-slate-900 p-8 rounded-[2rem] shadow-xl text-white">
                <h3 className="text-xl font-bold mb-6">Global Headquarters</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-6 w-6 text-sky-400 shrink-0 mt-1" />
                    <p className="text-slate-300 font-medium leading-relaxed">
                      Bharat Forge Limited<br />
                      Pune Cantonment<br />
                      Mundhwa, Pune 411036<br />
                      Maharashtra, India
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-700">
                    <Clock className="h-5 w-5 text-sky-400 shrink-0" />
                    <p className="text-slate-300 font-medium">Mon-Sat, 9:00 AM - 6:00 PM IST</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-2xl shadow-sky-900/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
              
              <h2 className="text-3xl font-black text-slate-900 mb-2 relative z-10">Send us a Message</h2>
              <p className="text-slate-500 font-medium mb-10 relative z-10">Our commercial team typically responds within 2 hours during business operations.</p>

              {isSuccess && (
                <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold relative z-10">
                  <ShieldCheck className="h-6 w-6" />
                  Your request has been successfully submitted. We will contact you shortly.
                </div>
              )}

              {error && (
                <div className="mb-8 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 font-bold relative z-10">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Business Email <span className="text-rose-500">*</span></label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Company Name</label>
                    <input 
                      type="text" 
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Global Logistics Ltd." 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Inquiry Type <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <select 
                      name="inquiryType"
                      required
                      value={formData.inquiryType}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900 appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select the nature of your inquiry...</option>
                      <option value="Dealership Application">Dealership Application</option>
                      <option value="Bulk Order Request">Bulk Order Request</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Logistics & Tracking">Logistics & Tracking</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Message <span className="text-rose-500">*</span></label>
                  <textarea 
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Please provide details about your requirements or issues..." 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium text-slate-900 resize-none" 
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-10 py-4 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/30 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending Request...' : 'Submit Request'} 
                  {!isSubmitting && <Send className="h-5 w-5" />}
                </button>
              </form>
            </motion.div>

          </div>
        </div>
      </section>

      {/* HQ Map Section */}
      <section className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900 mb-2">Visit Our Headquarters</h2>
              <p className="text-slate-500 font-medium">Located in the industrial heart of Pune, Maharashtra.</p>
            </div>
            <a 
              href="https://www.google.com/maps/dir/?api=1&destination=18.5293,73.9042" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md flex items-center gap-2 shrink-0"
            >
              <MapPin className="w-4 h-4" /> Get Directions
            </a>
          </div>

          <div className="h-[450px] w-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40 relative z-10">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={hqLocation}
                zoom={14}
                options={{ 
                  disableDefaultUI: false, 
                  zoomControl: true,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: true
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
                    scale: 12,
                  }}
                >
                  {isMarkerOpen && (
                    <InfoWindow onCloseClick={() => setIsMarkerOpen(false)}>
                      <div className="p-3 max-w-[250px]">
                        <h3 className="font-black text-slate-900 mb-1 text-base">Bharat Forge Limited</h3>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                          Pune Cantonment, Mundhwa<br />
                          Pune 411036, Maharashtra, India
                        </p>
                        <a 
                          href="https://www.google.com/maps/dir/?api=1&destination=18.5293,73.9042" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="bg-sky-500 text-white px-4 py-2 rounded-lg text-xs font-bold block text-center hover:bg-sky-600 transition-colors"
                        >
                          Navigate Here
                        </a>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              </GoogleMap>
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                <div className="animate-spin w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-10">Our Global Distribution Network</h2>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            {['Pune, IND', 'Frankfurt, GER', 'Detroit, USA', 'Tokyo, JPN', 'Dubai, UAE'].map((city, idx) => (
              <div key={idx} className="flex items-center gap-3 text-slate-600 font-bold">
                <Building2 className="h-5 w-5 text-sky-500" />
                {city}
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}