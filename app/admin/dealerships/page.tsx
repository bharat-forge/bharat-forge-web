"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Search, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight, AlertCircle, ShieldAlert, X, Percent
} from 'lucide-react';
import { 
  getAllDealershipRequests,
  updateDealershipStatus
} from '@/api/admin/dealershipApprovals';

export default function AdminDealershipRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [meta, setMeta] = useState({ totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [page, setPage] = useState(1);

  const [approvalModal, setApprovalModal] = useState<{
    show: boolean;
    dealerId: string;
    productId: string;
    businessName: string;
    productName: string;
    basePrice: number;
    discount: number;
    status: string;
  } | null>(null);

  const fetchRequests = async (currentPage = 1) => {
    try {
      setLoading(true);
      const params: any = { page: currentPage, limit: 10 };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter) params.status = statusFilter;
      
      const res = await getAllDealershipRequests(params);
      setRequests(res.data?.data || []);
      setMeta(res.data?.meta || { totalCount: 0, totalPages: 1, currentPage, limit: 10 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchRequests(page), 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, page]);

  const handleUpdateStatus = async (dealerId: string, productId: string, status: string, discountPercentage = 0) => {
    try {
      await updateDealershipStatus(dealerId, productId, { status, discountPercentage });
      fetchRequests(meta.currentPage);
      setApprovalModal(null);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update request status');
    }
  };

  const openApprovalModal = (req: any, targetStatus: string) => {
    setApprovalModal({
      show: true,
      dealerId: req.dealerId,
      productId: req.productId,
      businessName: req.businessName,
      productName: req.productName,
      basePrice: req.basePrice,
      discount: req.discountPercentage || 0,
      status: targetStatus
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="w-12 h-12 bg-sky-50 rounded-xl flex items-center justify-center border border-sky-100">
          <Building2 className="w-6 h-6 text-sky-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Product Dealership Requests</h1>
          <p className="text-slate-500 text-sm mt-1">Review and manage dealer requests to sell specific products</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Search by dealer or product name..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all font-medium text-slate-700"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none font-medium text-slate-700"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-6">Dealer Info</th>
                <th className="p-6">Product Details</th>
                <th className="p-6">Pricing & Discount</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-6"><div className="h-4 bg-slate-200 rounded w-48"></div></td>
                    <td className="p-6"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                    <td className="p-6"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    <td className="p-6"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                    <td className="p-6"><div className="h-8 bg-slate-200 rounded w-24 ml-auto"></div></td>
                  </tr>
                ))
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <p className="font-medium text-lg text-slate-900 mb-1">No requests found</p>
                    <p>No dealership requests match the current filters.</p>
                  </td>
                </tr>
              ) : (
                requests.map((req, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={`${req.dealerId}-${req.productId}`} 
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="p-6">
                      <p className="font-bold text-slate-900">{req.businessName || 'Unknown Dealer'}</p>
                      <p className="text-xs text-slate-500 mt-1">{new Date(req.requestedAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-bold text-slate-900">{req.productName || 'Unknown Product'}</p>
                      <p className="text-xs text-slate-500 font-mono mt-1">{req.sku}</p>
                    </td>
                    <td className="p-6">
                      <p className="text-sm font-medium text-slate-500 line-through">₹{req.basePrice.toLocaleString()}</p>
                      {req.status === 'APPROVED' ? (
                        <p className="text-sm font-bold text-sky-600">
                          ₹{(req.basePrice * (1 - req.discountPercentage / 100)).toLocaleString()} 
                          <span className="text-xs text-slate-400 ml-1">({req.discountPercentage}% off)</span>
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400">Pending Deal</p>
                      )}
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                        req.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700' :
                        req.status === 'PENDING' ? 'bg-amber-50 text-amber-700' :
                        'bg-rose-50 text-rose-700'
                      }`}>
                        {req.status === 'APPROVED' ? <CheckCircle className="w-3 h-3" /> : 
                         req.status === 'PENDING' ? <Clock className="w-3 h-3" /> : 
                         <XCircle className="w-3 h-3" />}
                        {req.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'PENDING' ? (
                          <>
                            <button 
                              onClick={() => openApprovalModal(req, 'APPROVED')}
                              className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors"
                            >
                              Approve
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(req.dealerId, req.productId, 'REJECTED')}
                              className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        ) : req.status === 'APPROVED' ? (
                          <>
                            <button 
                              onClick={() => openApprovalModal(req, 'APPROVED')}
                              className="px-4 py-2 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded-lg text-xs font-bold transition-colors"
                            >
                              Edit Deal
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(req.dealerId, req.productId, 'REVOKED')}
                              className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-bold transition-colors"
                            >
                              Revoke
                            </button>
                          </>
                        ) : (
                          <button 
                            onClick={() => openApprovalModal(req, 'APPROVED')}
                            className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors"
                          >
                            Re-Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta.totalPages > 1 && (
          <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <p className="text-sm font-medium text-slate-500">
              Showing page {meta.currentPage} of {meta.totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={meta.currentPage === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={meta.currentPage === meta.totalPages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {approvalModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h2 className="text-xl font-black text-slate-900">Configure Dealership Deal</h2>
                <button onClick={() => setApprovalModal(null)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Dealer</p>
                  <p className="text-sm font-bold text-slate-900">{approvalModal.businessName}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Product</p>
                  <p className="text-sm font-bold text-slate-900">{approvalModal.productName}</p>
                </div>
                
                <div className="border-t border-slate-100 pt-4">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Negotiated Discount Percentage</label>
                  <div className="relative">
                    <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="number" 
                      min="0" 
                      max="100" 
                      step="0.1"
                      value={approvalModal.discount} 
                      onChange={(e) => setApprovalModal({ ...approvalModal, discount: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Base Price</span>
                    <span className="font-bold text-slate-900 line-through">₹{approvalModal.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Discount Amount</span>
                    <span className="font-bold text-emerald-600">-₹{((approvalModal.basePrice * approvalModal.discount) / 100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-900">Final Dealer Price</span>
                    <span className="text-lg font-black text-emerald-600">₹{(approvalModal.basePrice * (1 - approvalModal.discount / 100)).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setApprovalModal(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold">Cancel</button>
                  <button 
                    onClick={() => handleUpdateStatus(approvalModal.dealerId, approvalModal.productId, approvalModal.status, approvalModal.discount)}
                    className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold flex justify-center items-center transition-colors"
                  >
                    Confirm Approval
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}