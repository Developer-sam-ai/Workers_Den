import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axiosClient';
import { Star, ArrowRight } from 'lucide-react';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/workers/me'),
      api.get('/jobs/worker/available'),
      api.get('/jobs/worker/my-jobs')
    ])
      .then(([profRes, availRes, myRes]) => {
        setProfile(profRes.data);
        setAvailableJobs(availRes.data);
        setMyJobs(myRes.data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-10 text-slate-400 text-sm">Loading dashboard...</div>;
  }

  const activeJobs = myJobs.filter(j => j.status === 'ACCEPTED' || j.status === 'IN_PROGRESS');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Worker Dashboard</h1>
          <p className="text-sm text-slate-500">
            Locality: <span className="font-semibold text-slate-800">{profile?.locality || 'Not Set'}</span> • 
            Status: <span className="font-semibold text-emerald-600">{profile?.isAvailable ? 'Available' : 'Paused'}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-center">
            <p className="text-slate-400">Rating</p>
            <p className="text-slate-900 font-bold flex items-center justify-center gap-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {profile?.rating || '0.0'}
            </p>
          </div>
          <div className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-center">
            <p className="text-slate-400">Completed</p>
            <p className="text-slate-900 font-bold">{profile?.completedJobs || 0}</p>
          </div>
        </div>
      </div>

      <div 
        onClick={() => navigate('/worker/find-jobs')}
        className="bg-blue-600 text-white rounded-xl p-6 cursor-pointer hover:bg-blue-700 transition flex items-center justify-between"
      >
        <div>
          <span className="text-xs font-semibold bg-blue-500/50 px-2 py-0.5 rounded">
            Near Your Locality
          </span>
          <h2 className="text-xl font-bold mt-1">
            🔥 {availableJobs.length} Jobs Available
          </h2>
          <p className="text-xs text-blue-100 mt-0.5">Matching your skills and service area</p>
        </div>
        <button className="bg-white text-blue-600 text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1 shadow-sm">
          Find Jobs <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3">Active Tasks ({activeJobs.length})</h2>
        {activeJobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeJobs.map((job) => (
              <div 
                key={job.requestId} 
                className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                      {job.status}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">₹{job.workerPayout}</span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{job.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{job.locality} • {job.preferredDate}</p>
                </div>
                <button
                  onClick={() => navigate(`/jobs/${job.requestId}`)}
                  className="mt-4 w-full bg-slate-900 text-white text-xs font-semibold py-2 rounded-lg hover:bg-slate-800 transition"
                >
                  Manage Job & Action
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">
            No active jobs in progress. Check available jobs above to accept work.
          </div>
        )}
      </div>
    </div>
  );
}