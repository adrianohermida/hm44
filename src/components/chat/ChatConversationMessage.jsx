import React from 'react';
import { Bot, User, UserCheck } from 'lucide-react';

export default function ChatConversationMessage({ mensagem, isCurrentUser }) {
  const isAdmin = mensagem.tipo_remetente === 'admin';
  const isBot = mensagem.tipo_remetente === 'bot';
  
  const getIcon = () => {
    if (isBot) return <Bot className="w-4 h-4 text-white" />;
    if (isAdmin) return <UserCheck className="w-4 h-4 text-[var(--brand-primary)]" />;
    return <User className="w-4 h-4 text-[var(--brand-primary)]" />;
  };

  const getLabel = () => {
    if (isBot) return 'Assistente Virtual';
    if (isAdmin) return mensagem.remetente_nome || 'Equipe';
    return mensagem.remetente_nome || 'Você';
  };

  return (
    <div className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isBot ? 'bg-[var(--brand-primary)]' : 'bg-[var(--brand-primary-100)]'
        }`}>
          {getIcon()}
        </div>
      )}
      <div className={`max-w-[75%] ${isCurrentUser ? 'order-first' : ''}`}>
        {!isCurrentUser && (
          <p className="text-xs text-[var(--text-tertiary)] mb-1 ml-1">
            {getLabel()}
          </p>
        )}
        <div className={`p-3 rounded-lg ${
          isCurrentUser
            ? 'bg-[var(--brand-primary)] text-white'
            : isBot
            ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)]'
            : 'bg-green-50 text-[var(--text-primary)] border border-green-200'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{mensagem.conteudo}</p>
        </div>
      </div>
    </div>
  );
}