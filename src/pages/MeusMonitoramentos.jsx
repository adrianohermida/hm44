import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import MonitoramentoCard from '@/components/monitoramento/MonitoramentoCard';
import MonitoramentoFiltros from '@/components/monitoramento/MonitoramentoFiltros';
import AparicoesLista from '@/components/monitoramento/AparicoesLista';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Bell } from 'lucide-react';

export default function MeusMonitoramentos() {
  const { data: monitoramentos, isLoading, refetch } = useQuery({
    queryKey: ['monitoramentos-ativos'],
    queryFn: () => base44.entities.MonitoramentoEscavador.filter({ ativo: true })
  });
  
  const [selectedMon, setSelectedMon] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [ordenacao, setOrdenacao] = useState('recentes');
  const [busca, setBusca] = useState('');

  const { data: aparicoes, refetch: refetchAparicoes } = useQuery({
    queryKey: ['aparicoes', selectedMon?.id],
    queryFn: () => base44.entities.AparicaoMonitoramento.filter({ 
      monitoramento_id: selectedMon.id 
    }, '-created_date'),
    enabled: !!selectedMon?.id
  });

  const monitoramentosFiltrados = useMemo(() => {
    if (!monitoramentos) return [];
    
    let resultado = [...monitoramentos];

    if (busca) {
      resultado = resultado.filter(m => 
        m.termo.toLowerCase().includes(busca.toLowerCase())
      );
    }

    if (filtro === 'com_novas') {
      resultado = resultado.filter(m => (m.aparicoes_nao_visualizadas || 0) > 0);
    } else if (filtro === 'sem_novas') {
      resultado = resultado.filter(m => (m.aparicoes_nao_visualizadas || 0) === 0);
    }

    if (ordenacao === 'recentes') {
      resultado.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    } else if (ordenacao === 'antigas') {
      resultado.sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    } else if (ordenacao === 'mais_aparicoes') {
      resultado.sort((a, b) => (b.aparicoes_nao_visualizadas || 0) - (a.aparicoes_nao_visualizadas || 0));
    }

    return resultado;
  }, [monitoramentos, filtro, ordenacao, busca]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Meus Monitoramentos' }]} />
      
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-[var(--brand-primary)]" />
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Meus Monitoramentos</h1>
          <p className="text-[var(--text-secondary)]">
            {monitoramentosFiltrados.length} monitoramento(s) ativo(s)
          </p>
        </div>
      </div>

      <div className="mb-6">
        <MonitoramentoFiltros
          onFiltroChange={setFiltro}
          onOrdenacaoChange={setOrdenacao}
          onBuscaChange={setBusca}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3">
          {monitoramentosFiltrados.map((mon) => (
            <MonitoramentoCard
              key={mon.id}
              monitoramento={mon}
              onClick={() => setSelectedMon(mon)}
            />
          ))}
        </div>

        {selectedMon && (
          <Card className="sticky top-6 h-fit">
            <CardHeader>
              <CardTitle>Aparições - {selectedMon.termo}</CardTitle>
            </CardHeader>
            <CardContent>
              {aparicoes ? (
                <AparicoesLista 
                  aparicoes={aparicoes} 
                  onUpdate={() => {
                    refetch();
                    refetchAparicoes();
                  }}
                />
              ) : (
                <Loader2 className="w-6 h-6 animate-spin" />
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}