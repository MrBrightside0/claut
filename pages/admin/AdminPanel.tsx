import React from 'react';
import { db } from '../../services/mockDb';
import { useAuth } from '../../context/AuthContext';
import { RefreshCw, Trash2, Mail, Users } from 'lucide-react';
import Badge from '../../components/ui/Badge';

const AdminPanel = () => {
  const { user } = useAuth();
  const logs = db.getEmailLogs();

  const handleReset = () => {
    if(confirm("¿Restaurar datos de fábrica? Se borrarán los cambios actuales.")) {
        db.resetDemoData();
        window.location.reload();
    }
  };

  if(!user || !['SUPERADMIN_CLAUT', 'COORDINADOR_CLAUT'].includes(user.role)) return <div>Acceso Denegado</div>;

  return (
    <div className="space-y-8">
        <h1 className="text-2xl font-bold text-gray-900">Panel de Control (Demo)</h1>
        
        {/* Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Configuración de la Demo</h2>
            <div className="flex gap-4">
                <button onClick={handleReset} className="flex items-center bg-red-50 text-red-700 px-4 py-2 rounded border border-red-200 hover:bg-red-100">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Data (Seed)
                </button>
                <div className="px-4 py-2 bg-blue-50 text-blue-800 rounded border border-blue-200">
                    Modo: <strong>Fase 1 (Solo Socios)</strong>
                </div>
            </div>
        </div>

        {/* Email Simulator Logs */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-gray-500" />
                Simulador de Correos Enviados ({logs.length})
            </h2>
            <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-4 py-2">Hora</th>
                            <th className="px-4 py-2">Para</th>
                            <th className="px-4 py-2">Asunto</th>
                            <th className="px-4 py-2">Preview</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {logs.map(log => (
                            <tr key={log.id}>
                                <td className="px-4 py-2 text-gray-500 text-xs">{new Date(log.sentAt).toLocaleTimeString()}</td>
                                <td className="px-4 py-2 font-medium">{log.to.join(', ')}</td>
                                <td className="px-4 py-2">{log.subject}</td>
                                <td className="px-4 py-2 text-gray-500 truncate max-w-xs">{log.bodyPreview}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Users Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h2 className="text-lg font-bold mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-gray-500" /> Usuarios Demo Activos
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {db.users.map(u => (
                     <div key={u.id} className="p-3 border rounded bg-gray-50 flex flex-col">
                         <span className="font-bold text-gray-900">{u.name}</span>
                         <span className="text-xs text-gray-500">{u.email}</span>
                         <div className="mt-2">
                            <Badge>{u.role}</Badge>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    </div>
  );
};

export default AdminPanel;