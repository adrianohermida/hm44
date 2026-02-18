import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ChatConversationMessages from './ChatConversationMessages';
import ChatBotInput from './ChatBotInput';

export default function ChatConversationView({ conversa, user }) {
  const [mensagens, setMensagens] = useState([]);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (conversa) loadMensagens();
  }, [conversa]);

  const loadMensagens = async () => {
    const data = await base44.entities.Mensagem.filter(
      { conversa_id: conversa.id },
      'created_date'
    );
    setMensagens(data);
    setLoading(false);
  };

  const sendMutation = useMutation({
    mutationFn: async (texto) => {
      return await base44.entities.Mensagem.create({
        conversa_id: conversa.id,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: user.role === 'admin' ? 'admin' : 'cliente',
        conteudo: texto,
        escritorio_id: conversa.escritorio_id
      });
    },
    onSuccess: () => {
      loadMensagens();
      queryClient.invalidateQueries({ queryKey: ['conversas'] });
    },
    onError: (error) => {
      console.error('Erro ao enviar mensagem:', error);
    }
  });

  const handleSend = (texto) => {
    sendMutation.mutate(texto);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--text-secondary)] text-sm">Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <ChatConversationMessages mensagens={mensagens} currentUser={user} />
      <ChatBotInput onSend={handleSend} disabled={sendMutation.isPending} />
    </>
  );
}