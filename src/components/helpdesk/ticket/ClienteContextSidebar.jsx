import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { ChevronDown, Copy, ExternalLink, Plus } from 'lucide-react';
import { toast } from 'sonner';
import ClienteTicketsHistorico from '../sidebar-cliente/ClienteTicketsHistorico';

export default function ClienteContextSidebar({ ticket }) {
  const navigate = useNavigate();

  const { data: cliente } = useQuery({
    queryKey: ['cliente-context', ticket?.cliente_id],
    queryFn: async () => {
      if (ticket?.cliente_vinculado_id) {
        const [c] = await base44.entities.Cliente.filter({ id: ticket.cliente_vinculado_id });
        return c;
      }
      if (ticket?.cliente_id) {
        const [c] = await base44.entities.Cliente.filter({ id: ticket.cliente_id });
        return c;
      }
      return null;
    },
    enabled: !!(ticket?.cliente_id || ticket?.cliente_vinculado_id)
  });

  const { data: processos = [], isLoading: isLoadingProcessos } = useQuery({
    queryKey: ['cliente-processos', cliente?.id],
    queryFn: () => base44.entities.Processo.filter({ cliente_id: cliente.id }, '-created_date', 3),
    enabled: !!cliente?.id
  });

  const { data: consultas = [] } = useQuery({
    queryKey: ['cliente-consultas', cliente?.id],
    queryFn: async () => {
      const agora = new Date().toISOString();
      return base44.entities.Atendimento.filter({
        cliente_id: cliente.id,
        data_hora: { $gte: agora }
      }, 'data_hora', 3);
    },
    enabled: !!cliente?.id
  });

  const { data: ticketsHistorico = [] } = useQuery({
    queryKey: ['cliente-tickets-historico', ticket?.cliente_email],
    queryFn: () => base44.entities.Ticket.filter(
      { cliente_email: ticket.cliente_email },
      '-created_date',
      5
    ),
    enabled: !!ticket?.cliente_email
  });

  const handleWhatsApp = () => {
    const telefone = cliente?.telefones?.[0]?.numero || ticket?.cliente_email;
    window.open(`https://wa.me/${telefone.replace(/\D/g, '')}`, '_blank');
  };

  const handleLigar = () => {
    const telefone = cliente?.telefones?.[0]?.numero;
    if (telefone) window.open(`tel:${telefone}`);
  };

  const handleEmail = () => {
    window.open(`mailto:${ticket?.cliente_email}`);
  };

  const handleAbrirChat = () => {
    const event = new CustomEvent('openChatWithClient', {
      detail: {
        clienteEmail: ticket?.cliente_email,
        clienteNome: ticket?.cliente_nome,
        ticketId: ticket?.id
      }
    });
    window.dispatchEvent(event);
  };

  const handleAgendarConsulta = () => {
    navigate(`${createPageUrl('AgendarConsulta')}?cliente_id=${cliente?.id || ''}&email=${ticket?.cliente_email}`);
  };

  const [detalhesOpen, setDetalhesOpen] = useState(true);
  const [tarefasOpen, setTarefasOpen] = useState(true);
  const [timelineOpen, setTimelineOpen] = useState(true);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  const getInitials = (nome) => {
    if (!nome) return '?';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  if (!ticket) {
    return <div className="p-4 text-sm text-[var(--text-tertiary)]">Selecione um ticket</div>;
  }

  const nomeCliente = cliente?.nome_completo || cliente?.razao_social || ticket?.cliente_nome;
  const emailCliente = cliente?.email_principal || ticket?.cliente_email;
  const telefoneCliente = cliente?.telefones?.[0]?.numero || cliente?.telefone_principal;

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <Collapsible open={detalhesOpen} onOpenChange={setDetalhesOpen}>
          <div className="bg-white border rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                Detalhes do Contato
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${detalhesOpen ? '' : '-rotate-90'}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-4 space-y-3 border-t">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-semibold text-blue-600">
                        {getInitials(nomeCliente)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm truncate">
                      {nomeCliente}
                    </h3>
                  </div>
                  {cliente?.id && (
                    <button
                      onClick={() => navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}`)}
                      className="p-2 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
                      aria-label="Editar detalhes do contato"
                    >
                      <ExternalLink className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-1">E-mail</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-600 flex-1 truncate">
                      {emailCliente}
                    </span>
                    <button
                      onClick={() => copyToClipboard(emailCliente)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {telefoneCliente && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Celular</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm flex-1">
                        {telefoneCliente}
                      </span>
                      <button
                        onClick={() => copyToClipboard(telefoneCliente)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {cliente?.id && (
                  <button 
                    onClick={() => navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}`)}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Exibir mais informações
                  </button>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Collapsible open={tarefasOpen} onOpenChange={setTarefasOpen}>
          <div className="bg-white border rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                Tarefas
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${tarefasOpen ? '' : '-rotate-90'}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-4 border-t space-y-2">
                <button 
                  onClick={() => cliente?.id && navigate(`${createPageUrl('Tarefas')}?cliente_id=${cliente.id}`)}
                  className="text-sm text-green-600 hover:underline flex items-center gap-1 w-full"
                >
                  <Plus className="w-3 h-3" />
                  Adicionar tarefa
                </button>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        <Collapsible open={timelineOpen} onOpenChange={setTimelineOpen}>
          <div className="bg-white border rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                Linha do Tempo
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform ${timelineOpen ? '' : '-rotate-90'}`} />
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <div className="p-4 border-t space-y-3">
                {ticketsHistorico.length === 0 ? (
                  <p className="text-xs text-gray-500">Nenhuma atividade recente</p>
                ) : (
                  <>
                    {ticketsHistorico.filter(t => t.id !== ticket.id).slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => window.dispatchEvent(new CustomEvent('selectTicket', { detail: item }))}
                        className="text-xs space-y-0.5 w-full text-left hover:bg-gray-50 p-2 rounded"
                      >
                        <div className="font-semibold text-gray-700">
                          #{item.id.substring(0, 6)}
                        </div>
                        <div className="text-gray-600 text-xs">
                          {item.titulo}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {new Date(item.created_date).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                        {item.status && (
                          <div className="text-xs text-gray-600">
                            Status: {item.status}
                          </div>
                        )}
                      </button>
                    ))}
                    <button className="text-xs text-blue-600 hover:underline w-full text-left">
                      Exibir todos os atividados
                    </button>
                  </>
                )}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </div>
    </ScrollArea>
  );
}