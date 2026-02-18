import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import MonitoramentosList from '@/components/monitoramento/MonitoramentosList';
import MonitoramentosProcessoLista from '@/components/monitoramento/MonitoramentosProcessoLista';
import MonitoramentosNovosLista from '@/components/monitoramento/MonitoramentosNovosLista';
import CriarMonitoramentoModal from '@/components/monitoramento/CriarMonitoramentoModal';

export default function MonitoramentosEscavador() {
  const [modalOpen, setModalOpen] = useState(false);
  const [tipoModal, setTipoModal] = useState('PROCESSO');

  const { data: monitoramentosV1 = [] } = useQuery({
    queryKey: ['monitoramentos-v1'],
    queryFn: () => base44.entities.MonitoramentoEscavador.filter({ ativo: true })
  });

  const openModal = (tipo) => {
    setTipoModal(tipo);
    setModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Breadcrumb items={[{ label: 'Monitoramentos Escavador' }]} />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Monitoramentos</h1>
        <Button onClick={() => openModal('PROCESSO')} className="bg-[var(--brand-primary)]">
          <Plus className="w-4 h-4 mr-2" />
          Novo Monitoramento
        </Button>
      </div>

      <Tabs defaultValue="processo" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="processo">Processos V2</TabsTrigger>
          <TabsTrigger value="novos">Novos Processos</TabsTrigger>
          <TabsTrigger value="v1">Legado V1</TabsTrigger>
        </TabsList>

        <TabsContent value="processo">
          <MonitoramentosProcessoLista />
        </TabsContent>

        <TabsContent value="novos">
          <MonitoramentosNovosLista />
        </TabsContent>

        <TabsContent value="v1">
          <MonitoramentosList monitoramentos={monitoramentosV1} />
        </TabsContent>
      </Tabs>

      <CriarMonitoramentoModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        tipo={tipoModal}
      />
    </div>
  );
}