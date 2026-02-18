import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ChatBotHeader from './chat/ChatBotHeader';
import ChatHistoryView from './chat/ChatHistoryView';
import ChatConversationView from './chat/ChatConversationView';
import ChatBotView from './chat/ChatBotView';
import AICapabilitiesBadge from './chat/AICapabilitiesBadge';
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('bot');
  const [user, setUser] = useState(null);
  const [selectedConversa, setSelectedConversa] = useState(null);

  useEffect(() => {
    if (!user) {
      loadUser();
    }
  }, []);

  useEffect(() => {
    const handleOpenChat = (e) => {
      if (user?.role === 'admin') {
        setIsOpen(true);
        setView('history');
        if (e.detail?.clienteEmail) {
          createConversaWithClient(e.detail.clienteEmail, e.detail.clienteNome);
        }
      }
    };

    const handleOpenChatSupport = (e) => {
      // Cliente abrindo balcão virtual de suporte
      setIsOpen(true);
      setView('bot');
    };

    const handleOpenTicketWithProcess = (e) => {
      // Cliente abrindo novo ticket a partir de um processo
      if (user?.role !== 'admin') {
        const event = new CustomEvent('openTicketModal', {
          detail: { 
            processoId: e.detail?.processoId,
            processoTitulo: e.detail?.processoTitulo
          }
        });
        window.dispatchEvent(event);
      }
    };

    window.addEventListener('openChatWithClient', handleOpenChat);
    window.addEventListener('openChatSupport', handleOpenChatSupport);
    window.addEventListener('openTicketWithProcess', handleOpenTicketWithProcess);
    return () => {
      window.removeEventListener('openChatWithClient', handleOpenChat);
      window.removeEventListener('openChatSupport', handleOpenChatSupport);
      window.removeEventListener('openTicketWithProcess', handleOpenTicketWithProcess);
    };
  }, [user]);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
  };

  const createConversaWithClient = async (clienteEmail, clienteNome) => {
    try {
      const { data: existing } = await base44.functions.invoke('findOrCreateConversa', {
        cliente_email: clienteEmail,
        cliente_nome: clienteNome
      });
      
      if (existing?.id) {
        setSelectedConversa(existing);
        setView('conversation');
      }
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
    }
  };

  const handleSelectConversa = (conversa) => {
    setSelectedConversa(conversa);
    setView('conversation');
  };

  const handleBackToHistory = () => {
    setSelectedConversa(null);
    setView('history');
  };

  const getTitle = () => {
    if (view === 'conversation') return selectedConversa?.cliente_nome || 'Conversa';
    if (view === 'history') return 'Histórico';
    return 'Balcão Virtual';
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-28 right-6 w-14 h-14 rounded-full bg-[var(--brand-primary)] text-white shadow-lg hover:scale-110 transition-transform z-[60] lg:bottom-6"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6 mx-auto" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-28 right-6 w-80 h-[500px] bg-[var(--bg-primary)] rounded-lg shadow-xl z-[60] border border-[var(--border-primary)] flex flex-col lg:bottom-6">
      <ChatBotHeader 
        onClose={() => setIsOpen(false)} 
        title={getTitle()}
        view={view}
        onViewChange={setView}
        onBack={view === 'conversation' ? handleBackToHistory : null}
      />
      {user && <AICapabilitiesBadge />}
      {view === 'bot' && <ChatBotView user={user} />}
      {view === 'history' && <ChatHistoryView user={user} onSelectConversa={handleSelectConversa} />}
      {view === 'conversation' && <ChatConversationView conversa={selectedConversa} user={user} />}
    </div>
  );
}