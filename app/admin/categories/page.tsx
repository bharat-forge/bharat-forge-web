"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Edit2, Trash2, Code, Package, Image as ImageIcon, ChevronLeft, ChevronRight, X, AlertCircle, RefreshCw } from 'lucide-react';
import { 
  getPaginatedCategories, 
  createCategory, 
  updateCategoryDetails, 
  updateSearchBlueprint, 
  updateCategoryStatus, 
  hardDeleteCategory 
} from '@/api/admin/categories';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [meta, setMeta] = useState({ totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT' | 'BLUEPRINT'>('CREATE');
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', imageUrl: '' });
  const [blueprintData, setBlueprintData] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = async (page = 1) => {
    try {
      setLoading(true);
      const params: any = { page, limit: 10 };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      
      const res = await getPaginatedCategories(params);
      setCategories(res.data?.data || []);
      setMeta(res.data?.meta || { totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchCategories(1), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter]);

  const handleOpenModal = (mode: 'CREATE' | 'EDIT' | 'BLUEPRINT', category?: any) => {
    setModalMode(mode);
    setError('');
    if (category) {
      setSelectedCategory(category);
      if (mode === 'EDIT') {
        setFormData({
          name: category.name || '',
          slug: category.slug || '',
          description: category.description || '',
          imageUrl: category.imageUrl || ''
        });
      } else if (mode === 'BLUEPRINT') {
        setBlueprintData(category.searchBlueprint ? JSON.stringify(category.searchBlueprint, null, 2) : '{\n  "filters": []\n}');
      }
    } else {
      setSelectedCategory(null);
      setFormData({ name: '', slug: '', description: '', imageUrl: '' });
      setBlueprintData('{\n  "filters": []\n}');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');
    
    try {
      if (modalMode === 'CREATE') {
        await createCategory({ ...formData, searchBlueprint: JSON.parse(blueprintData || '{}') });
      } else if (modalMode === 'EDIT') {
        await updateCategoryDetails(selectedCategory.id, formData);
      } else if (modalMode === 'BLUEPRINT') {
        await updateSearchBlueprint(selectedCategory.id, { searchBlueprint: JSON.parse(blueprintData) });
      }
      setIsModalOpen(false);
      fetchCategories(meta.currentPage);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateCategoryStatus(id, { status });
      fetchCategories(meta.currentPage);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this category?')) return;
    try {
      await hardDeleteCategory(id);
      fetchCategories(meta.currentPage);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Categories Management</h1>
          <p className="text-slate-500 text-sm mt-1">Manage product categories and search blueprints</p>
        </div>
        <button 
          onClick={() => handleOpenModal('CREATE')}
          className="flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
        >
          <Plus className="w-5 h-5" /> New Category
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search categories by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="DISABLED">Disabled</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-6">Category Details</th>
                <th className="p-6">Stats</th>
                <th className="p-6">Status</th>
                <th className="p-6">Created At</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-6"><div className="h-4 bg-slate-200 rounded w-48 mb-2"></div><div className="h-3 bg-slate-100 rounded w-32"></div></td>
                    <td className="p-6"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                    <td className="p-6"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                    <td className="p-6"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="p-6"><div className="h-8 bg-slate-200 rounded w-full"></div></td>
                  </tr>
                ))
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-lg text-slate-900 mb-1">No categories found</p>
                    <p>Try adjusting your search filters</p>
                  </td>
                </tr>
              ) : (
                categories.map((category, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={category.id} 
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 border border-slate-200 overflow-hidden relative">
                          {category.imageUrl ? (
                            <img src={category.imageUrl} alt={category.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{category.name}</p>
                          <p className="text-xs font-medium text-slate-500">/{category.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                        <Package className="w-4 h-4 text-sky-500" />
                        {category.productCount || 0} Products
                      </div>
                    </td>
                    <td className="p-6">
                      <select
                        value={category.status}
                        onChange={(e) => handleStatusChange(category.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none cursor-pointer border ${
                          category.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          category.status === 'DISABLED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          category.status === 'ARCHIVED' ? 'bg-slate-100 text-slate-600 border-slate-300' :
                          'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="DISABLED">DISABLED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                        <option value="DELETED">DELETED</option>
                      </select>
                    </td>
                    <td className="p-6 text-sm font-medium text-slate-600">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal('EDIT', category)}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Edit Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal('BLUEPRINT', category)}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit Blueprint"
                        >
                          <Code className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(category.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hard Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <p className="text-sm font-medium text-slate-500">
            Showing page {meta.currentPage} of {meta.totalPages} ({meta.totalCount} total categories)
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => fetchCategories(meta.currentPage - 1)}
              disabled={meta.currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <button 
              onClick={() => fetchCategories(meta.currentPage + 1)}
              disabled={meta.currentPage === meta.totalPages || meta.totalPages === 0}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900">
                  {modalMode === 'CREATE' ? 'Create New Category' : 
                   modalMode === 'EDIT' ? 'Edit Category Details' : 
                   'Edit Search Blueprint'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-sm font-medium flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    {error}
                  </div>
                )}

                <form id="categoryForm" onSubmit={handleSubmit} className="space-y-5">
                  {(modalMode === 'CREATE' || modalMode === 'EDIT') && (
                    <>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Name</label>
                          <input 
                            required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-700 mb-1">Slug</label>
                          <input 
                            required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Image URL</label>
                        <input 
                          type="url" value={formData.imageUrl} onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                        <textarea 
                          rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                        />
                      </div>
                    </>
                  )}

                  {(modalMode === 'CREATE' || modalMode === 'BLUEPRINT') && (
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1 flex justify-between">
                        Search Blueprint (JSON)
                        {modalMode === 'CREATE' && <span className="text-xs font-normal text-slate-500">Optional</span>}
                      </label>
                      <textarea 
                        required={modalMode === 'BLUEPRINT'}
                        rows={8} 
                        value={blueprintData} 
                        onChange={e => setBlueprintData(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900 text-emerald-400 font-mono text-sm border border-slate-800 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none resize-none"
                      />
                    </div>
                  )}
                </form>
              </div>

              <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" form="categoryForm" disabled={formLoading} className="flex-1 py-3 bg-sky-500 text-white rounded-xl font-bold hover:bg-sky-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {formLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}