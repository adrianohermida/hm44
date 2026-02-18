import React from 'react';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeadsList from './LeadsList';

export default function LeadsSidebar({ leads, selected, onSelect, isOpen, onToggle, loading }) {
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="md:hidden fixed top-20 left-4 z-50 bg-[var(--bg-elevated)] shadow-lg rounded-full"
        aria-label={isOpen ? 'Fechar lista' : 'Abrir lista'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      <aside
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 fixed md:relative left-0 top-16 bottom-0
          w-80 md:w-80 lg:w-96 bg-[var(--bg-elevated)]
          border-r border-[var(--border-primary)] flex flex-col
          transition-transform duration-300 z-40 shadow-xl md:shadow-none
        `}
      >
        <LeadsList leads={leads} selected={selected} onSelect={onSelect} loading={loading} />
      </aside>

      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={onToggle} />
      )}
    </>
  );
}