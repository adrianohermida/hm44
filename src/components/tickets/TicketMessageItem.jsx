import React from 'react';
import { format } from 'date-fns';
import MessageAvatar from './MessageAvatar';
import MessageAttachments from './MessageAttachments';

export default function TicketMessageItem({ message, currentUser }) {
  const isOwn = message.remetente_email === currentUser?.email;
  const isAdmin = message.tipo_remetente === 'admin';

  return (
    <div className={`flex gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <MessageAvatar remetente={message.remetente_nome} tipo={message.tipo_remetente} />
      )}
      
      <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isOwn && (
          <span className="text-xs font-medium text-[var(--text-secondary)] px-1">
            {message.remetente_nome}
          </span>
        )}
        <div className={`p-3 rounded-2xl ${
          isOwn 
            ? 'bg-[var(--brand-primary)] text-white rounded-br-sm' 
            : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] rounded-bl-sm'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">{message.conteudo}</p>
          <MessageAttachments anexos={message.anexos} />
          <p className={`text-xs mt-1 ${isOwn ? 'text-white/70' : 'text-[var(--text-tertiary)]'}`}>
            {format(new Date(message.created_date), 'dd/MM HH:mm')}
          </p>
        </div>
      </div>

      {isOwn && (
        <MessageAvatar remetente={message.remetente_nome} tipo={message.tipo_remetente} />
      )}
    </div>
  );
}