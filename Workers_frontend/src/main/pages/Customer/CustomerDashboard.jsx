import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosClient';
import { ArrowRight, Clock, PlusCircle } from 'lucide-react';

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/Categories'),
      api.get('/jobs/customer/my-jobs')
    ])
      .then(([catRes, jobsRes]) => {
        setCategories(catRes.data);
        setJobs(jobsRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading dashboard...</div>;
  }

  const activeJob = jobs.find(j => j.status === 'ACCEPTED' || j.status === 'IN_PROGRESS');
  const recentJobs = jobs.filter(j => j.requestId !== activeJob?.requestId).slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customer Dashboard</h1>
          <p className="text-sm text-slate-500">Book home services with standard transparent pricing.</p>
        </div>
        <button
          onClick={() => navigate('/customer/create-job')}
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-4 h-4" /> Book a Service
        </button>
      </div>

      {activeJob && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
              Active Job
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              {activeJob.status}
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900">{activeJob.title}</h3>
          <p className="text-sm text-slate-600 mb-4">
            {activeJob.workerName ? `Assigned to: ${activeJob.workerName}` : 'Waiting for local worker...'}
          </p>
          <button
            onClick={() => navigate(`/jobs/${activeJob.requestId}`)}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            View Details & Status <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      <div>
        <h2 className="text-base font-bold text-slate-900 mb-4">Popular Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/customer/create-job?catId=${cat.id}`)}
              className="p-4 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/20 transition"
            >
              <p className="font-semibold text-sm text-slate-900">{cat.catName}</p>
              <p className="text-xs text-blue-600 font-medium mt-1">₹{cat.customerPrice}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">Recent Requests</h2>
        {recentJobs.length > 0 ? (
          <div className="space-y-2">
            {recentJobs.map((job) => (
              <div
                key={job.requestId}
                onClick={() => navigate(`/jobs/${job.requestId}`)}
                className="p-4 bg-white border border-slate-200 rounded-lg flex justify-between items-center hover:border-slate-300 transition cursor-pointer"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900">{job.title}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> {job.preferredDate} • ₹{job.customerPrice}
                  </p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  job.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4">No recent service requests.</p>
        )}
      </div>
    </div>
  );
}