import React from 'react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { ListChecks, DollarSign } from 'lucide-react';

export default function ProvedorActions({ provedorId }) {
  return (
    <div className="flex gap-2 mt-3">
      <Link to={`${createPageUrl('AdminEndpoints')}?provedor=${provedorId}`}>
        <Button variant="outline" size="sm" aria-label="Ver endpoints do provedor">
          <ListChecks className="w-4 h-4 mr-1" />
          Ver Endpoints
        </Button>
      </Link>
      <Link to={`${createPageUrl('Precificador')}?provedor=${provedorId}`}>
        <Button variant="outline" size="sm" aria-label="Ver preços do provedor">
          <DollarSign className="w-4 h-4 mr-1" />
          Preços
        </Button>
      </Link>
    </div>
  );
}