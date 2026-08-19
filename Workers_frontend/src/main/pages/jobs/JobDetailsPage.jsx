import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api/axiosClient';
import { MapPin, Calendar, DollarSign, UserCheck, MessageSquare } from 'lucide-react';

export default function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem('token');
  let userRole = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      userRole = payload.role ? payload.role.replace('ROLE_', '') : null;
    } catch {
      localStorage.clear();
    }
  }

  const fetchJob = useCallback(() => {
    api.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(console.error);
  }, [id]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleAction = async (actionType) => {
    setActionLoading(true);
    try {
      await api.post(`/jobs/${id}/${actionType}`);
      fetchJob();
    } catch (err) {
      alert(err.response?.data?.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (!job) return <div className="p-8 text-center text-xs text-slate-400">Loading details...</div>;

  const isCustomer = userRole === 'CUSTOMER';
  const isWorker = userRole === 'WORKER';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-semibold uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {job.categoryName}
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">{job.title}</h1>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-800 rounded-full">
            {job.status}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4 text-blue-600" /> {job.locality}, {job.address}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-blue-600" /> {job.preferredDate} ({job.preferredTime || 'Anytime'})
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <DollarSign className="w-4 h-4 text-blue-600" /> 
            {isWorker ? `Payout: ₹${job.workerPayout}` : `Fixed Rate: ₹${job.customerPrice}`}
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <UserCheck className="w-4 h-4 text-blue-600" /> 
            {isWorker ? `Customer: ${job.customerName}` : (job.workerName ? `Worker: ${job.workerName}` : 'Awaiting worker')}
          </div>
        </div>

        <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
          {job.description || 'No additional description provided.'}
        </p>

        <div className="border-t border-slate-200 pt-4 flex flex-wrap items-center justify-between gap-3">
          {isWorker && job.status === 'OPEN' && (
            <button
              disabled={actionLoading}
              onClick={() => handleAction('accept')}
              className="w-full bg-blue-600 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              Accept Job (Earn ₹{job.workerPayout})
            </button>
          )}

          {isWorker && job.status === 'ACCEPTED' && (
            <button
              disabled={actionLoading}
              onClick={() => handleAction('start')}
              className="bg-blue-600 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition"
            >
              Start Work
            </button>
          )}

          {isWorker && job.status === 'IN_PROGRESS' && (
            <button
              disabled={actionLoading}
              onClick={() => handleAction('complete')}
              className="bg-emerald-600 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition"
            >
              Mark Completed
            </button>
          )}

          {(job.status === 'ACCEPTED' || job.status === 'IN_PROGRESS') && (
            <button
              onClick={() => alert(`Contact phone: ${isWorker ? job.customerPhone : job.workerPhone}`)}
              className="border border-slate-300 text-slate-700 text-xs font-medium px-4 py-2 rounded-lg inline-flex items-center gap-1 hover:bg-slate-50"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Contact
            </button>
          )}

          {isCustomer && job.status === 'COMPLETED' && (
            <button
              onClick={() => navigate(`/customer/review/${job.requestId}`)}
              className="bg-amber-500 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-amber-600"
            >
              Rate & Review Worker
            </button>
          )}
        </div>
      </div>
    </div>
  );
}