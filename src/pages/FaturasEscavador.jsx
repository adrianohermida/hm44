import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FaturaCard from '@/components/fatura/FaturaCard';
import PacotesCreditosGrid from '@/components/fatura/PacotesCreditosGrid';
import TarefaBancariaItem from '@/components/fatura/TarefaBancariaItem';

export default function FaturasEscavador() {
  const { data: faturas = [] } = useQuery({
    queryKey: ['faturas-servico'],
    queryFn: () => base44.entities.FaturaServico.list('-created_date', 50)
  });

  const { data: tarefas = [] } = useQuery({
    queryKey: ['tarefas-bancarias'],
    queryFn: () => base44.entities.TarefaConferenciaBancaria.filter({ status: 'PENDENTE' })
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Faturas Escavador' }]} />
      
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">
        Gestão Financeira API
      </h1>

      <Tabs defaultValue="comprar" className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="comprar">Comprar Créditos</TabsTrigger>
          <TabsTrigger value="faturas">Faturas</TabsTrigger>
          <TabsTrigger value="tarefas">Conferências</TabsTrigger>
        </TabsList>

        <TabsContent value="comprar">
          <PacotesCreditosGrid />
        </TabsContent>

        <TabsContent value="faturas">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {faturas.map(f => <FaturaCard key={f.id} fatura={f} />)}
          </div>
        </TabsContent>

        <TabsContent value="tarefas">
          <div className="space-y-3">
            {tarefas.map(t => (
              <TarefaBancariaItem 
                key={t.id} 
                tarefa={t}
                onConferir={(tarefa) => console.log('Conferir:', tarefa)}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}