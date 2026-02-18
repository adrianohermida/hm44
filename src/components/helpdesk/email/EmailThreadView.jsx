import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ChevronDown, ChevronUp, Mail, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import EmailStatusBadge from '../EmailStatusBadge';
import EmailHeadersModal from '../ticket/EmailHeadersModal';

export default function EmailThreadView({ mensagem, showThread = true }) {
  const [expandedIds, setExpandedIds] = useState([mensagem.id]);
  const [showHeaders, setShowHeaders] = useState(false);

  const { data: threadHistorico = [] } = useQuery({
    queryKey: ['email-thread', mensagem.ticket_id],
    queryFn: async () => {
      const msgs = await base44.entities.TicketMensagem.filter({ 
        ticket_id: mensagem.ticket_id,
        canal: 'email'
      });
      return msgs
        .filter(m => new Date(m.created_date) < new Date(mensagem.created_date))
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: showThread && !!mensagem.ticket_id
  });

  const toggleExpand = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const sanitizeHtml = (html) => {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const scripts = temp.querySelectorAll('script, iframe, object, embed');
    scripts.forEach(s => s.remove());
    return temp.innerHTML;
  };

  return (
    <>
      <div className="max-h-[600px] overflow-y-auto border rounded-lg">
      {/* Mensagem atual - sempre expandida */}
      <div className="bg-white p-4">
        <div className="mb-3 space-y-2 text-xs border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500" />
              <span className="font-medium">{mensagem.remetente_nome}</span>
            </div>
            <div className="text-gray-500">
              {format(new Date(mensagem.created_date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
            </div>
          </div>
          <div><strong className="text-gray-600">De:</strong> {mensagem.remetente_email}</div>
          {mensagem.destinatarios && (
            <div><strong className="text-gray-600">Para:</strong> {mensagem.destinatarios}</div>
          )}
          {mensagem.assunto && (
            <div><strong className="text-gray-600">Assunto:</strong> {mensagem.assunto}</div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHeaders(true)}
            className="h-6 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            Ver headers completos
          </Button>
        </div>
        
        <div 
          className="prose prose-sm max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(mensagem.conteudo) }}
        />
      </div>

      {/* Separador com histórico */}
      {showThread && threadHistorico.length > 0 && (
        <>
          <div className="border-t-2 border-dashed border-gray-300 my-2 relative">
            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-500 font-medium">
              ---- Histórico ({threadHistorico.length}) ----
            </span>
          </div>

          {threadHistorico.map((msg) => {
            const isExpanded = expandedIds.includes(msg.id);
            
            return (
              <div key={msg.id} className="border-t bg-gray-50">
                <button
                  onClick={() => toggleExpand(msg.id)}
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Mail className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-medium text-xs truncate">
                        {msg.remetente_nome}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(msg.created_date), "dd/MM 'às' HH:mm", { locale: ptBR })}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3">
                    <div 
                      className="prose prose-sm max-w-none text-xs text-gray-700"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(msg.conteudo) }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}
      </div>

      <EmailHeadersModal
        open={showHeaders}
        onClose={() => setShowHeaders(false)}
        mensagem={mensagem}
      />
    </>
  );
}