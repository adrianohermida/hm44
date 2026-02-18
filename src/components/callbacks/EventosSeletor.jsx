import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

export default function EventosSeletor({ eventos, selected, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {eventos.map(evento => {
        const isSelected = selected.includes(evento);
        return (
          <Badge
            key={evento}
            variant={isSelected ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => onToggle(evento)}
          >
            {evento}
            {isSelected && <X className="w-3 h-3 ml-1" />}
          </Badge>
        );
      })}
    </div>
  );
}