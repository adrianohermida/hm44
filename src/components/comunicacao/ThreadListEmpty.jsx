import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function ThreadListEmpty() {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="font-semibold text-gray-900 mb-2">Nenhuma conversa</h3>
      <p className="text-gray-600 mb-6">
        Não há conversas ou tickets pendentes no momento.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link to={createPageUrl('Clientes')}>Ver Clientes</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={createPageUrl('Leads')}>Ver Solicitações</Link>
        </Button>
      </div>
    </div>
  );
}