import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, ExternalLink } from 'lucide-react';

export default function EndpointListItem({ endpoint, provedor, selected, onToggle, onEdit }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-[var(--bg-primary)] border rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
      <Checkbox checked={selected} onCheckedChange={() => onToggle(endpoint.id)} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline">{endpoint.metodo}</Badge>
          <span className="text-sm font-medium truncate">{endpoint.nome}</span>
        </div>
        <p className="text-xs text-[var(--text-tertiary)] truncate">{provedor?.nome} • {endpoint.path}</p>
      </div>
      <Badge>{endpoint.versao_api}</Badge>
      <Button variant="ghost" size="sm" onClick={() => onEdit(endpoint)}>
        <Edit className="w-4 h-4" />
      </Button>
    </div>
  );
}