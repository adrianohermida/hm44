import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import LoadingState from '../../common/LoadingState';
import ProcessoClienteCard from './processos/ProcessoClienteCard';
import ProcessoClienteFilters from './processos/ProcessoClienteFilters';
import ProcessoClienteStats from './processos/ProcessoClienteStats';
import ProcessoTreeToggle from './processos/ProcessoTreeToggle';
import ProcessoTreeView from './processos/ProcessoTreeView';

export default function ClienteProcessosList({ clienteId }) {
  const [filtros, setFiltros] = useState({ status: 'todos', tribunal: 'todos' });
  const [view, setView] = useState('list');

  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['processos-cliente', clienteId],
    queryFn: () => base44.entities.Processo.filter({ cliente_id: clienteId }),
    enabled: !!clienteId
  });

  const processosPrincipais = useMemo(() => {
    return processos.filter(p => !p.processo_pai_id);
  }, [processos]);

  const tribunais = useMemo(() => {
    return [...new Set(processos.map(p => p.tribunal).filter(Boolean))];
  }, [processos]);

  const processosFiltrados = useMemo(() => {
    const principais = processosPrincipais.filter(p => {
      const matchStatus = filtros.status === 'todos' || p.status === filtros.status;
      const matchTribunal = filtros.tribunal === 'todos' || p.tribunal === filtros.tribunal;
      return matchStatus && matchTribunal;
    });
    return principais;
  }, [processosPrincipais, filtros]);

  if (isLoading) return <LoadingState message="Carregando processos..." />;

  if (processos.length === 0) {
    return (
      <Card className="p-8 text-center bg-[var(--bg-secondary)]">
        <FileText className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
        <p className="text-[var(--text-secondary)]">Nenhum processo vinculado</p>
      </Card>
    );
  }

  return (
    <div>
      <ProcessoClienteStats processos={processos} processosPrincipais={processosPrincipais} />
      <div className="flex items-center justify-between mb-4">
        <ProcessoClienteFilters filtros={filtros} onChange={setFiltros} tribunais={tribunais} />
        <ProcessoTreeToggle view={view} onChange={setView} />
      </div>
      {view === 'tree' ? (
        <ProcessoTreeView processosPrincipais={processosFiltrados} todosProcessos={processos} clienteId={clienteId} />
      ) : (
        <div className="space-y-3">
          {processosFiltrados.map((p) => {
            const apensos = processos.filter(proc => proc.processo_pai_id === p.id).length;
            return <ProcessoClienteCard key={p.id} processo={p} apensos={apensos} clienteId={clienteId} />;
          })}
        </div>
      )}
    </div>
  );
}