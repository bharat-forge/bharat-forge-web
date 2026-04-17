"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { getArticleBySlug, getPaginatedArticles, getTrendingArticles } from '@/api/public/articles';
import { castArticleVote, addArticleComment } from '@/api/user/articleInteractions';
import { Loader2, Calendar, Eye, ThumbsUp, ThumbsDown, MessageSquare, Send, User, ChevronLeft, BookOpen, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [data, setData] = useState<any>(null);
  const [relatedArticles, setRelatedArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [interacting, setInteracting] = useState(false);

  const fetchArticleAndRelated = async () => {
    try {
      // 1. Fetch main article
      const res = await getArticleBySlug(slug as string);
      setData(res.data);
      
      const currentArticle = res.data.article;

      // 2. Smart fetch for related articles
      // Using the first meaningful word of the title to find similar context, 
      // alongside trending articles as a fallback to guarantee a full grid.
      const searchKeyword = currentArticle.title.split(' ').find((w: string) => w.length > 3) || '';
      
      const [searchRes, trendRes] = await Promise.all([
        getPaginatedArticles({ search: searchKeyword, limit: 5 }),
        getTrendingArticles()
      ]);
      
      // Combine results, filter out the currently viewed article, and remove duplicates
      const combined = [...(searchRes.data?.data || []), ...(trendRes.data || [])];
      const uniqueRelated = Array.from(
        new Map(
          combined
            .filter(a => a.id !== currentArticle.id)
            .map(item => [item.id, item])
        ).values()
      );
      
      // Keep only the top 3 best matches
      setRelatedArticles(uniqueRelated.slice(0, 3));

    } catch (error) {
      console.error("Failed to load article or related content", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetchArticleAndRelated();
    }
  }, [slug]);

  const handleVote = async (voteType: 'LIKE' | 'DISLIKE') => {
    if (!isAuthenticated) return router.push('/login');
    setInteracting(true);
    try {
      await castArticleVote({ articleId: data.article.id, voteType });
      // Refresh just the main article to update counts
      const res = await getArticleBySlug(slug as string);
      setData(res.data);
    } catch (err) {
      console.error("Vote failed");
    } finally {
      setInteracting(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return router.push('/login');
    if (!commentText.trim()) return;
    
    setInteracting(true);
    try {
      await addArticleComment({ articleId: data.article.id, comment: commentText });
      setCommentText('');
      const res = await getArticleBySlug(slug as string);
      setData(res.data);
    } catch (err) {
      console.error("Comment failed");
    } finally {
      setInteracting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>;
  if (!data?.article) return <div className="min-h-screen flex items-center justify-center bg-white text-xl font-bold text-slate-700">Article not found.</div>;

  const { article, comments } = data;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* HEADER HERO SECTION */}
      <div className="relative h-[45vh] w-full bg-slate-900 overflow-hidden">
        <img 
          src={article.thumbnailUrl || '/logo.svg'} 
          alt={article.title} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 blur-[2px]" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/80 to-slate-50/50" />
        
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-4xl mx-auto px-6 w-full mb-12">
            <Link href="/blogs" className="inline-flex items-center text-sky-400 text-sm font-bold mb-6 hover:text-sky-300 transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
              <ChevronLeft className="h-4 w-4 mr-1" /> BACK TO INSIGHTS
            </Link>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-200 text-sm font-semibold">
                <span className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                   <Calendar className="h-4 w-4 text-sky-400" /> 
                   {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                   <Eye className="h-4 w-4 text-sky-400" /> {article.viewsCount?.toLocaleString()} views
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 -mt-24">
        {/* ARTICLE BODY */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-14 mb-10"
        >
          <article className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-img:rounded-2xl">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>

          <div className="mt-16 pt-10 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
               <div className="h-12 w-12 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100">
                  <User className="h-6 w-6 text-sky-500" />
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Published By</p>
                  <p className="text-base font-black text-slate-900">{article.authorEmail?.split('@')[0]}</p>
               </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 shadow-inner">
               <button 
                onClick={() => handleVote('LIKE')} 
                disabled={interacting}
                className="flex items-center gap-2 px-5 py-3 rounded-xl hover:bg-white hover:text-sky-600 hover:shadow-sm text-slate-500 font-bold text-sm transition-all disabled:opacity-50"
               >
                 <ThumbsUp className={`h-4 w-4 ${interacting ? 'animate-pulse' : ''}`} /> {article.likesCount || 0}
               </button>
               <div className="w-[1px] h-8 bg-slate-200" />
               <button 
                onClick={() => handleVote('DISLIKE')} 
                disabled={interacting}
                className="flex items-center gap-2 px-5 py-3 rounded-xl hover:bg-white hover:text-rose-600 hover:shadow-sm text-slate-500 font-bold text-sm transition-all disabled:opacity-50"
               >
                 <ThumbsDown className="h-4 w-4" /> {article.dislikesCount || 0}
               </button>
            </div>
          </div>
        </motion.div>

        {/* COMMENTS SECTION */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="h-10 w-10 bg-sky-50 rounded-xl flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-sky-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Community Discussion</h3>
            <span className="text-sm font-bold bg-slate-200 text-slate-700 px-3 py-1 rounded-lg ml-2">
              {comments?.length || 0}
            </span>
          </div>

          <form onSubmit={handleCommentSubmit} className="mb-12 group">
            <div className="relative bg-white rounded-3xl border border-slate-200 p-3 focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/10 transition-all shadow-sm">
              <textarea
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={isAuthenticated ? "Share your professional insight on this topic..." : "Sign in to join the conversation"}
                disabled={!isAuthenticated || interacting}
                className="w-full px-4 py-3 bg-transparent outline-none resize-none text-base text-slate-700 font-medium min-h-[100px]"
              />
              <div className="flex justify-end p-2 border-t border-slate-50 mt-2">
                <button 
                  type="submit" 
                  disabled={!isAuthenticated || interacting || !commentText.trim()} 
                  className="flex items-center gap-2 px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-sky-600 disabled:opacity-50 transition-all shadow-md"
                >
                  {interacting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  POST COMMENT
                </button>
              </div>
            </div>
          </form>

          <div className="space-y-4">
            {comments && comments.length > 0 ? (
              comments.map((c: any) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  key={c.id} 
                  className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center text-sm font-black border border-slate-200">
                        {c.userEmail?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-base font-bold text-slate-900">{c.userEmail?.split('@')[0]}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-base text-slate-600 leading-relaxed pl-12 font-medium">{c.comment}</p>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 shadow-sm border-dashed">
                <p className="text-base font-bold text-slate-400">No comments yet. Start the conversation.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RELATED ARTICLES SECTION */}
      {relatedArticles.length > 0 && (
        <div className="w-full bg-slate-100/50 border-t border-slate-200 pt-20 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-sky-500" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Recommended Reading</h3>
              </div>
              <Link href="/blogs" className="hidden sm:flex items-center gap-2 text-sm font-bold text-sky-600 hover:text-sky-700 bg-white px-5 py-2.5 rounded-full border border-sky-100 shadow-sm hover:shadow transition-all">
                View All Insights <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((post, idx) => (
                <motion.div 
                  key={post.id} 
                  initial={{ opacity: 0, y: 20 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }} 
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col group"
                >
                  <Link href={`/blogs/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img src={post.thumbnailUrl || '/logo.svg'} alt={post.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                    {post.categoryName && (
                      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black text-white tracking-widest uppercase shadow-sm">
                        {post.categoryName}
                      </div>
                    )}
                  </Link>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest">
                      <Calendar className="h-4 w-4" /> {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <Link href={`/blogs/${post.slug}`}>
                      <h3 className="text-xl font-black text-slate-900 mb-4 hover:text-sky-600 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                    </Link>
                    <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                      <span className="text-sm text-slate-500 font-bold bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-sky-500" /> {post.viewCount || 0}
                      </span>
                      <Link href={`/blogs/${post.slug}`} className="flex items-center gap-1.5 text-sm font-black text-slate-900 hover:text-sky-600 transition-colors">
                        Read Article <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}