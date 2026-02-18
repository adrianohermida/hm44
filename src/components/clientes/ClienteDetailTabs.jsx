import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClienteProcessosList from './vinculos/ClienteProcessosList';

export default function ClienteDetailTabs({ aba, onChange, children, clienteId }) {
  return (
    <Tabs value={aba} onValueChange={onChange} className="w-full">
      <TabsList className="w-full justify-start bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
        <TabsTrigger value="geral">Geral</TabsTrigger>
        <TabsTrigger value="processos">Processos</TabsTrigger>
        <TabsTrigger value="consumo">Consumo API</TabsTrigger>
        <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
      </TabsList>
      {children}
      <TabsContent value="processos">
        <ClienteProcessosList clienteId={clienteId} />
      </TabsContent>
    </Tabs>
  );
}