import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

export default function LinkConsumoAPI({ endpointId, label = 'Ver Endpoint' }) {
  if (!endpointId) return null;

  return (
    <Link 
      to={`${createPageUrl('AdminEndpoints')}?endpoint_id=${endpointId}`}
      className="inline-flex items-center gap-1 text-xs text-[var(--brand-primary)] hover:underline"
    >
      <ExternalLink className="w-3 h-3" />
      {label}
    </Link>
  );
}