import React from 'react';
import { Edit, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EventActions({ event, onEdit, onDelete, onComplete }) {
  const canEdit = event.status !== 'cancelada' && event.status !== 'realizada';
  const canComplete = event.status === 'agendada' || event.status === 'confirmada';
  const canDelete = event.status !== 'realizada';

  return (
    <div className="flex flex-wrap gap-3">
      {canEdit && (
        <Button 
          onClick={() => onEdit(event)}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
        >
          <Edit className="w-4 h-4 mr-2" />
          Editar
        </Button>
      )}

      {canComplete && (
        <Button 
          onClick={() => onComplete(event)}
          variant="outline"
          className="border-[var(--brand-success)] text-[var(--brand-success)] hover:bg-[var(--brand-success)]/10"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Marcar como Realizada
        </Button>
      )}

      {canDelete && (
        <Button 
          onClick={() => onDelete(event)}
          variant="outline"
          className="border-[var(--brand-error)] text-[var(--brand-error)] hover:bg-[var(--brand-error)]/10"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
      )}
    </div>
  );
}