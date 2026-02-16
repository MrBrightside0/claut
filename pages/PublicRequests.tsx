import React, { useState, useEffect } from 'react';
import { db } from '../services/mockDb';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import Badge from '../components/ui/Badge';
import { Mail, ArrowRight, Archive } from 'lucide-react';

const PublicRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState(db.getPublicRequirements());
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    setRequests(db.getPublicRequirements());
  }, [refresh]);

  if (!user || user.role !== UserRole.COORDINADOR_CLAUT) return <div className="p-8">Acceso Restringido</div>;

  const handleStatusChange = (id: string, status: 'PROCESSED' | 'CLOSED') => {
      db.updatePublicRequirementStatus(id, status);
      setRefresh(prev => prev + 1);
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Bandeja de Requerimientos Públicos</h1>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
            <span className="text-sm text-gray-500">Pendientes: </span>
            <span className="font-bold text-red-600">{requests.filter(r => r.status === 'NEW').length}</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
                <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Folio / Fecha</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Solicitante</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Destino (Socio)</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Detalle</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estatus</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {requests.map(req => {
                    const target = db.getCompanyById(req.targetCompanyId);
                    return (
                        <tr key={req.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <p className="font-mono text-xs font-bold">{req.id}</p>
                                <p className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</p>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col">
                                    <span className="font-medium text-sm">{req.requesterCompany}</span>
                                    <span className="text-xs text-gray-500">{req.requesterName}</span>
                                    <span className="text-xs text-blue-500 flex items-center gap-1">
                                        <Mail className="w-3 h-3"/> {req.requesterEmail}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm">
                                {target?.tradeName || 'Desconocido'}
                            </td>
                            <td className="px-6 py-4">
                                <p className="font-bold text-sm">{req.title}</p>
                                <p className="text-xs text-gray-500 truncate w-48">{req.description}</p>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant={req.status === 'NEW' ? 'danger' : req.status === 'PROCESSED' ? 'success' : 'default'}>
                                    {req.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    {req.status === 'NEW' && (
                                        <button 
                                            onClick={() => handleStatusChange(req.id, 'PROCESSED')}
                                            className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 hover:bg-green-100"
                                            title="Marcar como vinculado"
                                        >
                                            <ArrowRight className="w-4 h-4"/>
                                        </button>
                                    )}
                                    {req.status !== 'CLOSED' && (
                                        <button 
                                            onClick={() => handleStatusChange(req.id, 'CLOSED')}
                                            className="text-xs bg-gray-50 text-gray-700 px-2 py-1 rounded border border-gray-200 hover:bg-gray-100"
                                            title="Archivar / Cerrar"
                                        >
                                            <Archive className="w-4 h-4"/>
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
                {requests.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-8 text-gray-500">No hay requerimientos.</td></tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default PublicRequests;