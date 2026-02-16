import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../services/mockDb';
import { Company } from '../types';
import { BrainCircuit, Search, MapPin } from 'lucide-react';
import { getGeminiMatches, calculateLocalMatchScore } from '../services/geminiService';
import Badge from '../components/ui/Badge';

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'standard' | 'ai'>('standard');
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [aiApiKey, setAiApiKey] = useState('');
  const [matchResults, setMatchResults] = useState<Record<string, {score: number, reason: string}>>({});

  useEffect(() => {
    setCompanies(db.getCompanies().filter(c => c.isActive));
    if(searchParams.get('mode') === 'ai') setSearchMode('ai');
  }, [searchParams]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (searchMode === 'ai') {
        // AI Logic
        let matches = [];
        if (aiApiKey) {
            matches = await getGeminiMatches(query, db.getCompanies(), aiApiKey);
        } else {
            // Local fallback
            matches = db.getCompanies().map(c => ({
                companyId: c.id,
                score: calculateLocalMatchScore(query, c),
                reason: "Coincidencia de palabras clave (Modo Demo)"
            })).filter(m => m.score > 0).sort((a,b) => b.score - a.score);
        }
        
        const resultsMap: Record<string, any> = {};
        matches.forEach(m => { resultsMap[m.companyId] = m; });
        setMatchResults(resultsMap);
        
        const sorted = db.getCompanies()
            .filter(c => resultsMap[c.id])
            .sort((a,b) => resultsMap[b.id].score - resultsMap[a.id].score);
        setCompanies(sorted);
    } else {
        // Standard Filter
        const lower = query.toLowerCase();
        const filtered = db.getCompanies().filter(c => 
            c.tradeName.toLowerCase().includes(lower) || 
            c.publicCoreSummary?.toLowerCase().includes(lower) ||
            c.publicCapabilities.some(cap => cap.toLowerCase().includes(lower))
        );
        setCompanies(filtered);
        setMatchResults({});
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-claut-900 mb-6">Catálogo de Proveedores</h1>

      {/* Search Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex space-x-4 mb-4">
            <button 
                onClick={() => setSearchMode('standard')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${searchMode === 'standard' ? 'bg-claut-100 text-claut-900' : 'text-gray-500'}`}
            >
                Búsqueda Estándar
            </button>
            <button 
                onClick={() => setSearchMode('ai')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${searchMode === 'ai' ? 'bg-purple-100 text-purple-900' : 'text-gray-500'}`}
            >
                <BrainCircuit className="w-4 h-4 mr-2" />
                Búsqueda con IA
            </button>
        </div>

        <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                    <input 
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-claut-500 focus:outline-none"
                        placeholder={searchMode === 'ai' ? "Describe tu requerimiento (ej. 'Piezas de aluminio fundido para motor')" : "Buscar por nombre, capacidad..."}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading} className="bg-claut-900 text-white px-8 py-3 rounded-lg hover:bg-claut-700 transition disabled:opacity-50">
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>
            
            {searchMode === 'ai' && (
                <div className="flex items-center text-sm text-gray-500 gap-2">
                    <span>API Key (Opcional):</span>
                    <input 
                        type="password" 
                        className="border border-gray-300 rounded px-2 py-1 w-64 text-xs"
                        placeholder="Pegar Google Gemini API Key aquí para usar IA real"
                        value={aiApiKey}
                        onChange={(e) => setAiApiKey(e.target.value)}
                    />
                </div>
            )}
        </form>
      </div>

      {/* Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map(company => (
            <div key={company.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{company.tradeName}</h3>
                        <Badge variant="outline">{company.category.replace('_', ' ')}</Badge>
                    </div>
                    {matchResults[company.id] && (
                        <div className="flex flex-col items-end">
                            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                                <BrainCircuit className="w-3 h-3 mr-1" />
                                {Math.round(matchResults[company.id].score)}%
                            </span>
                        </div>
                    )}
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{company.publicCoreSummary}</p>

                <div className="flex items-center text-gray-500 text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {company.city}, {company.state}
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 mb-6">
                    {company.publicCapabilities.slice(0, 3).map(cap => (
                        <span key={cap} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                            {cap}
                        </span>
                    ))}
                    {company.publicCapabilities.length > 3 && (
                        <span className="text-xs text-gray-400 py-1">+ {company.publicCapabilities.length - 3}</span>
                    )}
                </div>

                <div className="flex gap-2 mt-auto">
                    <Link to={`/company/${company.id}`} className="flex-1 bg-white border border-claut-900 text-claut-900 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 text-center">
                        Ver Perfil
                    </Link>
                    <Link to={`/company/${company.id}`} className="flex-1 bg-claut-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-claut-700 text-center">
                        Contactar
                    </Link>
                </div>
            </div>
        ))}

        {companies.length === 0 && !loading && (
            <div className="col-span-full text-center py-12 text-gray-500">
                No se encontraron proveedores con los criterios actuales.
            </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;