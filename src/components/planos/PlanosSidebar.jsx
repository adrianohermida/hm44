import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import PlanosFiltros from './PlanosFiltros';
import PlanosLista from './PlanosLista';

export default function PlanosSidebar({ 
  planos, 
  selected, 
  onSelect, 
  onNovo,
  isOpen, 
  onToggle 
}) {
  const [filtros, setFiltros] = useState({
    busca: '',
    status: 'todos',
    cliente: ''
  });

  const planosFiltrados = planos.filter(p => {
    if (filtros.busca && !p.cliente_nome?.toLowerCase().includes(filtros.busca.toLowerCase())) return false;
    if (filtros.status !== 'todos' && p.status_plano !== filtros.status) return false;
    if (filtros.cliente && p.cliente_id !== filtros.cliente) return false;
    return true;
  });

  return (
    <>
      <div 
        className={`${isOpen ? 'w-80' : 'w-0'} transition-all border-r border-[var(--border-primary)] bg-[var(--bg-elevated)] flex flex-col overflow-hidden`}
      >
        <div className="p-4 border-b border-[var(--border-primary)]">
          <Button onClick={onNovo} className="w-full bg-[var(--brand-primary)]">
            <Plus className="w-4 h-4 mr-2" />
            Novo Plano
          </Button>
        </div>

        <PlanosFiltros filtros={filtros} onChange={setFiltros} />
        <PlanosLista 
          planos={planosFiltrados} 
          selected={selected} 
          onSelect={onSelect} 
        />
      </div>

      <button
        onClick={onToggle}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[var(--bg-elevated)] border border-[var(--border-primary)] p-1 rounded-r-lg"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </>
  );
}