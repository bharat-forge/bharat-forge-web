"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, FileText, Plus, Search, 
  Trash2, CheckCircle2, AlertCircle, Edit, 
  ChevronRight, ChevronLeft, Eye, Clock
} from 'lucide-react';
import { getPaginatedTerms, createTerm, updateTerm, activateTerm, deleteTerm } from '@/api/admin/terms';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Term {
  id: string;
  version: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTermsPage() {
  const [terms, setTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentTerm, setCurrentTerm] = useState<Partial<Term>>({ version: '', title: '', content: '' });
  const [activePreviewTerm, setActivePreviewTerm] = useState<Term | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTerms();
  }, [page, search]);

  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const res = await getPaginatedTerms({ page, limit: 10, search });
      setTerms(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentTerm.id) {
        await updateTerm(currentTerm.id, currentTerm);
      } else {
        await createTerm(currentTerm);
      }
      setIsModalOpen(false);
      setCurrentTerm({ version: '', title: '', content: '' });
      fetchTerms();
    } catch (error) {
      console.error(error);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await activateTerm(id);
      fetchTerms();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this version?')) return;
    try {
      await deleteTerm(id);
      fetchTerms();
    } catch (error) {
      alert('Cannot delete active term');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Terms & Conditions</h1>
            <p className="text-slate-500 font-medium">Manage legal document versions</p>
          </div>
        </div>
        <button
          onClick={() => {
            setCurrentTerm({ version: '', title: '', content: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-5 h-5" /> New Version
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by version or title..."
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
                <th className="p-6">Version</th>
                <th className="p-6">Title</th>
                <th className="p-6">Status</th>
                <th className="p-6">Created</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">
                    Loading...
                  </td>
                </tr>
              ) : terms.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-400">
                    <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-bold text-lg">No versions found</p>
                  </td>
                </tr>
              ) : (
                terms.map((term) => (
                  <tr key={term.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 font-mono text-sm font-bold rounded-lg border border-slate-200">
                        {term.version}
                      </span>
                    </td>
                    <td className="p-6">
                      <p className="font-bold text-slate-900">{term.title}</p>
                    </td>
                    <td className="p-6">
                      {term.isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                          <Clock className="w-3.5 h-3.5" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-sm text-slate-500 font-medium">
                      {new Date(term.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setActivePreviewTerm(term);
                            setIsPreviewOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {!term.isActive && (
                          <>
                            <button
                              onClick={() => handleActivate(term.id)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Set as Active"
                            >
                              <CheckCircle2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => {
                                setCurrentTerm(term);
                                setIsModalOpen(true);
                              }}
                              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(term.id)}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </>
                        )}
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
            <p className="text-sm font-medium text-slate-500">
              Showing page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
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
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-t-3xl">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-sky-500" />
                  {currentTerm.id ? 'Edit Version' : 'New Terms Version'}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                <form id="term-form" onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Version Number</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. v2.1.0"
                        value={currentTerm.version}
                        onChange={e => setCurrentTerm({...currentTerm, version: e.target.value})}
                        disabled={!!currentTerm.id}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-mono disabled:opacity-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Document Title</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Global Wholesale Terms"
                        value={currentTerm.title}
                        onChange={e => setCurrentTerm({...currentTerm, title: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center justify-between">
                      Markdown Content
                      <span className="text-xs font-normal text-slate-400">Supports standard markdown formatting</span>
                    </label>
                    <textarea
                      required
                      rows={15}
                      value={currentTerm.content}
                      onChange={e => setCurrentTerm({...currentTerm, content: e.target.value})}
                      className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all font-mono text-sm leading-relaxed"
                    />
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-3xl">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="term-form"
                  className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Save Version
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isPreviewOpen && activePreviewTerm && (
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
              className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{activePreviewTerm.title}</h2>
                  <p className="text-sm font-mono text-slate-500 mt-1">Version: {activePreviewTerm.version}</p>
                </div>
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-white">
                <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-a:text-sky-600">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {activePreviewTerm.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}