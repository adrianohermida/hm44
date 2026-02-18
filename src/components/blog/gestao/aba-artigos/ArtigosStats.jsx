import React from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function ArtigosStats({ artigos = [] }) {
  const stats = React.useMemo(() => {
    const total = artigos.length;
    const publicados = artigos.filter(a => a.status === 'publicado').length;
    const agendados = artigos.filter(a => a.status === 'agendado').length;
    const rascunhos = artigos.filter(a => a.status === 'rascunho').length;
    
    return [
      { label: 'Total', value: total, icon: FileText, bg: 'bg-blue-50', text: 'text-blue-600' },
      { label: 'Publicados', value: publicados, icon: CheckCircle2, bg: 'bg-green-50', text: 'text-green-600' },
      { label: 'Agendados', value: agendados, icon: Clock, bg: 'bg-amber-50', text: 'text-amber-600' },
      { label: 'Rascunhos', value: rascunhos, icon: AlertCircle, bg: 'bg-gray-50', text: 'text-gray-600' }
    ];
  }, [artigos]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.text}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}