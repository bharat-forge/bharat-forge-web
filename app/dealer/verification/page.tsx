"use client";

import { useState, useEffect } from 'react';
import { getVerificationRequirements, submitVerificationData } from '@/api/dealer/verification';
import { Loader2, UploadCloud, AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DealerVerificationPage() {
  const [requirements, setRequirements] = useState<any[]>([]);
  const [dealerStatus, setDealerStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoaders, setSubmitLoaders] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState('');

  const fetchRequirements = async () => {
    try {
      const { data } = await getVerificationRequirements();
      setRequirements(data.requirements);
      setDealerStatus(data.dealerStatus);
    } catch (err) {
      setError('Failed to load verification requirements.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  const handleSubmit = async (e: React.FormEvent, blueprintId: string, type: string) => {
    e.preventDefault();
    setSubmitLoaders(prev => ({ ...prev, [blueprintId]: true }));
    setError('');

    try {
      const formData = new FormData();
      formData.append('blueprintId', blueprintId);

      const target = e.target as HTMLFormElement;
      
      if (type === 'FILE') {
        const fileInput = target.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput.files?.[0]) {
          formData.append('file', fileInput.files[0]);
        }
      } else {
        const textInput = target.querySelector('input[type="text"]') as HTMLInputElement;
        if (textInput.value) {
          formData.append('textValue', textInput.value);
        }
      }

      await submitVerificationData(formData);
      await fetchRequirements();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit document');
    } finally {
      setSubmitLoaders(prev => ({ ...prev, [blueprintId]: false }));
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-sky-500" /></div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Verification</h1>
        <p className="text-slate-600">
          Please provide the following documents to activate your B2B purchasing privileges. 
          Your account is currently <span className="font-semibold text-sky-600">{dealerStatus.replace('_', ' ')}</span>.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3 border border-red-100">
          <AlertCircle className="h-5 w-5 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {requirements.map((req, idx) => {
          const { blueprint, submission } = req;
          const isPending = submission?.status === 'PENDING';
          const isApproved = submission?.status === 'APPROVED';
          const isRejected = submission?.status === 'REJECTED';
          const needsAction = !submission || isRejected;

          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              key={blueprint.id} 
              className={`bg-white rounded-2xl p-6 border ${isApproved ? 'border-emerald-200' : isRejected ? 'border-red-200' : 'border-slate-200'} shadow-sm`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-900">{blueprint.name}</h3>
                    {blueprint.isRequired && <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-md">REQUIRED</span>}
                  </div>
                  <p className="text-slate-500 text-sm mb-4">{blueprint.description}</p>
                  
                  {isRejected && submission?.adminRemarks && (
                    <div className="mb-4 p-3 bg-red-50 rounded-lg text-sm text-red-700 border border-red-100">
                      <strong>Admin Feedback:</strong> {submission.adminRemarks}
                    </div>
                  )}

                  {isPending && (
                    <div className="flex items-center gap-2 text-sky-600 text-sm font-medium">
                      <Clock className="h-5 w-5" /> Under Review by Administration
                    </div>
                  )}

                  {isApproved && (
                    <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                      <CheckCircle2 className="h-5 w-5" /> Verified and Approved
                    </div>
                  )}
                </div>

                {needsAction && (
                  <div className="w-full md:w-auto md:min-w-[320px]">
                    <form onSubmit={(e) => handleSubmit(e, blueprint.id, blueprint.type)} className="flex flex-col gap-3">
                      {blueprint.type === 'FILE' ? (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                            <p className="text-sm text-slate-500 font-medium">Click to upload PDF/Image</p>
                          </div>
                          <input type="file" className="hidden" required accept=".pdf,.png,.jpg,.jpeg" />
                        </label>
                      ) : (
                        <input type="text" required placeholder={`Enter ${blueprint.name}`} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500/20" />
                      )}
                      
                      <button 
                        type="submit" 
                        disabled={submitLoaders[blueprint.id]}
                        className="w-full py-2.5 px-4 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors flex justify-center items-center"
                      >
                        {submitLoaders[blueprint.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Submit Document'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}