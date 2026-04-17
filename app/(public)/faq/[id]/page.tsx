"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  ChevronRight, ChevronLeft, Eye, HelpCircle, 
  ArrowRight, Mail, BookOpen
} from 'lucide-react';
import { getFaqById, getRelatedFaqs } from '@/api/public/faq';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SingleFaqPage() {
  const params = useParams();
  const router = useRouter();
  const [faq, setFaq] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchFaqData();
    }
  }, [params.id]);

  const fetchFaqData = async () => {
    setIsLoading(true);
    try {
      const res = await getFaqById(params.id as string);
      setFaq(res.data);
      
      const relatedRes = await getRelatedFaqs(params.id as string, res.data.category);
      setRelated(relatedRes.data);
    } catch (error) {
      console.error(error);
      router.push('/faq');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 px-4 flex justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
          <div className="h-8 w-64 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen w-full font-sans selection:bg-sky-500 selection:text-white pb-20">
      
      <div className="pt-28 pb-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
          <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-sky-500 transition-colors">
            <ChevronLeft size={14} /> Back
          </button>
          <span className="text-slate-300">|</span>
          <Link href="/faq" className="hover:text-sky-500 transition-colors">Knowledge Base</Link>
          <ChevronRight size={14} className="text-slate-300" />
          <span className="text-sky-600">{faq?.category}</span>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-slate-200/40 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <BookOpen className="w-48 h-48" />
          </div>

          <div className="flex items-center gap-4 mb-6 relative z-10">
            <span className="px-4 py-1.5 bg-sky-50 text-sky-600 font-bold text-xs uppercase tracking-wider rounded-lg border border-sky-100">
              {faq?.category}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-slate-400 font-medium">
              <Eye className="w-4 h-4" /> {faq?.viewCount} views
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 leading-tight relative z-10">
            {faq?.question}
          </h1>

          <div className="prose prose-slate prose-lg max-w-none prose-headings:text-slate-900 prose-a:text-sky-600 prose-p:font-medium prose-p:text-slate-600 relative z-10">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {faq?.answer}
            </ReactMarkdown>
          </div>

          <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
            <p className="text-sm font-bold text-slate-500">Was this answer helpful?</p>
            <div className="flex gap-4">
              <Link href="/contact" className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
                <Mail className="w-4 h-4" /> Contact Support
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-sky-500" />
            <h2 className="text-2xl font-black text-slate-900">Related Questions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {related.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link 
                  href={`/faq/${item.id}`}
                  className="block bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all group h-full"
                >
                  <h3 className="font-bold text-slate-900 group-hover:text-sky-600 transition-colors mb-4 line-clamp-2">
                    {item.question}
                  </h3>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.category}</span>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}