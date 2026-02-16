import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../services/mockDb';
import { useAuth } from '../context/AuthContext';
import { UserRole, PipelineStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import ActivityTimeline from '../components/ActivityTimeline';
import Modal from '../components/ui/Modal';
import { Calendar, Video, Clock } from 'lucide-react';

const OpportunityDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const opportunity = db.getOpportunityById(id || '');
  const [refresh, setRefresh] = useState(0);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionData, setSessionData] = useState({ date: '', time: '', link: 'https://zoom.us/j/123456789' });

  if (!opportunity || !user) return <div>No encontrado</div>;

  const applications = db.getApplicationsByOpportunity(opportunity.id);
  const myApp = applications.find(a => a.providerCompanyId === user.companyId);
  const sessions = db.getSessionsByOpportunity(opportunity.id);
  
  const isBuyer = user.role === UserRole.COMPRADOR && user.companyId === opportunity.buyerCompanyId;
  const isCoord = user.role === UserRole.COORDINADOR_CLAUT;
  const isProvider = user.role === UserRole.PROVEEDOR;

  const handleApply = () => {
    db.createApplication({
        id: `APP-${Date.now()}`,
        opportunityId: opportunity.id,
        providerCompanyId: user.companyId!,
        status: PipelineStatus.INTERESTED,
        matchScorePercent: 0,
        createdAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString()
    });
    setRefresh(prev => prev + 1);
  };

  const handleStatusChange = (appId: string, status: PipelineStatus) => {
    db.updateApplicationStatus(appId, status);
    setRefresh(prev => prev + 1);
  };

  const handleCreateSession = (e: React.FormEvent) => {
      e.preventDefault();
      db.createSession({
          id: `SESS-${Date.now()}`,
          opportunityId: opportunity.id,
          scheduledAt: new Date(`${sessionData.date}T${sessionData.time}`).toISOString(),
          zoomJoinUrl: sessionData.link,
          status: 'SCHEDULED',
          attendeesEmails: applications.filter(a => ['IN_PROPOSAL', 'WITH_RFQ'].includes(a.status)).map(a => 'proveedor@demo.com') // Mock recipients
      });
      setShowSessionModal(false);
      setRefresh(prev => prev + 1);
  };

  // Build timeline based on status
  const timelineItems = [
      { date: opportunity.createdAt, title: 'Oportunidad Creada', status: 'completed' as const },
      ...applications.map(a => ({
          date: a.createdAt, 
          title: `Aplicación de ${db.getCompanyById(a.providerCompanyId)?.tradeName}`,
          description: `Estatus actual: ${a.status}`,
          status: 'active' as const
      })),
      ...sessions.map(s => ({
          date: s.scheduledAt,
          title: 'Sesión de Trabajo Agendada',
          description: 'Reunión de seguimiento',
          status: 'pending' as const
      }))
  ].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{opportunity.title}</h1>
                    <p className="text-gray-500">Folio: {opportunity.id}</p>
                </div>
                <StatusBadge status={opportunity.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                    <span className="block text-gray-500">Volumen</span>
                    <span className="font-medium">{opportunity.quantity}</span>
                </div>
                <div>
                    <span className="block text-gray-500">Deadline</span>
                    <span className="font-medium">{new Date(opportunity.applicationDeadlineAt).toLocaleDateString()}</span>
                </div>
                <div>
                    <span className="block text-gray-500">Capacidades</span>
                    <span className="font-medium">{opportunity.aiDetectedCapabilities.join(', ')}</span>
                </div>
            </div>
            <div className="mt-4 bg-gray-50 p-4 rounded text-sm text-gray-700">
                {opportunity.summary}
            </div>

            {/* Provider Actions */}
            {isProvider && !myApp && (
                <div className="mt-6">
                    <button onClick={handleApply} className="bg-claut-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-claut-700">
                        Aplicar a Oportunidad
                    </button>
                </div>
            )}
            {isProvider && myApp && (
                <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-lg">
                    Ya has aplicado. Estatus actual: <strong>{myApp.status.replace('_', ' ')}</strong>
                </div>
            )}
          </div>

          {/* Sessions List */}
          {(isBuyer || isCoord) && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-bold flex items-center">
                          <Video className="w-5 h-5 mr-2 text-gray-500" /> Sesiones de Trabajo
                      </h2>
                      <button onClick={() => setShowSessionModal(true)} className="text-sm bg-claut-100 text-claut-900 px-3 py-1 rounded font-medium">
                          + Agendar
                      </button>
                  </div>
                  {sessions.length > 0 ? (
                      <div className="space-y-3">
                          {sessions.map(s => (
                              <div key={s.id} className="flex justify-between items-center p-3 border rounded-lg">
                                  <div>
                                      <p className="font-bold text-sm">Reunión de Seguimiento</p>
                                      <p className="text-xs text-gray-500 flex items-center">
                                          <Calendar className="w-3 h-3 mr-1"/> {new Date(s.scheduledAt).toLocaleString()}
                                      </p>
                                  </div>
                                  <a href={s.zoomJoinUrl} target="_blank" rel="noreferrer" className="text-blue-600 text-sm hover:underline">
                                      Unirse a Zoom
                                  </a>
                              </div>
                          ))}
                      </div>
                  ) : <p className="text-sm text-gray-500 italic">No hay sesiones programadas.</p>}
              </div>
          )}

          {/* Pipeline Table */}
          {(isBuyer || isCoord) && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold mb-4">Pipeline de Aplicantes ({applications.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3">Proveedor</th>
                                <th className="px-4 py-3">Fecha</th>
                                <th className="px-4 py-3">Estatus</th>
                                <th className="px-4 py-3">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {applications.map(app => {
                                const provider = db.getCompanyById(app.providerCompanyId);
                                return (
                                    <tr key={app.id}>
                                        <td className="px-4 py-3 font-medium">{provider?.tradeName}</td>
                                        <td className="px-4 py-3 text-gray-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                                        <td className="px-4 py-3">
                                            <select 
                                                className="border rounded p-1 text-xs"
                                                value={app.status}
                                                onChange={(e) => handleStatusChange(app.id, e.target.value as PipelineStatus)}
                                            >
                                                {Object.values(PipelineStatus).map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Aún no hay aplicantes.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
          )}
      </div>

      {/* Sidebar: Activity Timeline */}
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-500" /> Historial
              </h3>
              <ActivityTimeline items={timelineItems} />
          </div>
      </div>

      {/* Session Modal */}
      <Modal isOpen={showSessionModal} onClose={() => setShowSessionModal(false)} title="Agendar Sesión">
          <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                  <label className="block text-sm font-medium mb-1">Fecha</label>
                  <input type="date" required className="w-full border rounded p-2" value={sessionData.date} onChange={e => setSessionData({...sessionData, date: e.target.value})} />
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1">Hora</label>
                  <input type="time" required className="w-full border rounded p-2" value={sessionData.time} onChange={e => setSessionData({...sessionData, time: e.target.value})} />
              </div>
              <div>
                  <label className="block text-sm font-medium mb-1">Link de Reunión (Zoom/Teams)</label>
                  <input type="url" required className="w-full border rounded p-2" value={sessionData.link} onChange={e => setSessionData({...sessionData, link: e.target.value})} />
              </div>
              <p className="text-xs text-gray-500">Se enviará una invitación automática a los proveedores en etapa de propuesta.</p>
              <div className="flex justify-end pt-4">
                  <button type="submit" className="bg-claut-900 text-white px-4 py-2 rounded">Confirmar</button>
              </div>
          </form>
      </Modal>
    </div>
  );
};

export default OpportunityDetail;