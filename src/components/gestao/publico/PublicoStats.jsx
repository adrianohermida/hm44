import React from 'react';
import { Globe, Lock, TrendingUp } from 'lucide-react';

export default function PublicoStats({ configs }) {
  const publicas = configs.filter(c => c.permite_acesso_publico).length;
  const privadas = configs.filter(c => !c.permite_acesso_publico).length;
  
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow p-6">
        <Globe className="w-8 h-8 mb-2 text-green-600" />
        <div className="text-3xl font-bold">{publicas}</div>
        <div className="text-sm text-gray-600">Páginas Públicas</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <Lock className="w-8 h-8 mb-2 text-gray-600" />
        <div className="text-3xl font-bold">{privadas}</div>
        <div className="text-sm text-gray-600">Páginas Protegidas</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6">
        <TrendingUp className="w-8 h-8 mb-2 text-blue-600" />
        <div className="text-3xl font-bold">-</div>
        <div className="text-sm text-gray-600">PageSpeed Avg</div>
      </div>
    </div>
  );
}