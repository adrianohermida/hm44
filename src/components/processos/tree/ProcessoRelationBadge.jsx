import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Link2, FileText } from 'lucide-react';

const RELATION_CONFIG = {
  apenso: { icon: Link2, label: 'Apenso', color: 'bg-blue-100 text-blue-700' },
  recurso: { icon: GitBranch, label: 'Recurso', color: 'bg-purple-100 text-purple-700' },
  incidente: { icon: FileText, label: 'Incidente', color: 'bg-orange-100 text-orange-700' }
};

export default function ProcessoRelationBadge({ type }) {
  const config = RELATION_CONFIG[type] || RELATION_CONFIG.apenso;
  const Icon = config.icon;

  return (
    <Badge className={`gap-1 ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}