import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/mockDb';
import { Company, CompanyCategory, ContactType } from '../types';
import { AVAILABLE_CAPABILITIES, AVAILABLE_CERTIFICATIONS } from '../constants';
import { Building2, Save, Globe, MapPin, ShieldCheck, Factory, Users, Phone, Mail } from 'lucide-react';

const CompanyProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [company, setCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<'general' | 'offer' | 'technical' | 'contacts'>('general');

  useEffect(() => {
    if (user && user.companyId) {
      const data = db.getCompanyById(user.companyId);
      if (data) setCompany(data);
    }
  }, [user]);

  if (!user || !company) return <div className="p-8">Cargando perfil...</div>;

  const handleChange = (field: keyof Company, value: any) => {
    setCompany(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleContactChange = (index: number, field: 'name' | 'email' | 'phone', value: string) => {
    if (!company) return;
    const updatedContacts = [...company.contacts];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setCompany({ ...company, contacts: updatedContacts });
  };

  const toggleArrayItem = (field: 'publicCapabilities' | 'publicCertifications', item: string) => {
    if (!company) return;
    const currentList = company[field];
    const newList = currentList.includes(item)
      ? currentList.filter(i => i !== item)
      : [...currentList, item];
    handleChange(field, newList);
  };

  const handleSave = async () => {
    setLoading(true);
    setSuccessMsg('');
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 800));
    
    if (company) {
      db.updateCompany(company.id, company);
      // Re-fetch to get updated completeness
      const updated = db.getCompanyById(company.id);
      if(updated) setCompany(updated);
      setSuccessMsg('Perfil actualizado correctamente.');
    }
    setLoading(false);
  };

  // --- Sub-components for Tabs ---

  const TabGeneral = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
          <input 
            type="text" 
            className="w-full border rounded-lg px-3 py-2"
            value={company.legalName}
            onChange={(e) => handleChange('legalName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial</label>
          <input 
            type="text" 
            className="w-full border rounded-lg px-3 py-2"
            value={company.tradeName}
            onChange={(e) => handleChange('tradeName', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select 
            className="w-full border rounded-lg px-3 py-2 bg-white"
            value={company.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {Object.values(CompanyCategory).map(c => (
              <option key={c} value={c}>{(c as string).replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sitio Web</label>
          <div className="flex">
             <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">https://</span>
             <input 
                type="text" 
                className="flex-1 border rounded-r-lg px-3 py-2"
                value={company.websiteUrl || ''}
                onChange={(e) => handleChange('websiteUrl', e.target.value)}
              />
          </div>
        </div>
      </div>
      
      <div className="border-t pt-4">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center"><MapPin className="w-4 h-4 mr-2"/> Ubicación</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
            <input type="text" className="w-full border rounded-lg px-3 py-2 bg-gray-100" value={company.country} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <input 
              type="text" 
              className="w-full border rounded-lg px-3 py-2"
              value={company.state}
              onChange={(e) => handleChange('state', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <input 
              type="text" 
              className="w-full border rounded-lg px-3 py-2"
              value={company.city}
              onChange={(e) => handleChange('city', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const TabOffer = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Resumen Principal (Core Business)</label>
        <p className="text-xs text-gray-500 mb-2">Máximo 280 caracteres. Esto se muestra en las tarjetas de búsqueda.</p>
        <textarea 
          className="w-full border rounded-lg px-3 py-2 h-20"
          maxLength={280}
          value={company.publicCoreSummary || ''}
          onChange={(e) => handleChange('publicCoreSummary', e.target.value)}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Productos y Servicios</label>
        <textarea 
          className="w-full border rounded-lg px-3 py-2 h-24"
          value={company.publicProductsServicesSummary || ''}
          onChange={(e) => handleChange('publicProductsServicesSummary', e.target.value)}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
           <h3 className="font-semibold text-gray-900 mb-2 flex items-center"><Factory className="w-4 h-4 mr-2"/> Capacidades (Procesos)</h3>
           <div className="bg-gray-50 p-4 rounded-lg border h-60 overflow-y-auto">
             {AVAILABLE_CAPABILITIES.map(cap => (
               <label key={cap} className="flex items-center space-x-2 mb-2 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={company.publicCapabilities.includes(cap)}
                   onChange={() => toggleArrayItem('publicCapabilities', cap)}
                   className="rounded text-claut-900 focus:ring-claut-500"
                 />
                 <span className="text-sm text-gray-700">{cap}</span>
               </label>
             ))}
           </div>
        </div>

        <div>
           <h3 className="font-semibold text-gray-900 mb-2 flex items-center"><ShieldCheck className="w-4 h-4 mr-2"/> Certificaciones</h3>
           <div className="bg-gray-50 p-4 rounded-lg border h-60 overflow-y-auto">
             {AVAILABLE_CERTIFICATIONS.map(cert => (
               <label key={cert} className="flex items-center space-x-2 mb-2 cursor-pointer">
                 <input 
                   type="checkbox" 
                   checked={company.publicCertifications.includes(cert)}
                   onChange={() => toggleArrayItem('publicCertifications', cert)}
                   className="rounded text-claut-900 focus:ring-claut-500"
                 />
                 <span className="text-sm text-gray-700">{cert}</span>
               </label>
             ))}
           </div>
        </div>
      </div>
    </div>
  );

  const TabTechnical = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p className="text-sm text-yellow-700">Esta información es privada y solo visible para Compradores verificados del CLAUT.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Rango de Empleados</label>
           <select 
             className="w-full border rounded-lg px-3 py-2 bg-white"
             value={company.employeesRange || ''}
             onChange={(e) => handleChange('employeesRange', e.target.value)}
           >
             <option value="">Seleccionar...</option>
             <option value="1-10">1-10</option>
             <option value="11-50">11-50</option>
             <option value="51-200">51-200</option>
             <option value="201-500">201-500</option>
             <option value="501-1000">501-1000</option>
             <option value="1000+">1000+</option>
           </select>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Mercados de Exportación</label>
           <input 
              type="text" 
              placeholder="Ej. USA, Canadá, Alemania..."
              className="w-full border rounded-lg px-3 py-2"
              value={company.exportMarkets?.join(', ') || ''}
              onChange={(e) => handleChange('exportMarkets', e.target.value.split(',').map(s => s.trim()))}
            />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Maquinaria y Equipo (Listado Principal)</label>
        <textarea 
          className="w-full border rounded-lg px-3 py-2 h-24"
          placeholder="Ej. 5 Prensas hidráulicas 500T, 2 Centros de maquinado Mazak..."
          value={company.machineryEquipment || ''}
          onChange={(e) => handleChange('machineryEquipment', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Detalle de Procesos</label>
        <textarea 
          className="w-full border rounded-lg px-3 py-2 h-24"
          placeholder="Descripción técnica de sus procesos principales..."
          value={company.processes || ''}
          onChange={(e) => handleChange('processes', e.target.value)}
        />
      </div>
    </div>
  );

  const TabContacts = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">Define quién recibe las notificaciones del sistema.</p>
      
      {company.contacts.map((contact, idx) => (
        <div key={contact.id} className="bg-white border rounded-lg p-4 shadow-sm">
          <div className="flex items-center mb-3">
             <span className={`px-2 py-1 rounded text-xs font-bold uppercase mr-3 ${
               contact.type === ContactType.PROCUREMENT ? 'bg-purple-100 text-purple-800' :
               contact.type === ContactType.SALES ? 'bg-green-100 text-green-800' :
               'bg-gray-100 text-gray-800'
             }`}>
               {contact.type.replace('_', ' ')}
             </span>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
             <div>
                <label className="text-xs text-gray-500">Nombre</label>
                <div className="relative">
                   <Users className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                   <input 
                     type="text" 
                     className="w-full border rounded pl-8 p-2 text-sm"
                     value={contact.name}
                     onChange={(e) => handleContactChange(idx, 'name', e.target.value)}
                   />
                </div>
             </div>
             <div>
                <label className="text-xs text-gray-500">Email</label>
                <div className="relative">
                   <Mail className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                   <input 
                     type="email" 
                     className="w-full border rounded pl-8 p-2 text-sm"
                     value={contact.email}
                     onChange={(e) => handleContactChange(idx, 'email', e.target.value)}
                   />
                </div>
             </div>
             <div>
                <label className="text-xs text-gray-500">Teléfono</label>
                <div className="relative">
                   <Phone className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                   <input 
                     type="text" 
                     className="w-full border rounded pl-8 p-2 text-sm"
                     value={contact.phone || ''}
                     onChange={(e) => handleContactChange(idx, 'phone', e.target.value)}
                   />
                </div>
             </div>
          </div>
        </div>
      ))}

      {company.contacts.length === 0 && (
         <div className="text-center text-gray-500 py-8">
            No hay contactos asignados. Contacta al administrador del CLAUT para agregar usuarios.
         </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header Profile */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
         <div>
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-bold text-gray-900">{company.tradeName}</h1>
               <span className="bg-claut-100 text-claut-900 text-xs px-2 py-1 rounded font-bold">
                 {company.category}
               </span>
            </div>
            <p className="text-gray-500 text-sm mt-1">{company.legalName}</p>
         </div>
         
         <div className="mt-4 md:mt-0 w-full md:w-64">
            <div className="flex justify-between text-sm mb-1">
               <span className="text-gray-600">Nivel de Completitud</span>
               <span className="font-bold text-claut-900">{Math.round(company.profileCompletenessPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
               <div 
                 className={`h-2.5 rounded-full ${company.profileCompletenessPercent >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                 style={{ width: `${company.profileCompletenessPercent}%` }}
               ></div>
            </div>
            {company.profileCompletenessPercent < 80 && (
               <p className="text-xs text-red-500 mt-1">Completa tu perfil para mejor visibilidad.</p>
            )}
         </div>
      </div>

      {/* Tabs & Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="border-b flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab('general')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === 'general' ? 'border-claut-900 text-claut-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Globe className="w-4 h-4 inline-block mr-2" />
              Datos Generales
            </button>
            <button 
              onClick={() => setActiveTab('offer')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === 'offer' ? 'border-claut-900 text-claut-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Building2 className="w-4 h-4 inline-block mr-2" />
              Oferta Pública
            </button>
            <button 
              onClick={() => setActiveTab('technical')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === 'technical' ? 'border-claut-900 text-claut-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Factory className="w-4 h-4 inline-block mr-2" />
              Ficha Técnica (Privada)
            </button>
            <button 
              onClick={() => setActiveTab('contacts')}
              className={`px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition ${activeTab === 'contacts' ? 'border-claut-900 text-claut-900' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              <Users className="w-4 h-4 inline-block mr-2" />
              Contactos
            </button>
         </div>

         <div className="p-6">
            {activeTab === 'general' && <TabGeneral />}
            {activeTab === 'offer' && <TabOffer />}
            {activeTab === 'technical' && <TabTechnical />}
            {activeTab === 'contacts' && <TabContacts />}
         </div>

         <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
            {successMsg ? <span className="text-green-600 font-medium text-sm">{successMsg}</span> : <span></span>}
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex items-center bg-claut-900 text-white px-6 py-2 rounded-lg hover:bg-claut-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
         </div>
      </div>
    </div>
  );
};

export default CompanyProfile;