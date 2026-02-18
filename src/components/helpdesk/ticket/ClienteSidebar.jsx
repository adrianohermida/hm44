import React, { useState } from 'react';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown, Copy, ExternalLink, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ClienteSidebar({ cliente, tarefas = [], timeline = [] }) {
  const [detalhesOpen, setDetalhesOpen] = useState(true);
  const [tarefasOpen, setTarefasOpen] = useState(true);
  const [timelineOpen, setTimelineOpen] = useState(true);

  if (!cliente) return null;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  const getInitials = (nome) => {
    if (!nome) return '?';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <div className="space-y-3">
      <Collapsible open={detalhesOpen} onOpenChange={setDetalhesOpen}>
        <div className="bg-white border rounded-lg">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-600 uppercase">
                Detalhes do Contato
              </span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${detalhesOpen ? '' : '-rotate-90'}`} />
          </CollapsibleTrigger>
          
          <CollapsibleContent>
            <div className="p-4 space-y-3 border-t">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600">
                    {getInitials(cliente.nome_completo || cliente.razao_social)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">
                    {cliente.nome_completo || cliente.razao_social}
                  </h3>
                </div>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-1">E-mail</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-600 flex-1 truncate">
                    {cliente.email_principal}
                  </span>
                  <button
                    onClick={() => copyToClipboard(cliente.email_principal)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {cliente.telefone_principal && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Celular</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm flex-1">
                      {cliente.telefone_principal}
                    </span>
                    <button
                      onClick={() => copyToClipboard(cliente.telefone_principal)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}

              <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                Exibir mais informações
              </button>
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
              {tarefas.length === 0 ? (
                <button className="text-sm text-green-600 hover:underline flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  Adicionar tarefa
                </button>
              ) : (
                <>
                  {tarefas.slice(0, 3).map(tarefa => (
                    <div key={tarefa.id} className="text-xs pb-2 border-b last:border-0">
                      <div className="font-medium text-gray-700">{tarefa.titulo}</div>
                      <div className="text-gray-500 mt-1">
                        {new Date(tarefa.data_vencimento).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                  <button className="text-sm text-green-600 hover:underline flex items-center gap-1 mt-2">
                    <Plus className="w-3 h-3" />
                    Adicionar tarefa
                  </button>
                </>
              )}
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
              {timeline.length === 0 ? (
                <p className="text-xs text-gray-500">Nenhuma atividade recente</p>
              ) : (
                <>
                  {timeline.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="text-xs space-y-1">
                      <div className="font-medium text-blue-600">
                        {item.numero_ticket || item.numero_cnj || 'Atividade'} 
                        {item.id && ` #${item.id.substring(0, 8)}`}
                      </div>
                      <div className="text-gray-500">
                        {new Date(item.created_date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      {item.status && (
                        <div className="text-gray-600">
                          Status: {item.status}
                        </div>
                      )}
                    </div>
                  ))}
                  <button className="text-xs text-blue-600 hover:underline">
                    Exibir todos os atividados
                  </button>
                </>
              )}
            </div>
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  );
}