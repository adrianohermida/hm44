import React from 'react';
import ChatBotMessage from './ChatBotMessage';
import ChatBotInput from './ChatBotInput';
import { useChatBot } from './useChatBot';

export default function ChatBotView({ user }) {
  const isAuthenticated = !!user;
  const { messages, loading, sendMessage } = useChatBot(isAuthenticated);

  const handleSend = (texto) => {
    if (user) {
      sendMessage(texto, user.email, user.full_name);
    } else {
      sendMessage(texto);
    }
  };

  return (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <ChatBotMessage key={i} message={msg} />
        ))}
      </div>
      <ChatBotInput onSend={handleSend} disabled={loading} />
    </>
  );
}