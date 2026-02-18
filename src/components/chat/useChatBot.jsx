import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useChatBot(isAuthenticated = false) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [conversaId, setConversaId] = useState(null);
  const [tentativas, setTentativas] = useState(0);

  useEffect(() => {
    initChat();
  }, []);

  const initChat = async () => {
    // Recuperar conversaId do localStorage (visitantes)
    if (!isAuthenticated) {
      const savedConversaId = localStorage.getItem('chat_conversa_id');
      if (savedConversaId) {
        setConversaId(savedConversaId);
      }
    }
    
    const boasVindas = isAuthenticated
      ? 'Olá! Como posso ajudá-lo hoje? Estou aqui para responder suas dúvidas sobre seu processo.'
      : 'Olá! Bem-vindo ao escritório Dr. Adriano Hermida Maia. Como posso ajudá-lo?\n\nSe você já é nosso cliente, por favor faça login para acessar o atendimento no ambiente seguro.';
    
    setMessages([{ tipo: 'bot', texto: boasVindas }]);
  };

  const sendMessage = async (texto, userEmail = null, userName = null) => {
    setMessages(prev => [...prev, { tipo: 'user', texto }]);
    setLoading(true);
    setTentativas(prev => prev + 1);

    try {
      const response = await base44.functions.invoke('chatbot', {
        message: texto,
        isAuthenticated,
        userEmail,
        userName,
        conversaId,
        tentativas
      });

      const botResponse = response.data.response;
      const data = response.data;
      
      let mensagemFinal = botResponse;
      
      if (data.ticketCriado) {
        mensagemFinal += '\n\n✅ Um ticket de atendimento foi criado. Nossa equipe entrará em contato em breve!';
      } else if (data.precisaHumano && data.horarioComercial) {
        mensagemFinal += '\n\n👤 Você será encaminhado para atendimento humano em breve.';
      }
      
      setMessages(prev => [...prev, { tipo: 'bot', texto: mensagemFinal }]);
      
      // Persistir conversaId SEMPRE (autenticado ou visitante)
      if (data.conversaId && !conversaId) {
        setConversaId(data.conversaId);
        
        // Salvar no localStorage para visitantes
        if (!isAuthenticated) {
          localStorage.setItem('chat_conversa_id', data.conversaId);
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        tipo: 'bot', 
        texto: 'Desculpe, ocorreu um erro. Por favor, tente novamente.' 
      }]);
    }
    
    setLoading(false);
  };

  return { messages, loading, sendMessage };
}