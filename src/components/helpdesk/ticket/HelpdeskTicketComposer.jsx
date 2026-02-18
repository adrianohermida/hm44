import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { debounce } from 'lodash';
import { StickyNote } from 'lucide-react';
import HelpdeskAISuggestions from './HelpdeskAISuggestions';
import ComposerEditor from '../composer/ComposerEditor';
import ComposerActions from '../composer/ComposerActions';
import EncaminharEmailModal from '../modals/EncaminharEmailModal';
import TemplatesSelectorPanel from '../composer/TemplatesSelectorPanel';
import TemplatePreviewModal from '../composer/TemplatePreviewModal';

const HelpdeskTicketComposer = React.forwardRef(({ ticket, modoNota: modoNotaProp, onModoNotaChange }, ref) => {
  const [conteudo, setConteudo] = useState('');
  const [showAI, setShowAI] = useState(false);
  const [modoNota, setModoNota] = useState(false);
  const [showEncaminhar, setShowEncaminhar] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templatePreview, setTemplatePreview] = useState(null);
  const [anexos, setAnexos] = useState([]);
  const textareaRef = useRef(null);
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (modoNotaProp !== undefined) {
      setModoNota(modoNotaProp);
    }
  }, [modoNotaProp]);

  React.useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus()
  }));

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates-atalhos', user?.escritorio_id],
    queryFn: () => base44.entities.TemplateResposta.filter({
      escritorio_id: user.escritorio_id,
      ativo: true
    }),
    enabled: !!user?.escritorio_id
  });

  const enviarMutation = useMutation({
    mutationFn: async (mensagemData) => {
      const user = await base44.auth.me();
      const escritorios = await base44.entities.Escritorio.list();

      // Se for nota interna
      if (mensagemData.is_internal_note) {
        await base44.entities.TicketMensagem.create({
          ticket_id: ticket.id,
          remetente_email: user.email,
          remetente_nome: user.full_name,
          tipo_remetente: 'agente',
          conteudo: mensagemData.conteudo,
          canal: 'email',
          escritorio_id: escritorios[0].id,
          is_internal_note: true,
          anexos: anexos.map(a => ({ 
            nome: a.filename, 
            size: a.size,
            tipo: a.type,
            content: a.content
          }))
        });

        await base44.entities.Ticket.update(ticket.id, {
          ultima_atualizacao: new Date().toISOString()
        });

        return { success: true, type: 'nota' };
      }

      // Se for resposta normal
      const emailResponse = await base44.functions.invoke('sendEmailSendGrid', {
        to: ticket.cliente_email,
        subject: `Re: ${ticket.titulo} [ticket-${ticket.id.substring(0, 8)}]`,
        body: mensagemData.conteudo,
        ticket_id: ticket.id,
        attachments: anexos.map(a => ({
          content: a.content,
          filename: a.filename,
          type: a.type
        }))
      });
      
      const mensagem = await base44.entities.TicketMensagem.create({
        ticket_id: ticket.id,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: 'agente',
        conteudo: mensagemData.conteudo,
        canal: 'email',
        escritorio_id: escritorios[0].id,
        is_internal_note: false,
        anexos: anexos.map(a => ({ 
          nome: a.filename, 
          size: a.size,
          tipo: a.type,
          content: a.content
        }))
      });

      await base44.entities.EmailStatus.create({
        ticket_id: ticket.id,
        mensagem_id: mensagem.id,
        sendgrid_message_id: emailResponse.data.message_id,
        destinatario_email: ticket.cliente_email,
        assunto: `Re: ${ticket.titulo}`,
        status: 'enviando',
        timestamp_envio: new Date().toISOString()
      });

      const updateData = {
        ultima_atualizacao: new Date().toISOString()
      };
      
      if (!ticket.tempo_primeira_resposta) {
        updateData.tempo_primeira_resposta = new Date().toISOString();
        updateData.status = 'em_atendimento';
      } else if (mensagemData.novo_status) {
        updateData.status = mensagemData.novo_status;
        if (mensagemData.novo_status === 'resolvido') {
          updateData.tempo_resolucao = new Date().toISOString();
        }
      } else {
        updateData.status = 'aguardando_cliente';
      }
      
      await base44.entities.Ticket.update(ticket.id, updateData);

      return emailResponse.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['ticket-mensagens', ticket.id]);
      queryClient.invalidateQueries(['helpdesk-tickets']);
      setConteudo('');
      setAnexos([]);
      setModoNota(false);
      toast.success(data?.type === 'nota' ? 'Nota interna adicionada' : 'Resposta enviada');
    }
  });

  const handleTypingStop = useCallback(() => {
    if (!ticket?.id) return;
    base44.functions.invoke('typingIndicator', {
      action: 'stop',
      ticket_id: ticket.id
    }).catch(() => {});
  }, [ticket?.id]);

  const debouncedTypingStart = useCallback(
    debounce(() => {
      if (!ticket?.id) return;
      base44.functions.invoke('typingIndicator', {
        action: 'start',
        ticket_id: ticket.id
      }).catch(() => {});
    }, 500),
    [ticket?.id]
  );

  useEffect(() => {
    return () => {
      handleTypingStop();
      debouncedTypingStart.cancel();
    };
  }, [ticket?.id]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (conteudo.trim()) {
      handleTypingStop();
      enviarMutation.mutate({ 
        conteudo,
        is_internal_note: modoNota 
      });
    }
  };

  const handleSubmitWithStatus = (novoStatus) => {
    if (conteudo.trim()) {
      handleTypingStop();
      enviarMutation.mutate({ 
        conteudo, 
        novo_status: novoStatus,
        is_internal_note: false 
      });
    }
  };

  const detectarAtalho = useCallback((texto) => {
    const match = texto.match(/\/(\w+)\s$/);
    if (!match) return null;
    
    const atalho = `/${match[1]}`;
    return templates.find(t => t.atalho === atalho);
  }, [templates]);

  const handleSelectTemplate = (template, usarDireto = false) => {
    if (usarDireto) {
      // Atalho digitado - aplicar direto
      base44.functions.invoke('helpdesk/processarTemplateVariaveis', {
        template_id: template.id,
        ticket_id: ticket.id
      }).then(response => {
        if (response.data.success) {
          const atalhoRegex = new RegExp(`${template.atalho}\\s?$`);
          const novoConteudo = conteudo.replace(atalhoRegex, '') + response.data.corpo;
          setConteudo(novoConteudo);
          toast.success(`✨ ${template.nome}`);
        }
      }).catch(() => toast.error('Erro ao processar template'));
    } else {
      // Botão - mostrar preview
      setTemplatePreview(template);
    }
  };

  const handleSelectSuggestion = (sugestao) => {
    setConteudo(sugestao.resposta);
    setShowAI(false);
  };

  const handleInsertTag = (before, after) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = conteudo;
    const selectedText = text.substring(start, end);

    const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
    setConteudo(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  return (
    <div className="border-t border-[var(--border-primary)] bg-[var(--bg-elevated)]">
          {showAI && (
            <HelpdeskAISuggestions
              ticketId={ticket.id}
              onSelect={handleSelectSuggestion}
              onClose={() => setShowAI(false)}
            />
          )}

          {showEncaminhar && (
            <EncaminharEmailModal
              open={showEncaminhar}
              onClose={() => setShowEncaminhar(false)}
              ticket={ticket}
              conteudoOriginal={conteudo}
            />
          )}

          {showTemplates && (
            <TemplatesSelectorPanel
              escritorioId={ticket.escritorio_id}
              onSelect={(template) => handleSelectTemplate(template, false)}
              onClose={() => setShowTemplates(false)}
            />
          )}

          {templatePreview && (
            <TemplatePreviewModal
              template={templatePreview}
              ticket={ticket}
              open={!!templatePreview}
              onClose={() => setTemplatePreview(null)}
              onConfirm={(corpo) => setConteudo(corpo)}
            />
          )}

          <form onSubmit={handleSubmit}>
            {modoNota && (
              <div className="mx-4 mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded flex items-center gap-2 text-xs">
                <StickyNote className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-700 font-medium">Modo Nota Interna - Não será enviado ao cliente</span>
              </div>
            )}

            <div className="p-4 pb-2">
              <ComposerEditor
                value={conteudo}
                onChange={(value) => {
                  setConteudo(value);
                  if (!modoNota) debouncedTypingStart();

                  const templateAtalho = detectarAtalho(value);
                  if (templateAtalho) {
                    handleSelectTemplate(templateAtalho, true);
                  }
                }}
                placeholder={modoNota ? "Nota interna (não visível ao cliente)..." : "Digite sua resposta ou use atalhos como /bv..."}
                ref={textareaRef}
                anexos={anexos}
                onAnexosChange={setAnexos}
              />
            </div>

            <ComposerActions
              onToggleAI={() => setShowAI(!showAI)}
              onToggleTemplates={() => setShowTemplates(!showTemplates)}
              onToggleNota={() => {
                const novoModo = !modoNota;
                setModoNota(novoModo);
                onModoNotaChange?.(novoModo);
              }}
              onEncaminhar={() => setShowEncaminhar(true)}
              onSubmit={handleSubmit}
              onSubmitWithStatus={!modoNota ? handleSubmitWithStatus : undefined}
              disabled={!conteudo.trim()}
              isLoading={enviarMutation.isPending}
            />
          </form>
        </div>
  );
});

HelpdeskTicketComposer.displayName = 'HelpdeskTicketComposer';

export default HelpdeskTicketComposer;