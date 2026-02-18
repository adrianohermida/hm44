import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function CampanhaCard({ campanha }) {
  const statusColors = {
    rascunho: 'bg-gray-100 text-gray-800',
    enviada: 'bg-green-100 text-green-800',
    agendada: 'bg-blue-100 text-blue-800',
    em_envio: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-[var(--text-primary)]">{campanha.titulo}</h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{campanha.assunto}</p>
        </div>
        <Badge className={statusColors[campanha.status]}>
          {campanha.status}
        </Badge>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Mail className="w-4 h-4" />
          <span>{campanha.destinatarios_count || 0} destinatários</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(campanha.created_date), 'dd/MM/yyyy HH:mm')}</span>
        </div>
        {campanha.enviados_count > 0 && (
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <Users className="w-4 h-4" />
            <span>{campanha.enviados_count} enviados</span>
          </div>
        )}
      </div>
    </Card>
  );
}