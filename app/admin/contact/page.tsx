"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Inbox, Search, Trash2, Eye, ChevronRight, ChevronLeft, 
  Clock, CheckCircle2, AlertCircle, Building2, Phone, Mail
} from 'lucide-react';
import { getPaginatedContacts, updateContactStatus, deleteContact } from '@/api/admin/contactRequestManagement';

interface ContactRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  inquiryType: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactRequestsPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeViewRequest, setActiveViewRequest] = useState<ContactRequest | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [page, search]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await getPaginatedContacts({ page, limit: 10, search });
      setRequests(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateContactStatus(id, newStatus);
      fetchRequests();
      if (activeViewRequest && activeViewRequest.id === id) {
        setActiveViewRequest(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact request?')) return;
    try {
      await deleteContact(id);
      fetchRequests();
      if (activeViewRequest && activeViewRequest.id === id) {
        setActiveViewRequest(null);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusStyles = (status: string) => {
    switch(status) {
      case 'PENDING': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'IN_PROGRESS': return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'RESOLVED': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl">
            <Inbox className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contact Requests</h1>
            <p className="text-slate-500 font-medium">Manage incoming inquiries from B2B partners.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
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
                <th className="p-6">Sender Details</th>
                <th className="p-6">Inquiry Type</th>
                <th className="p-6">Status</th>
                <th className="p-6">Date Received</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400">Loading...</td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-slate-400">
                    <Inbox className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-bold text-lg">No contact requests found</p>
                  </td>
                </tr>
              ) : (
                requests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="p-6">
                      <p className="font-bold text-slate-900">{req.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {req.email}</span>
                        {req.company && <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {req.company}</span>}
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg border border-slate-200">
                        {req.inquiryType}
                      </span>
                    </td>
                    <td className="p-6">
                      <select
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border focus:outline-none appearance-none cursor-pointer ${getStatusStyles(req.status)}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="RESOLVED">Resolved</option>
                      </select>
                    </td>
                    <td className="p-6 text-sm text-slate-500 font-medium">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setActiveViewRequest(req)}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="View Full Message"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(req.id)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete"
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
        {activeViewRequest && (
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
              className="bg-white rounded-3xl w-full max-w-2xl flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-sky-500" />
                  Contact Request Details
                </h2>
                <button
                  onClick={() => setActiveViewRequest(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <AlertCircle className="w-6 h-6 rotate-45" />
                </button>
              </div>
              
              <div className="p-8 bg-white space-y-8">
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{activeViewRequest.name}</h3>
                    <p className="text-sky-600 font-bold tracking-wide mt-1">{activeViewRequest.inquiryType}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-lg border font-bold text-xs uppercase tracking-wider ${getStatusStyles(activeViewRequest.status)}`}>
                    {activeViewRequest.status.replace('_', ' ')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</span>
                    <a href={`mailto:${activeViewRequest.email}`} className="text-slate-900 font-medium hover:text-sky-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {activeViewRequest.email}
                    </a>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Phone Number</span>
                    {activeViewRequest.phone ? (
                      <a href={`tel:${activeViewRequest.phone}`} className="text-slate-900 font-medium hover:text-sky-600 flex items-center gap-2">
                        <Phone className="h-4 w-4" /> {activeViewRequest.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400 font-medium">Not provided</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Company / Organization</span>
                    <span className="text-slate-900 font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4" /> {activeViewRequest.company || 'Not provided'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Message Content</span>
                  <div className="p-6 bg-white border border-slate-200 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
                    {activeViewRequest.message}
                  </div>
                </div>

              </div>

              <div className="p-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> Received: {new Date(activeViewRequest.createdAt).toLocaleString()}
                </span>
                <div className="flex gap-3">
                  <select
                    value={activeViewRequest.status}
                    onChange={(e) => handleStatusChange(activeViewRequest.id, e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none cursor-pointer hover:bg-slate-50"
                  >
                    <option value="PENDING">Mark as Pending</option>
                    <option value="IN_PROGRESS">Mark as In Progress</option>
                    <option value="RESOLVED">Mark as Resolved</option>
                  </select>
                  <button
                    onClick={() => setActiveViewRequest(null)}
                    className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}