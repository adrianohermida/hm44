import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export default function ThreadCardBadges({ thread }) {
  return (
    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
      {thread.isVisitante && <Badge variant="outline" className="text-[10px] px-1.5 py-0">Visitante</Badge>}
      {thread.prioridade === 'urgente' && (
        <Badge className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0">
          <AlertCircle className="w-2.5 h-2.5 mr-0.5" />Urgente
        </Badge>
      )}
    </div>
  );
}