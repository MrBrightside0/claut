import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LOGO_URL } from '../constants';
import { Lock, Mail } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Credenciales inválidas.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
            <img src={LOGO_URL} alt="Logo" className="h-8 object-contain bg-claut-900 p-2 rounded" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Portal de Socios</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Corporativo</label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input 
                    type="email" 
                    required
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                <input 
                    type="password" 
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-claut-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="(Opcional en demo)"
                />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-claut-900 text-white py-2 rounded-lg hover:bg-claut-700 font-medium disabled:opacity-70">
            {loading ? 'Validando...' : 'Ingresar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm border-t pt-4">
            <span className="text-gray-500">¿Eres nuevo proveedor? </span>
            <Link to="/register" className="text-claut-900 font-bold hover:underline">
                Regístrate aquí
            </Link>
        </div>

        <div className="mt-6 text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p className="font-bold mb-1">Usuarios Demo Disponibles:</p>
            <ul className="list-disc pl-4 space-y-1">
                <li><span className="font-mono">claudia@claut.com.mx</span> (Admin)</li>
                <li><span className="font-mono">compras@kia.demo</span> (Comprador OEM)</li>
                <li><span className="font-mono">ventas@plastec.demo</span> (Proveedor Tier 2)</li>
            </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;