"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, Plus, Search, Trash2, Edit, 
  ChevronRight, ChevronLeft, CheckCircle2, AlertCircle, Eye
} from 'lucide-react';
import { getPaginatedFaqsAdmin, createFaq, updateFaq, deleteFaq, getUniqueCategories } from '@/api/admin/faqManagement';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<Partial<FAQ>>({ question: '', answer: '', category: '', isActive: true });
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchFaqs();
    fetchCategories();
  }, [page, search]);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const res = await getPaginatedFaqsAdmin({ page, limit: 10, search });
      setFaqs(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getUniqueCategories();
      setExistingCategories(res.data);
    } catch (error) {
      console.error(error);
      setExistingCategories(['General', 'Dealership', 'Products & Tech', 'Shipping & Logistics', 'Returns & Support']);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentFaq.id) {
        await updateFaq(currentFaq.id, currentFaq);
      } else {
        await createFaq(currentFaq);
      }
      setIsModalOpen(false);
      setCurrentFaq({ question: '', answer: '', category: '', isActive: true });
      fetchFaqs();
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await deleteFaq(id);
      fetchFaqs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
            <HelpCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">FAQ Management</h1>
            <p className="text-slate-500 font-medium">Manage Knowledge Base & Questions</p>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentFaq({ question: '', answer: '', category: '', isActive: true });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" /> Add FAQ
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-6">Question</th>
                <th className="p-6">Category</th>
                <th className="p-6">Views</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={5} className="p-12 text-center text-slate-400">Loading...</td></tr>
              ) : faqs.length === 0 ? (
                <tr><td colSpan={5} className="p-16 text-center text-slate-400">No FAQs found</td></tr>
              ) : (
                faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-slate-900 line-clamp-1">{faq.question}</p>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                        {faq.category}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className="text-slate-600 font-mono font-bold flex items-center gap-1.5">
                        <Eye className="w-4 h-4 text-slate-400" /> {faq.viewCount}
                      </span>
                    </td>
                    <td className="p-6">
                      {faq.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-lg border border-rose-100">
                          Hidden
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setCurrentFaq(faq);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors">
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors">
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-sky-500" />
                  {currentFaq.id ? 'Edit FAQ' : 'Add New FAQ'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form id="faq-form" onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Question</label>
                      <input
                        type="text"
                        required
                        value={currentFaq.question}
                        onChange={e => setCurrentFaq({...currentFaq, question: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                      <input
                        type="text"
                        required
                        list="category-options"
                        placeholder="Select or type new category..."
                        value={currentFaq.category}
                        onChange={e => setCurrentFaq({...currentFaq, category: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
                      />
                      <datalist id="category-options">
                        {existingCategories.map((cat) => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Visibility Status</label>
                      <select
                        value={currentFaq.isActive ? 'true' : 'false'}
                        onChange={e => setCurrentFaq({...currentFaq, isActive: e.target.value === 'true'})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium cursor-pointer"
                      >
                        <option value="true">Active / Visible</option>
                        <option value="false">Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Answer (Markdown Supported)
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={currentFaq.answer}
                      onChange={e => setCurrentFaq({...currentFaq, answer: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono text-sm leading-relaxed"
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-3xl">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" form="faq-form" className="px-6 py-2.5 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors shadow-lg shadow-sky-600/30">
                  Save FAQ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}