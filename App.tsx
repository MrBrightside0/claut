import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import OpportunityDetail from './pages/OpportunityDetail';
import CompanyProfile from './pages/CompanyProfile';
import PublicCompanyProfile from './pages/PublicCompanyProfile';
import AdminPanel from './pages/admin/AdminPanel';
import PublicRequests from './pages/PublicRequests';

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/company/:id" element={<PublicCompanyProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Private Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/opportunities" element={<Opportunities />} />
            <Route path="/opportunities/:id" element={<OpportunityDetail />} />
            <Route path="/profile" element={<CompanyProfile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/public-requests" element={<PublicRequests />} />
            
            <Route path="/my-applications" element={<Navigate to="/opportunities" replace />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;