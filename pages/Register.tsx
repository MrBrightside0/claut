import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LOGO_URL } from '../constants';
import { db } from '../services/mockDb';
import { CompanyCategory } from '../types';
import { Building2, User as UserIcon, Lock, Mail, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: User, 2: Company, 3: Success
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    tradeName: '',
    legalName: '',
    category: CompanyCategory.TIER_II,
    state: '',
    city: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 1) {
        if (!formData.name || !formData.email || !formData.password) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('las contraseñas no coinciden.');
            return;
        }
        setStep(2);
    } else if (step === 2) {
        if (!formData.tradeName || !formData.legalName || !formData.state || !formData.city) {
            setError('Todos los campos de la empresa son obligatorios.');
            return;
        }
        
        try {
            db.register(
                { name: formData.name, email: formData.email, passwordHash: formData.password },
                { 
                    tradeName: formData.tradeName, 
                    legalName: formData.legalName, 
                    category: formData.category, 
                    state: formData.state, 
                    city: formData.city 
                }
            );
            setStep(3);
        } catch (err: any) {
            setError(err.message || 'Error al registrar.');
        }
    }
  };

  if (step === 3) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserIcon className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud Recibida!</h2>
                <p className="text-gray-600 mb-6">
                    Tu registro ha sido enviado al equipo de CLAUT. 
                    Una vez validada tu información, recibirás un correo de confirmación para acceder a la plataforma.
                </p>
                <Link to="/login" className="block w-full bg-claut-900 text-white py-2 rounded-lg hover:bg-claut-700 font-medium">
                    Volver al Login
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex justify-center mb-6">
            <img src={LOGO_URL} alt="Logo" className="h-8 object-contain bg-claut-900 p-2 rounded" />
        </div>
        
        <div className="flex items-center justify-center mb-8">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 1 ? 'bg-claut-900 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`w-16 h-1 bg-gray-200 mx-2 ${step >= 2 ? 'bg-claut-900' : ''}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= 2 ? 'bg-claut-900 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">
            {step === 1 ? 'Datos del Administrador' : 'Información de la Empresa'}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">Solicitud de adhesión al catálogo CLAUT</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleNext} className="space-y-4">
          {step === 1 && (
              <>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" required
                            className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                            value={formData.name} onChange={(e) => handleChange('name', e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input 
                            type="email" required
                            className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                            value={formData.email} onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input 
                                type="password" required
                                className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                                value={formData.password} onChange={(e) => handleChange('password', e.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                            <input 
                                type="password" required
                                className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                                value={formData.confirmPassword} onChange={(e) => handleChange('confirmPassword', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
              </>
          )}

          {step === 2 && (
              <>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Comercial</label>
                    <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" required
                            className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                            value={formData.tradeName} onChange={(e) => handleChange('tradeName', e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
                    <input 
                        type="text" required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                        value={formData.legalName} onChange={(e) => handleChange('legalName', e.target.value)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                    <select 
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500 bg-white"
                        value={formData.category} onChange={(e) => handleChange('category', e.target.value)}
                    >
                        {Object.values(CompanyCategory).map(c => (
                            <option key={c} value={c}>{(c as string).replace(/_/g, ' ')}</option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                        <input 
                            type="text" required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                            value={formData.state} onChange={(e) => handleChange('state', e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                        <input 
                            type="text" required
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                            value={formData.city} onChange={(e) => handleChange('city', e.target.value)}
                        />
                    </div>
                </div>
              </>
          )}

          <div className="flex justify-between pt-4 gap-4">
            {step === 2 && (
                <button type="button" onClick={() => setStep(1)} className="w-1/3 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 font-medium">
                    Atrás
                </button>
            )}
            <button type="submit" className="flex-1 bg-claut-900 text-white py-2 rounded-lg hover:bg-claut-700 font-medium flex items-center justify-center">
                {step === 1 ? 'Siguiente' : 'Enviar Solicitud'}
                <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta? <Link to="/login" className="text-claut-900 font-bold hover:underline">Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;