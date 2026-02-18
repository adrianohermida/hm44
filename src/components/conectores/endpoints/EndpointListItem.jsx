import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import HealthBadge from '../health/HealthBadge';

export default function EndpointListItem({ endpoint, showHealth }) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(createPageUrl('AdminEndpoints') + `?endpoint=${endpoint.id}`);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline">{endpoint.metodo}</Badge>
          <span className="font-semibold text-sm">{endpoint.nome}</span>
        </div>
        <code className="text-xs text-[var(--text-tertiary)]">{endpoint.path}</code>
      </div>
      {showHealth && endpoint.saude_status && (
        <HealthBadge status={endpoint.saude_status} />
      )}
      <Button size="sm" variant="ghost" onClick={handleNavigate}>
        <ExternalLink className="w-4 h-4" />
      </Button>
    </div>
  );
}