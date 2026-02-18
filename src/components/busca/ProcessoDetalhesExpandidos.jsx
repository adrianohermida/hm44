import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import MovimentacoesLista from '@/components/escavador/MovimentacoesLista';
import AudienciasLista from '@/components/escavador/AudienciasLista';
import DocumentosPublicosList from '@/components/escavador/DocumentosPublicosList';
import { Loader2 } from 'lucide-react';

export default function ProcessoDetalhesExpandidos({ numeroCnj }) {
  const [tab, setTab] = useState('movimentacoes');

  const { data: movs, isLoading: loadingMovs } = useQuery({
    queryKey: ['movimentacoes', numeroCnj],
    queryFn: async () => {
      const res = await base44.functions.invoke('listarMovimentacoes', { numero_cnj: numeroCnj });
      return res.data.movimentacoes || [];
    },
    enabled: tab === 'movimentacoes'
  });

  const { data: auds, isLoading: loadingAuds } = useQuery({
    queryKey: ['audiencias', numeroCnj],
    queryFn: async () => {
      const res = await base44.functions.invoke('listarAudiencias', { numero_cnj: numeroCnj });
      return res.data.audiencias || [];
    },
    enabled: tab === 'audiencias'
  });

  const { data: docs, isLoading: loadingDocs } = useQuery({
    queryKey: ['documentos', numeroCnj],
    queryFn: async () => {
      const res = await base44.functions.invoke('listarDocumentosPublicos', { numero_cnj: numeroCnj });
      return res.data.documentos || [];
    },
    enabled: tab === 'documentos'
  });

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="movimentacoes">Movimentações</TabsTrigger>
        <TabsTrigger value="audiencias">Audiências</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
      </TabsList>
      <TabsContent value="movimentacoes" className="mt-4">
        {loadingMovs ? <Loader2 className="w-6 h-6 animate-spin" /> : <MovimentacoesLista movimentacoes={movs || []} />}
      </TabsContent>
      <TabsContent value="audiencias" className="mt-4">
        {loadingAuds ? <Loader2 className="w-6 h-6 animate-spin" /> : <AudienciasLista audiencias={auds || []} />}
      </TabsContent>
      <TabsContent value="documentos" className="mt-4">
        {loadingDocs ? <Loader2 className="w-6 h-6 animate-spin" /> : <DocumentosPublicosList documentos={docs || []} onDownload={() => {}} />}
      </TabsContent>
    </Tabs>
  );
}