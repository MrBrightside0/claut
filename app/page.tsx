"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, BrainCircuit, ArrowRight, Briefcase } from 'lucide-react';
import { LOGO_URL } from '@/constants';

export default function Home() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(query.trim()) {
        router.push(`/catalog?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header Inline (or move to component) */}
      <header className="bg-claut-900 text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <Link href="/">
              <img src={LOGO_URL} alt="CLAUT Link" className="h-10 object-contain" />
            </Link>
            <nav className="hidden md:flex space-x-6 items-center">
              <Link href="/catalog" className="hover:text-claut-100 transition">Catálogo Público</Link>
              <Link href="/login" className="bg-white text-claut-900 px-4 py-2 rounded font-medium hover:bg-gray-100 transition">
                Acceso Socios
              </Link>
            </nav>
          </div>
      </header>

      <main className="flex-grow flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-claut-900 to-claut-700 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Conectando la Industria Automotriz</h1>
        <p className="text-lg md:text-xl text-claut-100 mb-10 max-w-2xl mx-auto">
          La plataforma oficial del CLAUT para encontrar proveedores confiables, publicar requerimientos y generar nuevas oportunidades de negocio.
        </p>

        <form onSubmit={handleSearch} className="max-w-xl mx-auto relative flex items-center mb-8">
          <Search className="absolute left-4 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="¿Qué producto o servicio buscas?" 
            className="w-full pl-12 pr-4 py-4 rounded-full text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-action-500 transition"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-2 bg-action-500 hover:bg-red-700 text-white p-2.5 rounded-full transition">
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/catalog" className="bg-white/10 backdrop-blur border border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-claut-900 transition flex items-center justify-center">
            Ver Catálogo Completo
          </Link>
          <Link href="/catalog?mode=ai" className="bg-white text-claut-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center shadow-lg">
            <BrainCircuit className="w-5 h-5 mr-2 text-action-500" />
            Búsqueda Inteligente IA
          </Link>
        </div>
      </section>

      {/* Value Prop */}
      <section className="container mx-auto py-16 px-6 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Visibilidad Total</h3>
          <p className="text-gray-600">Encuentra proveedores Tier 1, Tier 2 y servicios especializados validados por el cluster.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="w-12 h-12 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Matching con IA</h3>
          <p className="text-gray-600">Nuestra IA analiza tus requerimientos y te sugiere los mejores candidatos automáticamente.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center hover:shadow-md transition">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold mb-2">Gestión de Oportunidades</h3>
          <p className="text-gray-600">Publica oportunidades, recibe aplicaciones y gestiona el seguimiento hasta la orden de compra.</p>
        </div>
      </section>
      </main>
    </div>
  );
}