import React from 'react';
import { MapPin, FileText, Users, Video } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function EventDetailsInfo({ event }) {
  const modalidadeColors = {
    presencial: 'bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]',
    videoconferencia: 'bg-[var(--brand-info)]/10 text-[var(--brand-info)]',
    hibrida: 'bg-[var(--brand-warning)]/10 text-[var(--brand-warning)]'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
            Detalhes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {event.tipo && (
            <div>
              <p className="text-sm text-[var(--text-secondary)] mb-1">Tipo</p>
              <Badge className="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]">
                {event.tipo}
              </Badge>
            </div>
          )}

          {event.local && (
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[var(--text-secondary)] mt-0.5" />
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Local</p>
                <p className="text-[var(--text-primary)]">{event.local}</p>
              </div>
            </div>
          )}

          {event.modalidade && (
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-[var(--text-secondary)] mt-0.5" />
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">Modalidade</p>
                <Badge className={modalidadeColors[event.modalidade]}>
                  {event.modalidade}
                </Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}