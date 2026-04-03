"use client";

import { useState, useEffect } from 'react';
import { getPaginatedArticles, getTrendingArticles } from '@/api/public/articles';
import { Loader2, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BlogsPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const [articlesRes, trendingRes] = await Promise.all([
          getPaginatedArticles({ page, limit: 9 }),
          getTrendingArticles()
        ]);
        setArticles(articlesRes.data.data);
        setTotalPages(articlesRes.data.meta.totalPages);
        setTrending(trendingRes.data);
      } catch (error) {
        console.error("Failed to fetch blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [page]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-20">
      <div className="absolute inset-0 z-0 h-[60vh] w-full bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:linear-gradient(to_bottom,white,transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Industry Insights</h1>
          <p className="text-lg text-slate-600">Expert articles, news, and updates from the world of B2B manufacturing and distribution.</p>
        </div>

        {/* Trending Section */}
        {trending.length > 0 && page === 1 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-6 w-6 text-sky-500" />
              <h2 className="text-2xl font-bold text-slate-900">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trending.slice(0, 2).map((post, idx) => (
                <Link href={`/blogs/${post.slug}`} key={post.id}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} className="group relative rounded-3xl overflow-hidden aspect-[16/9] md:aspect-[21/9] shadow-md">
                    <img src={post.thumbnailUrl || '/logo.svg'} alt={post.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-8">
                      <span className="px-3 py-1 bg-sky-500 text-white text-xs font-bold rounded-full w-fit mb-3">{post.categoryName}</span>
                      <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
                      <div className="flex items-center gap-4 text-slate-300 text-sm font-medium">
                        <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>{post.viewCount} views</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Latest Articles Grid */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Latest Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((post, idx) => (
            <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-shadow flex flex-col group">
              <Link href={`/blogs/${post.slug}`} className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img src={post.thumbnailUrl || '/logo.svg'} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                  {post.categoryName}
                </div>
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-3">
                  <Calendar className="h-4 w-4" /> {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <Link href={`/blogs/${post.slug}`}>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 hover:text-sky-600 transition-colors line-clamp-2">{post.title}</h3>
                </Link>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500 font-medium">{post.viewCount} views</span>
                  <Link href={`/blogs/${post.slug}`} className="flex items-center gap-1 text-sm font-bold text-sky-600 hover:text-sky-700">
                    Read More <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-6 py-3 rounded-xl font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors">
              Previous
            </button>
            <span className="font-semibold text-slate-700">Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-6 py-3 rounded-xl font-medium border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors">
              Next
            </button>
          </div>
        )}

      </div>
    </div>
  );
}