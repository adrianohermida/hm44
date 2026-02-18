import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, File, MessageSquare } from 'lucide-react';
import ClienteProcessosTab from './ClienteProcessosTab';
import DocumentosTab from './DocumentosTab';
import ComunicacaoTab from './ComunicacaoTab';

export default function ClienteTabsSection({ clienteId, escritorioId, clienteEmail }) {
  const [activeTab, setActiveTab] = useState('processos');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="processos" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">Processos</span>
        </TabsTrigger>
        <TabsTrigger value="documentos" className="flex items-center gap-2">
          <File className="w-4 h-4" />
          <span className="hidden sm:inline">Documentos</span>
        </TabsTrigger>
        <TabsTrigger value="comunicacao" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Comunicação</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="processos">
        {activeTab === 'processos' && (
          <ClienteProcessosTab clienteId={clienteId} />
        )}
      </TabsContent>

      <TabsContent value="documentos">
        {activeTab === 'documentos' && (
          <DocumentosTab clienteId={clienteId} escritorioId={escritorioId} />
        )}
      </TabsContent>

      <TabsContent value="comunicacao">
        {activeTab === 'comunicacao' && (
          <ComunicacaoTab 
            clienteId={clienteId} 
            clienteEmail={clienteEmail}
            escritorioId={escritorioId}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}