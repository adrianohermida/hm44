import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Breadcrumb from '@/components/seo/Breadcrumb';
import CallbackLogItem from '@/components/escavador/CallbackLogItem';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function CallbacksEscavador() {
  const { data: callbacks = [] } = useQuery({
    queryKey: ['callbacks'],
    queryFn: () => base44.entities.CallbackEscavador.list('-created_date', 100)
  });

  const pendentes = callbacks.filter(c => !c.processado);
  const processados = callbacks.filter(c => c.processado);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Callbacks Escavador' }]} />
      
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
        Gestão de Callbacks
      </h1>

      <Tabs defaultValue="pendentes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes ({pendentes.length})</TabsTrigger>
          <TabsTrigger value="processados">Processados ({processados.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes">
          <div className="space-y-3">
            {pendentes.map(c => <CallbackLogItem key={c.id} callback={c} />)}
          </div>
        </TabsContent>

        <TabsContent value="processados">
          <div className="space-y-3">
            {processados.map(c => <CallbackLogItem key={c.id} callback={c} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}