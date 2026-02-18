import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, AlertCircle, Wifi } from "lucide-react";
import { toast } from "sonner";
import { useChatRealtimeSync } from "@/components/hooks/useChatRealtimeSync";

export default function ComunicacaoClienteChat({ conversaId, user, clienteId }) {
  const [mensagem, setMensagem] = useState("");
  const [realTimeActive, setRealTimeActive] = useState(true);
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Real-time subscriptions com fallback para polling
  useChatRealtimeSync(conversaId, true);

  useEffect(() => {
    if (!conversaId) return;
    
    // Fallback polling se subscriptions falharem
    const pollInterval = setInterval(async () => {
      try {
        queryClient.invalidateQueries({ queryKey: ['conversa-mensagens', conversaId] });
      } catch (error) {
        console.warn('Polling fallback ativo:', error);
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [conversaId, queryClient]);

  const { data: mensagens = [], isLoading } = useQuery({
    queryKey: ['conversa-mensagens', conversaId],
    queryFn: async () => {
      if (!conversaId) return [];
      try {
        return await base44.entities.Mensagem.filter({ conversa_id: conversaId }, 'created_date', 100);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        return [];
      }
    },
    enabled: !!conversaId,
    staleTime: 1000
  });

  const createMensagemMutation = useMutation({
    mutationFn: async (text) => {
      return await base44.entities.Mensagem.create({
        conversa_id: conversaId,
        conteudo: text,
        cliente_id: clienteId,
        usuario_email: user.email,
        tipo: 'cliente',
        lida: false
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversa-mensagens', conversaId] });
      toast.success('Mensagem enviada');
      setMensagem("");
    },
    onError: (error) => {
      toast.error('Erro ao enviar mensagem: ' + error.message);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const handleSendMensagem = (e) => {
    e.preventDefault();
    if (!mensagem.trim()) return;
    createMensagemMutation.mutate(mensagem);
  };

  if (!conversaId) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center h-64 gap-2 text-[var(--text-secondary)]">
            <AlertCircle className="w-6 h-6" />
            <p className="text-sm">Nenhuma conversa selecionada</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-[var(--text-secondary)]">Carregando usuário...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-[500px]">
      <CardHeader className="border-b flex justify-between items-center">
        <CardTitle className="text-base">Chat Direto</CardTitle>
        <div className="flex items-center gap-2">
          <Wifi className={`w-4 h-4 ${realTimeActive ? 'text-[var(--brand-primary)]' : 'text-[var(--text-tertiary)]'}`} />
          <span className="text-xs text-[var(--text-tertiary)]">
            {realTimeActive ? 'Sincronizando' : 'Polling'}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {mensagens.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--text-secondary)] text-sm">
            Nenhuma mensagem ainda. Inicie uma conversa!
          </div>
        ) : (
          <>
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.tipo === 'cliente' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.tipo === 'cliente'
                      ? 'bg-[var(--brand-primary)] text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                  }`}
                >
                  <p className="text-sm">{msg.conteudo}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(msg.created_date).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </CardContent>

      <div className="border-t p-4">
        <form onSubmit={handleSendMensagem} className="flex gap-2">
          <Input
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            placeholder="Digite sua mensagem..."
            disabled={createMensagemMutation.isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={createMensagemMutation.isPending || !mensagem.trim()}
          >
            {createMensagemMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>
    </Card>
  );
}