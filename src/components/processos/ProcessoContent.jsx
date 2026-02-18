import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProcessoInfo from './ProcessoInfo';
import PartesList from './PartesList';
import AndamentosTimeline from './AndamentosTimeline';
import ProcessoMetadata from './ProcessoMetadata';

export default function ProcessoContent({ processo, andamentos }) {
  return (
    <Tabs defaultValue="geral" className="w-full">
      <TabsList>
        <TabsTrigger value="geral">Geral</TabsTrigger>
        <TabsTrigger value="andamentos">Andamentos</TabsTrigger>
        <TabsTrigger value="partes">Partes</TabsTrigger>
      </TabsList>
      <TabsContent value="geral" className="space-y-4">
        <ProcessoInfo processo={processo} />
        <ProcessoMetadata processo={processo} />
      </TabsContent>
      <TabsContent value="andamentos">
        <AndamentosTimeline andamentos={andamentos} />
      </TabsContent>
      <TabsContent value="partes">
        <PartesList partes={processo.partes} />
      </TabsContent>
    </Tabs>
  );
}