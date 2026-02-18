import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarClock } from 'lucide-react';

export default function AudienciasLista({ audiencias }) {
  return (
    <div className="space-y-3">
      {audiencias.map((aud, idx) => (
        <Card key={idx}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CalendarClock className="w-5 h-5 text-[var(--brand-warning)]" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {new Date(aud.data).toLocaleDateString()}
                  </span>
                  <Badge>{aud.tipo || 'Audiência'}</Badge>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{aud.situacao}</p>
                {aud.local && (
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">
                    Local: {aud.local}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}