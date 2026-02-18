import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, History, FolderOpen, DollarSign, BarChart3 } from 'lucide-react';
import { getTexto } from './ProcessoTextoAdaptado';

export default function ProcessoTabsNav({ modo, activeTab, processoId }) {
  const { data: stats } = useQuery({
    queryKey: ['processo-tabs-badges', processoId],
    queryFn: async () => {
      const [publicacoes, tarefas] = await Promise.all([
        base44.entities.PublicacaoProcesso.filter({ processo_id: processoId, lida: false }),
        base44.entities.TarefaProcesso.filter({ processo_id: processoId, status: 'pendente' })
      ]);
      return { publicacoes: publicacoes.length, tarefas: tarefas.length };
    },
    enabled: !!processoId
  });

  const tabs = [
    { 
      value: 'geral', 
      label: getTexto(modo, 'overview'), 
      icon: <FileText className="w-4 h-4 mr-2" aria-hidden="true" />,
      ariaLabel: 'Visão geral do processo: informações básicas, partes e movimentações recentes',
      hotkey: 'G+V'
    },
    { 
      value: 'historico', 
      label: getTexto(modo, 'history'), 
      icon: <History className="w-4 h-4 mr-2" aria-hidden="true" />, 
      badge: stats?.publicacoes,
      ariaLabel: 'Histórico processual: publicações, movimentações e audiências',
      hotkey: 'G+H'
    },
    { 
      value: 'documentos', 
      label: getTexto(modo, 'documents'), 
      icon: <FolderOpen className="w-4 h-4 mr-2" aria-hidden="true" />,
      ariaLabel: 'Documentos: peças processuais, contratos e anexos',
      hotkey: 'G+D'
    },
    { 
      value: 'financeiro', 
      label: getTexto(modo, 'financial'), 
      icon: <DollarSign className="w-4 h-4 mr-2" aria-hidden="true" />,
      ariaLabel: 'Financeiro: honorários, custas e valores envolvidos',
      hotkey: 'G+F'
    },
    { 
      value: 'analytics', 
      label: 'Analytics', 
      icon: <BarChart3 className="w-4 h-4 mr-2" aria-hidden="true" />,
      ariaLabel: 'Analytics: estatísticas e métricas do processo',
      hotkey: 'G+A'
    }
  ];

  return (
    <div className="sticky top-[64px] z-9 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
      <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0 scrollbar-hide">
        <TabsList className="inline-flex w-auto min-w-full md:grid md:grid-cols-5 md:w-full" role="tablist">
          {tabs.map(tab => (
            <TabsTrigger 
              key={tab.value} 
              value={tab.value} 
              className="whitespace-nowrap text-xs md:text-sm relative data-[state=active]:border-b-2 data-[state=active]:border-[var(--brand-primary)]"
              aria-label={tab.ariaLabel}
              title={`Atalho: ${tab.hotkey}`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <Badge 
                  variant="destructive" 
                  className="ml-2 px-1.5 py-0 text-[10px]"
                  aria-label={`${tab.badge} ${tab.badge === 1 ? 'nova notificação' : 'novas notificações'}`}
                >
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      <div className="md:hidden absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[var(--bg-primary)] pointer-events-none" />
    </div>
  );
}