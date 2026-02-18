import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExternalLink, User } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function ProcessoClienteLink({ clienteId, clienteNome }) {
  if (!clienteId) return null;

  return (
    <Link to={`${createPageUrl('ClienteDetalhes')}?id=${clienteId}`}>
      <Button variant="outline" size="sm" className="gap-2">
        <User className="w-4 h-4" />
        {clienteNome || 'Ver Cliente'}
        <ExternalLink className="w-3 h-3" />
      </Button>
    </Link>
  );
}