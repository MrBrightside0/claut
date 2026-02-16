import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDb';
import { UserRole, Opportunity, OpportunityStatus, ConfidentialityMode } from '../types';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import { Plus, BrainCircuit, Filter } from 'lucide-react';
import { analyzeRequirement } from '../services/geminiService';

const Opportunities = () => {
  const { user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'market' | 'applications'>('market');
  
  // Create Form State
  const [newOpp, setNewOpp] = useState<Partial<Opportunity>>({
    title: '', summary: '', quantity: '', specifications: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!user) return null;

  const isBuyer = user.role === UserRole.COMPRADOR;
  const isCoord = user.role === UserRole.COORDINADOR_CLAUT;
  const isProvider = user.role === UserRole.PROVEEDOR;

  // Data fetching
  const allOpportunities = db.getOpportunities();
  const myApplications = db.getApplicationsByProvider(user.companyId || '');

  // Filter based on role and tab
  let displayedOpportunities = allOpportunities;

  if (isBuyer) {
      // Buyers see their own opportunities
      displayedOpportunities = allOpportunities.filter(o => o.buyerCompanyId === user.companyId);
  } else if (isProvider) {
      if (activeTab === 'applications') {
          // Show only opportunities where I have applied
          const appliedIds = myApplications.map(a => a.opportunityId);
          displayedOpportunities = allOpportunities.filter(o => appliedIds.includes(o.id));
      } else {
          // Market: Show Open opportunities (optionally filter out ones I applied to, or show status)
          displayedOpportunities = allOpportunities.filter(o => o.status === OpportunityStatus.OPEN);
      }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.title || !newOpp.summary) return;

    // Simulate AI extraction on create
    const caps = (await analyzeRequirement(newOpp.summary!)).capabilities; // Mock if no key

    const created: Opportunity = {
        id: `OP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`,
        createdByUserId: user.id,
        buyerCompanyId: user.companyId || 'c1',
        title: newOpp.title!,
        summary: newOpp.summary!,
        quantity: newOpp.quantity || 'N/A',
        specifications: newOpp.specifications || '',
        requiredCertifications: [],
        otherRequirements: '',
        confidentialityMode: ConfidentialityMode.SHOW_COMPANY,
        applicationDeadlineAt: new Date(Date.now() + 7 * 86400000).toISOString(),
        status: OpportunityStatus.OPEN,
        aiDetectedCapabilities: caps.length > 0 ? caps : ['Manufactura'],
        createdAt: new Date().toISOString()
    };

    db.createOpportunity(created);
    setShowCreateModal(false);
    setNewOpp({ title: '', summary: '', quantity: '', specifications: '' });
  };

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulating delay
    setTimeout(() => {
        setIsAnalyzing(false);
        // In a real app, this would autofill fields using geminiService
    }, 1500);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Oportunidades de Negocio</h1>
        {(isBuyer || isCoord) && (
            <button onClick={() => setShowCreateModal(true)} className="bg-claut-900 text-white px-4 py-2 rounded-lg flex items-center hover:bg-claut-700">
                <Plus className="w-4 h-4 mr-2" /> Crear Oportunidad
            </button>
        )}
      </div>

      {isProvider && (
          <div className="flex space-x-4 border-b mb-6">
              <button 
                onClick={() => setActiveTab('market')}
                className={`pb-2 px-4 font-medium transition ${activeTab === 'market' ? 'border-b-2 border-claut-900 text-claut-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  Mercado (Nuevas)
              </button>
              <button 
                onClick={() => setActiveTab('applications')}
                className={`pb-2 px-4 font-medium transition ${activeTab === 'applications' ? 'border-b-2 border-claut-900 text-claut-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                  Mis Aplicaciones ({myApplications.length})
              </button>
          </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Título</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Comprador</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Deadline</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estatus</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acción</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
                {displayedOpportunities.map(opp => {
                    const application = isProvider ? myApplications.find(a => a.opportunityId === opp.id) : null;
                    return (
                        <tr key={opp.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-500">{opp.id}</td>
                            <td className="px-6 py-4">
                                <div className="flex items-center">
                                    <p className="text-sm font-medium text-gray-900 mr-2">{opp.title}</p>
                                    {application && <span className="bg-blue-100 text-blue-800 text-[10px] px-2 rounded-full">Aplicado</span>}
                                </div>
                                <p className="text-xs text-gray-500 truncate w-64">{opp.summary}</p>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {opp.confidentialityMode === ConfidentialityMode.ANONYMOUS_TO_PROVIDERS && isProvider 
                                    ? 'Confidencial' 
                                    : db.getCompanyById(opp.buyerCompanyId)?.tradeName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(opp.applicationDeadlineAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4">
                                {isProvider && activeTab === 'applications' && application ? (
                                    <StatusBadge status={application.status} />
                                ) : (
                                    <StatusBadge status={opp.status} />
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <Link to={`/opportunities/${opp.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                    Ver Detalle
                                </Link>
                            </td>
                        </tr>
                    );
                })}
                {displayedOpportunities.length === 0 && (
                    <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            No se encontraron oportunidades en esta sección.
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>

      {/* Modal Crear */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
                <h2 className="text-xl font-bold mb-4">Nueva Oportunidad</h2>
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Título</label>
                        <input className="w-full border rounded p-2" value={newOpp.title} onChange={e => setNewOpp({...newOpp, title: e.target.value})} required />
                    </div>
                    <div>
                        <div className="flex justify-between">
                             <label className="block text-sm font-medium mb-1">Resumen / Specs</label>
                             <button type="button" onClick={runAiAnalysis} className="text-xs text-purple-600 flex items-center">
                                <BrainCircuit className="w-3 h-3 mr-1" /> {isAnalyzing ? 'Analizando...' : 'Mejorar con IA'}
                             </button>
                        </div>
                        <textarea className="w-full border rounded p-2 h-24" value={newOpp.summary} onChange={e => setNewOpp({...newOpp, summary: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium mb-1">Volumen</label>
                             <input className="w-full border rounded p-2" value={newOpp.quantity} onChange={e => setNewOpp({...newOpp, quantity: e.target.value})} />
                        </div>
                        <div>
                             <label className="block text-sm font-medium mb-1">Especificaciones Técnicas</label>
                             <input className="w-full border rounded p-2" value={newOpp.specifications} onChange={e => setNewOpp({...newOpp, specifications: e.target.value})} />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={() => setShowCreateModal(false)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancelar</button>
                        <button type="submit" className="px-4 py-2 bg-claut-900 text-white rounded hover:bg-claut-700">Publicar Oportunidad</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;