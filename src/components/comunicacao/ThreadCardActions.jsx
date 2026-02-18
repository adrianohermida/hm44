import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, Ticket, Archive } from 'lucide-react';

export default function ThreadCardActions({ thread, onMarkRead, onEscalate, onArchive }) {
  return (
    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white p-1 rounded shadow-lg">
      {thread.naoLida && (
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(thread);
          }}
          title="Marcar como lida"
        >
          <CheckCircle className="w-4 h-4" />
        </Button>
      )}
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onEscalate(thread);
        }}
        title="Escalar para ticket"
      >
        <Ticket className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onArchive(thread);
        }}
        title="Arquivar"
      >
        <Archive className="w-4 h-4" />
      </Button>
    </div>
  );
}