import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Paperclip, CheckCircle, StickyNote, MoreVertical, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import EmailStatusBadge from '../EmailStatusBadge';
import EmailHeadersModal from './EmailHeadersModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function HelpdeskMessageItem({ mensagem }) {
  const [showHeaders, setShowHeaders] = useState(false);
  const isCliente = mensagem.tipo_remetente === 'cliente';
  const isNotaInterna = mensagem.is_internal_note;
  
  const sanitizedContent = useMemo(() => {
    // Basic sanitization - remove scripts and dangerous tags
    const temp = document.createElement('div');
    temp.innerHTML = mensagem.conteudo;
    const scripts = temp.querySelectorAll('script, iframe, object, embed');
    scripts.forEach(s => s.remove());
    return temp.innerHTML;
  }, [mensagem.conteudo]);
  
  const { data: emailStatus } = useQuery({
    queryKey: ['email-status-msg', mensagem.id],
    queryFn: async () => {
      const result = await base44.entities.EmailStatus.filter({ mensagem_id: mensagem.id });
      return result[0];
    },
    enabled: mensagem.canal === 'email' && !isCliente
  });

  if (isNotaInterna) {
    return (
      <div className="flex justify-center">
        <div className="max-w-[90%] bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2 text-xs text-yellow-700 mb-1">
            <StickyNote className="w-3 h-3" />
            <span className="font-medium">Nota Interna</span>
            <span>• {mensagem.remetente_nome} • {format(new Date(mensagem.created_date), "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
          </div>
          <div 
            className="text-sm text-gray-700 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          {mensagem.anexos && mensagem.anexos.length > 0 && (
            <div className="mt-2 space-y-1">
              {mensagem.anexos.map((anexo, idx) => (
                <a
                  key={idx}
                  href={anexo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-yellow-600 hover:underline"
                >
                  <Paperclip className="w-3 h-3" />
                  {anexo.nome}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`flex ${isCliente ? 'justify-start' : 'justify-end'} group`}>
        <div className={`max-w-[75%] ${isCliente ? '' : 'text-right'}`}>
          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)] mb-1">
            <span>{mensagem.remetente_nome} • {format(new Date(mensagem.created_date), "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
            {emailStatus && <EmailStatusBadge status={emailStatus.status} showIcon={false} />}
            {mensagem.canal === 'email' && !isCliente && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowHeaders(true)}>
                    <Eye className="w-3 h-3 mr-2" />
                    Ver cabeçalhos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          {mensagem.lida && (
            <div className="flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Lido {format(new Date(mensagem.lida_em), "HH:mm")}
            </div>
          )}
        </div>
        <div
          className={`rounded-lg px-4 py-2 ${
            isCliente
              ? 'bg-white border border-[var(--border-primary)] text-[var(--text-primary)]'
              : 'bg-[var(--brand-primary)] text-white'
          }`}
        >
          <div 
            className={`text-sm break-words prose prose-sm max-w-none ${
              isCliente ? 'prose-slate' : 'prose-invert'
            }`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
          {mensagem.anexos && mensagem.anexos.length > 0 && (
            <div className="mt-2 space-y-1">
              {mensagem.anexos.map((anexo, idx) => (
                <a
                  key={idx}
                  href={anexo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-xs ${
                    isCliente ? 'text-[var(--brand-primary)]' : 'text-white/90'
                  } hover:underline`}
                >
                  <Paperclip className="w-3 h-3" />
                  {anexo.nome}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

    <EmailHeadersModal
      open={showHeaders}
      onClose={() => setShowHeaders(false)}
      mensagem={mensagem}
      emailStatus={emailStatus}
    />
  </>
  );
}