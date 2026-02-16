import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/mockDb';
import { Company, CompanyCategory } from '../types';
import { MapPin, Globe, CheckCircle, Shield, Factory, Mail, ArrowLeft } from 'lucide-react';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';

const PublicCompanyProfile = () => {
  const { id } = useParams();
  const [company, setCompany] = useState<Company | null>(null);
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqStep, setReqStep] = useState(1);
  const [reqData, setReqData] = useState({
      requesterName: '',
      requesterEmail: '',
      requesterCompany: '',
      title: '',
      description: ''
  });
  const [successFolio, setSuccessFolio] = useState('');

  useEffect(() => {
    const found = db.getCompanyById(id || '');
    if(found) setCompany(found);
  }, [id]);

  if (!company) return <div className="p-10 text-center">Empresa no encontrada.</div>;

  const handleSubmitRequirement = (e: React.FormEvent) => {
    e.preventDefault();
    const newReq = db.createPublicRequirement({
        ...reqData,
        targetCompanyId: company.id
    });
    setSuccessFolio(newReq.id);
    setReqStep(3);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      {/* Header / Banner */}
      <div className="bg-claut-900 h-48 relative">
        <div className="container mx-auto px-4 h-full flex items-center">
            <Link to="/catalog" className="absolute top-6 left-4 text-white/80 hover:text-white flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" /> Volver al catálogo
            </Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 -mt-16 relative z-10">
         <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{company.tradeName}</h1>
                        <Badge variant="purple">{company.category.replace('_',' ')}</Badge>
                        {company.isMemberClaut && <Badge variant="success">Socio CLAUT</Badge>}
                    </div>
                    <p className="text-gray-500 mb-4">{company.legalName}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-1"/> {company.city}, {company.state}</span>
                        {company.websiteUrl && (
                            <a href={company.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center text-blue-600 hover:underline">
                                <Globe className="w-4 h-4 mr-1"/> Website
                            </a>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-2 w-full md:w-auto">
                    <button 
                        onClick={() => setShowReqModal(true)}
                        className="bg-action-500 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition flex items-center justify-center"
                    >
                        <Mail className="w-5 h-5 mr-2" />
                        Contactar / Cotizar
                    </button>
                    <p className="text-xs text-center text-gray-400">Sin costo para solicitantes</p>
                </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2">Resumen</h2>
                        <p className="text-gray-700 leading-relaxed">{company.publicCoreSummary}</p>
                    </section>
                    
                    <section>
                        <h2 className="text-lg font-bold text-gray-900 mb-3 border-b pb-2 flex items-center">
                            <Factory className="w-5 h-5 mr-2 text-claut-500" /> Productos y Servicios
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{company.publicProductsServicesSummary || 'Información no detallada.'}</p>
                        
                        <div className="mt-4">
                            <h3 className="text-sm font-semibold text-gray-900 mb-2">Capacidades Principales</h3>
                            <div className="flex flex-wrap gap-2">
                                {company.publicCapabilities.map(cap => (
                                    <span key={cap} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                        {cap}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-claut-500" /> Certificaciones
                        </h3>
                        <ul className="space-y-2">
                            {company.publicCertifications.length > 0 ? company.publicCertifications.map(cert => (
                                <li key={cert} className="flex items-center text-sm text-gray-700">
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                    {cert}
                                </li>
                            )) : <li className="text-sm text-gray-500 italic">No registradas públicamente.</li>}
                        </ul>
                    </div>
                </div>
            </div>
         </div>
      </div>

      {/* Requirement Modal */}
      <Modal 
        isOpen={showReqModal} 
        onClose={() => setShowReqModal(false)}
        title="Enviar Requerimiento"
      >
         {reqStep === 1 && (
             <div className="space-y-4">
                 <p className="text-gray-600 text-sm">
                     Estás contactando a <strong>{company.tradeName}</strong>. 
                     Por favor ingresa tus datos básicos para iniciar la solicitud.
                 </p>
                 <div>
                     <label className="block text-sm font-medium mb-1">Tu Nombre</label>
                     <input className="w-full border rounded p-2" value={reqData.requesterName} onChange={e => setReqData({...reqData, requesterName: e.target.value})} />
                 </div>
                 <div>
                     <label className="block text-sm font-medium mb-1">Tu Email</label>
                     <input className="w-full border rounded p-2" type="email" value={reqData.requesterEmail} onChange={e => setReqData({...reqData, requesterEmail: e.target.value})} />
                 </div>
                 <div>
                     <label className="block text-sm font-medium mb-1">Empresa Solicitante</label>
                     <input className="w-full border rounded p-2" value={reqData.requesterCompany} onChange={e => setReqData({...reqData, requesterCompany: e.target.value})} />
                 </div>
                 <div className="pt-4 flex justify-end">
                     <button 
                        onClick={() => { if(reqData.requesterName && reqData.requesterEmail) setReqStep(2); }}
                        className="bg-claut-900 text-white px-4 py-2 rounded hover:bg-claut-700"
                    >
                         Siguiente
                     </button>
                 </div>
             </div>
         )}
         
         {reqStep === 2 && (
             <form onSubmit={handleSubmitRequirement} className="space-y-4">
                 <p className="text-gray-600 text-sm">Detalla tu necesidad.</p>
                 <div>
                     <label className="block text-sm font-medium mb-1">Título del Requerimiento</label>
                     <input className="w-full border rounded p-2" placeholder="Ej. Maquinado de piezas XYZ" value={reqData.title} onChange={e => setReqData({...reqData, title: e.target.value})} required />
                 </div>
                 <div>
                     <label className="block text-sm font-medium mb-1">Descripción / Especificaciones</label>
                     <textarea className="w-full border rounded p-2 h-32" placeholder="Describe material, volumen, proceso..." value={reqData.description} onChange={e => setReqData({...reqData, description: e.target.value})} required />
                 </div>
                 <div className="pt-4 flex justify-between">
                     <button type="button" onClick={() => setReqStep(1)} className="text-gray-500 underline">Atrás</button>
                     <button type="submit" className="bg-claut-900 text-white px-4 py-2 rounded hover:bg-claut-700">Enviar Solicitud</button>
                 </div>
             </form>
         )}

         {reqStep === 3 && (
             <div className="text-center py-6">
                 <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                     <CheckCircle className="w-8 h-8" />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">¡Enviado!</h3>
                 <p className="text-gray-600 mt-2">Hemos notificado a {company.tradeName} y al equipo CLAUT.</p>
                 <div className="mt-4 bg-gray-100 p-3 rounded inline-block">
                     <span className="text-xs text-gray-500 block">FOLIO DE SEGUIMIENTO</span>
                     <span className="text-lg font-mono font-bold">{successFolio}</span>
                 </div>
                 <p className="text-xs text-gray-400 mt-4">Revisa tu correo ({reqData.requesterEmail}) para confirmación.</p>
                 <button onClick={() => setShowReqModal(false)} className="mt-6 bg-gray-900 text-white px-6 py-2 rounded">Cerrar</button>
             </div>
         )}
      </Modal>
    </div>
  );
};

export default PublicCompanyProfile;