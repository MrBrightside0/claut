import React from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDb';
import { UserRole, PipelineStatus } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatusBadge from '../components/StatusBadge';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  if (!user) return null;

  // --- Data Prep ---
  const opportunities = db.getOpportunities();
  const myOpportunities = user.role === UserRole.COMPRADOR ? opportunities.filter(o => o.buyerCompanyId === user.companyId) : [];
  const applications = db.applications;
  const myApplications = user.role === UserRole.PROVEEDOR ? applications.filter(a => a.providerCompanyId === user.companyId) : [];

  // KPI Helpers
  const totalOpps = opportunities.length;
  const totalApps = applications.length;
  
  // Charts Data
  const statusData = Object.values(PipelineStatus).map(status => ({
    name: (status as string).replace('_', ' '),
    count: applications.filter(a => a.status === status).length
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4f'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hola, {user.name}</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Oportunidades Activas</p>
          <p className="text-3xl font-bold text-claut-900">{opportunities.filter(o => o.status === 'OPEN').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Total Aplicaciones</p>
          <p className="text-3xl font-bold text-blue-600">{totalApps}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Requerimientos Públicos</p>
          <p className="text-3xl font-bold text-purple-600">{db.publicRequirements.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <p className="text-sm text-gray-500 font-medium">Sesiones Agendadas</p>
          <p className="text-3xl font-bold text-orange-600">{db.sessions.filter(s => s.status === 'SCHEDULED').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart 1 */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80">
           <h3 className="font-bold text-gray-700 mb-4">Pipeline General de Aplicaciones</h3>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={statusData}>
               <XAxis dataKey="name" fontSize={10} angle={-15} textAnchor="end" />
               <YAxis />
               <Tooltip />
               <Bar dataKey="count" fill="#334e68" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>

        {/* Pending Actions List */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80 overflow-y-auto">
            <h3 className="font-bold text-gray-700 mb-4">Acciones Recientes / Pendientes</h3>
            <ul className="space-y-3">
                {user.role === UserRole.COMPRADOR && myOpportunities.map(o => (
                    <li key={o.id} className="border-b pb-2 last:border-0">
                        <Link to={`/opportunities/${o.id}`} className="hover:text-blue-600">
                            <div className="flex justify-between">
                                <span className="font-medium text-sm">{o.title}</span>
                                <StatusBadge status={o.status} />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {db.getApplicationsByOpportunity(o.id).length} aplicantes pendientes de revisión
                            </p>
                        </Link>
                    </li>
                ))}
                
                {user.role === UserRole.PROVEEDOR && myApplications.map(a => (
                    <li key={a.id} className="border-b pb-2 last:border-0">
                        <div className="flex justify-between">
                            <span className="font-medium text-sm">{db.getOpportunityById(a.opportunityId)?.title}</span>
                            <StatusBadge status={a.status} />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Actualizado: {new Date(a.lastUpdatedAt).toLocaleDateString()}</p>
                    </li>
                ))}

                {myOpportunities.length === 0 && myApplications.length === 0 && (
                    <p className="text-gray-400 text-sm">No hay actividades recientes.</p>
                )}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;