import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function EndpointExtractedList({ endpoints, onAdd }) {
  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto">
      {endpoints.map((ep, i) => (
        <div key={i} className="p-3 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-between">
          <div>
            <div className="font-medium text-sm">{ep.nome}</div>
            <div className="text-xs text-[var(--text-secondary)]">
              <Badge variant="outline" className="mr-1">{ep.metodo}</Badge>
              {ep.path}
            </div>
          </div>
          <Button size="sm" onClick={() => onAdd(ep)}>
            <Plus className="w-3 h-3 mr-1" /> Adicionar
          </Button>
        </div>
      ))}
    </div>
  );
}