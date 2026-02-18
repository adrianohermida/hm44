import React from 'react';
import { X, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FiltrosCanal from './FiltrosCanal';
import ConversasList from './ConversasList';

export default function ConversasSidebar({ conversas, selected, onSelect, canal, setCanal, tipo, setTipo, loading, isOpen, onToggle }) {
  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="md:hidden fixed top-20 left-4 z-50 bg-[var(--bg-elevated)] shadow-lg rounded-full"
        aria-label={isOpen ? 'Fechar lista de conversas' : 'Abrir lista de conversas'}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <aside
        className={`
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          fixed md:relative
          left-0 top-16 bottom-0
          w-80 md:w-80 lg:w-96
          bg-[var(--bg-elevated)]
          border-r border-[var(--border-primary)]
          flex flex-col
          transition-transform duration-300
          z-40
          shadow-xl md:shadow-none
        `}
      >
        <div className="p-4 border-b border-[var(--border-primary)]">
          <h2 className="font-semibold text-[var(--text-primary)] text-lg mb-3">
            Conversas
          </h2>
          <FiltrosCanal canal={canal} setCanal={setCanal} tipo={tipo} setTipo={setTipo} />
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <ConversasList
            conversas={conversas}
            conversaSelecionada={selected}
            onSelect={onSelect}
            loading={loading}
          />
        </div>
      </aside>

      {/* Overlay Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
}