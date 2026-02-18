import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Ticket } from 'lucide-react';

export default function ComunicacaoTabs({ activeTab, onTabChange }) {
  return (
    <div className="flex gap-2 border-b border-[var(--border-primary)]">
      <Button
        variant={activeTab === 'conversas' ? 'default' : 'ghost'}
        onClick={() => onTabChange('conversas')}
        className={activeTab === 'conversas' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Balcão Virtual
      </Button>
      <Button
        variant={activeTab === 'tickets' ? 'default' : 'ghost'}
        onClick={() => onTabChange('tickets')}
        className={activeTab === 'tickets' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <Ticket className="w-4 h-4 mr-2" />
        Tickets
      </Button>
    </div>
  );
}