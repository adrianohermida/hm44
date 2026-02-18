import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';

export default function EndpointCardActions({ onEdit, onDelete, onViewDetails }) {
  if (!onEdit && !onDelete && !onViewDetails) return null;

  return (
    <div className="flex gap-1 mt-2" onClick={e => e.stopPropagation()}>
      {onViewDetails && (
        <Button variant="ghost" size="sm" onClick={onViewDetails} aria-label="Ver detalhes">
          <Eye className="w-3 h-3" />
        </Button>
      )}
      {onEdit && (
        <Button variant="ghost" size="sm" onClick={onEdit} aria-label="Editar endpoint">
          <Edit className="w-3 h-3" />
        </Button>
      )}
      {onDelete && (
        <Button variant="ghost" size="sm" onClick={onDelete} aria-label="Deletar endpoint">
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}