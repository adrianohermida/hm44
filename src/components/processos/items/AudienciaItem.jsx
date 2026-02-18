import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin } from 'lucide-react';

export default function AudienciaItem({ audiencia }) {
  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[var(--brand-primary)]" />
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {audiencia.data ? new Date(audiencia.data).toLocaleDateString('pt-BR') : 'Data não informada'}
          </span>
        </div>
        {audiencia.tipo && (
          <Badge variant="outline" className="text-xs">{audiencia.tipo}</Badge>
        )}
      </div>
      {audiencia.local && (
        <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)] mb-1">
          <MapPin className="w-3 h-3" />
          {audiencia.local}
        </div>
      )}
      <p className="text-sm text-[var(--text-secondary)]">
        {audiencia.descricao || 'Sem descrição'}
      </p>
    </Card>
  );
}