import React from 'react';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function EventDetailsHeader({ event }) {
  return (
    <div className="mb-6">
      <Link to={createPageUrl('AgendaSemanal')}>
        <Button variant="ghost" size="sm" className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </Link>

      <div className="bg-[var(--bg-elevated)] rounded-xl p-6 border border-[var(--border-primary)]">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-4">
          {event.titulo || event.summary}
        </h1>

        <div className="flex flex-wrap gap-4 text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--brand-primary)]" />
            <span>{format(new Date(event.data_hora), "d 'de' MMMM, yyyy", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[var(--brand-primary)]" />
            <span>{format(new Date(event.data_hora), 'HH:mm', { locale: ptBR })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}