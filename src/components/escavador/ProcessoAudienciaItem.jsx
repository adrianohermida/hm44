import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users } from 'lucide-react';

export default function ProcessoAudienciaItem({ audiencia }) {
  const statusColor = {
    'Realizada': 'bg-green-100 text-green-800',
    'Agendada': 'bg-blue-100 text-blue-800',
    'Cancelada': 'bg-red-100 text-red-800',
    'Adiada': 'bg-yellow-100 text-yellow-800'
  };

  return (
    <div className="p-3 bg-[var(--brand-bg-secondary)] rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--brand-primary)]" />
          <span className="text-sm font-semibold text-[var(--brand-text-primary)]">
            {format(new Date(audiencia.data_audiencia), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </span>
        </div>
        <Badge className={statusColor[audiencia.situacao] || 'bg-gray-100 text-gray-800'}>
          {audiencia.situacao}
        </Badge>
      </div>
      {audiencia.tipo_audiencia && (
        <p className="text-xs text-[var(--brand-text-secondary)] mb-1">{audiencia.tipo_audiencia}</p>
      )}
      {audiencia.numero_pessoas > 0 && (
        <div className="flex items-center gap-1 text-xs text-[var(--brand-text-tertiary)]">
          <Users className="w-3 h-3" />
          {audiencia.numero_pessoas} pessoa(s)
        </div>
      )}
    </div>
  );
}