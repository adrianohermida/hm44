import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import AudienciaItem from '../items/AudienciaItem';

export default function AudienciasList({ audiencias }) {
  if (!audiencias || audiencias.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        Nenhuma audiência registrada
      </div>
    );
  }

  return (
    <ScrollArea className="h-[50vh] pr-4">
      <div className="space-y-3">
        {audiencias.map((aud, idx) => (
          <AudienciaItem key={idx} audiencia={aud} />
        ))}
      </div>
    </ScrollArea>
  );
}