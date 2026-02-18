import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';

export default function EndpointVersionBadge({ versao, versoes }) {
  const isLatest = versoes?.[0] === versao;

  return (
    <Badge variant={isLatest ? 'default' : 'outline'} className="gap-1">
      <GitBranch className="w-3 h-3" />
      {versao}
      {isLatest && ' (atual)'}
    </Badge>
  );
}