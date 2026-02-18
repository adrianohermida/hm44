import React from 'react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { TestTube, History, DollarSign } from 'lucide-react';

export default function EndpointActions({ endpointId }) {
  return (
    <div className="flex gap-2">
      <Link to={`${createPageUrl('TesteEndpointPage')}?endpoint=${endpointId}`}>
        <Button variant="outline" size="sm" aria-label="Testar endpoint">
          <TestTube className="w-4 h-4 mr-1" />
          Testar
        </Button>
      </Link>
      <Link to={`${createPageUrl('AdminTestes')}?endpoint=${endpointId}`}>
        <Button variant="outline" size="sm" aria-label="Ver histórico">
          <History className="w-4 h-4 mr-1" />
          Histórico
        </Button>
      </Link>
    </div>
  );
}