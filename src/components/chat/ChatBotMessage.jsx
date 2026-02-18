import React from 'react';
import { Bot, User } from 'lucide-react';

export default function ChatBotMessage({ message }) {
  const isBot = message.tipo === 'bot';
  
  return (
    <div className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-[var(--brand-primary)] flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[75%] ${!isBot ? 'order-first' : ''}`}>
        {isBot && (
          <p className="text-xs text-[var(--text-tertiary)] mb-1 ml-1">
            Assistente Virtual
          </p>
        )}
        <div className={`p-3 rounded-lg ${
          isBot 
            ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]' 
            : 'bg-[var(--brand-primary)] text-white'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.texto}</p>
        </div>
      </div>
    </div>
  );
}