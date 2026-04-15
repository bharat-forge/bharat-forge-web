"use client";

import { useState, useEffect } from 'react';
import { Lock, FileText, Clock, ArrowLeft } from 'lucide-react';
import { getActivePolicy } from '@/api/public/privacy';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Link from 'next/link';

interface Policy {
  id: string;
  version: string;
  title: string;
  content: string;
  updatedAt: string;
}

export default function PrivacyPage() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivePolicy();
  }, []);

  const fetchActivePolicy = async () => {
    try {
      const res = await getActivePolicy();
      setPolicy(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Lock className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Policy Not Available</h1>
        <p className="text-slate-500">Privacy documents are currently being updated.</p>
        <Link href="/" className="mt-6 text-sky-600 font-bold hover:underline inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="bg-slate-900 px-8 py-12 text-center border-b-4 border-sky-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-400 via-transparent to-transparent"></div>
            
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                <FileText className="w-8 h-8 text-sky-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                {policy.title}
              </h1>
              
              <div className="flex items-center justify-center gap-6 text-sm font-medium text-slate-300">
                <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Lock className="w-4 h-4 text-sky-400" /> Version {policy.version}
                </span>
                <span className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-sky-400" /> Last Updated: {new Date(policy.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 bg-white">
            <div className="prose prose-slate prose-lg max-w-none 
              prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 
              prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-4 prose-h2:mt-10
              prose-p:text-slate-600 prose-p:leading-relaxed
              prose-a:text-sky-600 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-li:text-slate-600 prose-li:marker:text-sky-500
              prose-strong:text-slate-900">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {policy.content}
              </ReactMarkdown>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}