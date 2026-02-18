import React from 'react';
import { FileText, CheckCircle, Pause, Archive } from 'lucide-react';

export default function ProcessoClienteStats({ processos, processosPrincipais }) {
  const stats = {
    total: processos.length,
    principais: processosPrincipais.length,
    apensos: processos.length - processosPrincipais.length,
    ativo: processos.filter(p => p.status === 'ativo').length,
    suspenso: processos.filter(p => p.status === 'suspenso').length,
    arquivado: processos.filter(p => p.status === 'arquivado').length
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="bg-[var(--brand-primary-50)] rounded-lg p-3 border border-[var(--brand-primary-200)]">
        <FileText className="w-5 h-5 text-[var(--brand-primary)] mb-1" />
        <p className="text-2xl font-bold text-[var(--brand-primary-700)]">{stats.principais}</p>
        <p className="text-xs text-[var(--brand-primary-600)]">Principais</p>
      </div>
      <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
        <FileText className="w-5 h-5 text-purple-600 mb-1" />
        <p className="text-2xl font-bold text-purple-700">{stats.apensos}</p>
        <p className="text-xs text-purple-600">Apensos</p>
      </div>
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <CheckCircle className="w-5 h-5 text-green-600 mb-1" />
        <p className="text-2xl font-bold text-green-700">{stats.ativo}</p>
        <p className="text-xs text-green-600">Ativos</p>
      </div>
      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
        <Archive className="w-5 h-5 text-gray-600 mb-1" />
        <p className="text-2xl font-bold text-gray-700">{stats.total}</p>
        <p className="text-xs text-gray-600">Total</p>
      </div>
    </div>
  );
}