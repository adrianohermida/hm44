import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import PropriedadesSidebar from './PropriedadesSidebar';
import ThreadsPanel from './ThreadsPanel';
import AtividadesTimeline from './AtividadesTimeline';
import ClienteContactInfo from './ClienteContactInfo';
import TarefasTicketList from './TarefasTicketList';

export default function TicketSidebarAccordion({ ticket }) {
  const navigate = useNavigate();
  const [detalhesOpen, setDetalhesOpen] = React.useState(true);
  const [propsOpen, setPropsOpen] = React.useState(false);
  const [tarefasOpen, setTarefasOpen] = React.useState(false);
  const [linhaTempoOpen, setLinhaTempoOpen] = React.useState(false);

  const { data: cliente } = useQuery({
    queryKey: ['cliente-sidebar-acc', ticket?.cliente_id],
    queryFn: async () => {
      if (ticket?.cliente_vinculado_id) {
        const [c] = await base44.entities.Cliente.filter({ id: ticket.cliente_vinculado_id });
        return c;
      }
      return null;
    },
    enabled: !!ticket?.cliente_vinculado_id
  });

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {/* DETALHES DO CONTATO */}
        <Collapsible open={detalhesOpen} onOpenChange={setDetalhesOpen}>
          <div className="bg-white border border-[var(--border-primary)] rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
              <span className="text-xs font-semibold text-gray-600 uppercase flex items-center gap-2">
                <span className="text-blue-600">ℹ️</span>
                Detalhes do Contato
              </span>
              <div className="flex items-center gap-2">
                {cliente?.id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}`);
                    }}
                    className="h-6 px-2 text-xs"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Editar
                  </Button>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${detalhesOpen ? '' : '-rotate-90'}`} />
              </div>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="border-t border-[var(--border-primary)]">
                <ClienteContactInfo ticket={ticket} />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* PROPRIEDADES */}
        <Collapsible open={propsOpen} onOpenChange={setPropsOpen}>
          <div className="bg-white border border-[var(--border-primary)] rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                Propriedades
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${propsOpen ? '' : '-rotate-90'}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="border-t border-[var(--border-primary)]">
                <PropriedadesSidebar ticket={ticket} />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* TAREFAS */}
        <Collapsible open={tarefasOpen} onOpenChange={setTarefasOpen}>
          <div className="bg-white border border-[var(--border-primary)] rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                📋 Tarefas
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${tarefasOpen ? '' : '-rotate-90'}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <TarefasTicketList ticketId={ticket.id} processoId={ticket.processo_id} />
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* LINHA DO TEMPO */}
        <Collapsible open={linhaTempoOpen} onOpenChange={setLinhaTempoOpen}>
          <div className="bg-white border border-[var(--border-primary)] rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                📅 Linha do Tempo
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${linhaTempoOpen ? '' : '-rotate-90'}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="border-t border-[var(--border-primary)]">
                <AtividadesTimeline ticketId={ticket.id} />
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </ScrollArea>
  );
}