import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './main/Component/Navbar';
import Footer from './main/Component/Footer';
import ProtectedRoute from './main/Component/ProtectedRoute';

import Home from './main/pages/Home';
import Login from './main/pages/Login';
import Browse from './main/pages/Browse';
import CustomerDashboard from './main/pages/Customer/CustomerDashboard';
import WorkerDashboard from './main/pages/Worker/WorkerDashboard';
import JobDetailsPage from './main/pages/jobs/JobDetailsPage';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER']} />}>
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['WORKER']} />}>
              <Route path="/worker/dashboard" element={<WorkerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'WORKER', 'ADMIN']} />}>
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}