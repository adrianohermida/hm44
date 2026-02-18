import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import ChatBotHeader from './chat/ChatBotHeader';
import ChatBotMessage from './chat/ChatBotMessage';
import ChatBotInput from './chat/ChatBotInput';
import { useChatBot } from './chat/useChatBot';

export default function PublicChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, loading, sendMessage } = useChatBot(false);

  const handleSend = (texto) => {
    sendMessage(texto, null, 'Visitante');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[var(--brand-primary)] text-white shadow-lg hover:scale-110 transition-transform z-50"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6 mx-auto" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-[500px] bg-[var(--bg-primary)] rounded-lg shadow-xl z-50 border border-[var(--border-primary)] flex flex-col">
      <ChatBotHeader onClose={() => setIsOpen(false)} />
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <ChatBotMessage key={i} message={msg} />
        ))}
      </div>
      <ChatBotInput onSend={handleSend} disabled={loading} />
    </div>
  );
}