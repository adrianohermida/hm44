import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Settings, MessageSquare, History } from 'lucide-react';
import ClienteContactInfo from './ClienteContactInfo';
import PropriedadesEditaveis from './PropriedadesEditaveis';
import ThreadsPanel from './ThreadsPanel';
import AtividadesTimeline from './AtividadesTimeline';

export default function TicketSidebarTabs({ ticket }) {
  return (
    <Tabs defaultValue="detalhes" className="h-full flex flex-col">
      <TabsList className="grid grid-cols-4 mx-4 mt-4">
        <TabsTrigger value="detalhes" className="gap-1 text-xs">
          <Info className="w-3 h-3" />
          <span className="hidden lg:inline">Detalhes</span>
        </TabsTrigger>
        <TabsTrigger value="propriedades" className="gap-1 text-xs">
          <Settings className="w-3 h-3" />
          <span className="hidden lg:inline">Props</span>
        </TabsTrigger>
        <TabsTrigger value="threads" className="gap-1 text-xs">
          <MessageSquare className="w-3 h-3" />
          <span className="hidden lg:inline">Threads</span>
        </TabsTrigger>
        <TabsTrigger value="atividades" className="gap-1 text-xs">
          <History className="w-3 h-3" />
          <span className="hidden lg:inline">Ativ</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="detalhes" className="flex-1 overflow-hidden m-0 mt-2">
        <ClienteContactInfo ticket={ticket} />
      </TabsContent>

      <TabsContent value="propriedades" className="flex-1 overflow-hidden m-0 mt-2">
        <PropriedadesEditaveis ticket={ticket} />
      </TabsContent>

      <TabsContent value="threads" className="flex-1 overflow-hidden m-0 mt-2">
        <ThreadsPanel ticketId={ticket.id} />
      </TabsContent>

      <TabsContent value="atividades" className="flex-1 overflow-hidden m-0 mt-2">
        <AtividadesTimeline ticketId={ticket.id} />
      </TabsContent>
    </Tabs>
  );
}