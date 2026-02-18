import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Settings, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HelpdeskHeaderSimple({ escritorioId, onNovoTicket }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Atendimento</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">Gestão de tickets e suporte</p>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm"
          asChild
        >
          <Link to={createPageUrl('HelpdeskAnalytics')}>
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Analytics</span>
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          asChild
        >
          <Link to={createPageUrl('HelpdeskSettings')}>
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline ml-2">Configurações</span>
          </Link>
        </Button>

        <Button 
          size="sm"
          onClick={onNovoTicket}
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline ml-2">Novo Ticket</span>
        </Button>
      </div>
    </div>
  );
}