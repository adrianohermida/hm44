import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, ExternalLink } from 'lucide-react';

export default function ProvedorListItem({ provedor, selected, onToggle, onEdit, onView }) {
  const statusColors = {
    Saudável: 'bg-green-100 text-green-800',
    Degradado: 'bg-yellow-100 text-yellow-800',
    Indisponível: 'bg-red-100 text-red-800',
    Desconhecido: 'bg-gray-100 text-gray-800'
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] border rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
      <Checkbox checked={selected} onCheckedChange={() => onToggle(provedor.id)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium">{provedor.nome}</span>
          <Badge className={statusColors[provedor.saude_status]}>{provedor.saude_status}</Badge>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] truncate">{provedor.base_url_v1 || provedor.base_url_v2}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onView(provedor)}>
        <ExternalLink className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onEdit(provedor)}>
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );
}