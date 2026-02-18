import React from 'react';
import RelatorioItem from './RelatorioItem';
import { TrendingUp, Users, FileText, DollarSign, Calendar, MessageSquare, Clock } from 'lucide-react';

const reports = [
  { id: 'conversoes', label: 'Conversões', icon: TrendingUp },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'processos', label: 'Processos', icon: FileText },
  { id: 'financeiro', label: 'Financeiro', icon: DollarSign },
  { id: 'consultas', label: 'Consultas', icon: Calendar },
  { id: 'prazos', label: 'Prazos', icon: Clock },
  { id: 'comunicacao', label: 'Comunicação', icon: MessageSquare },
];

export default function RelatoriosList({ selected, onSelect }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[var(--border-primary)]">
        <h2 className="font-semibold text-[var(--text-primary)] text-lg">Categorias</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {reports.map(report => (
          <RelatorioItem
            key={report.id}
            report={report}
            isSelected={selected === report.id}
            onClick={() => onSelect(report.id)}
          />
        ))}
      </div>
    </div>
  );
}