import React, { useRef, useEffect } from 'react';
import ChatConversationMessage from './ChatConversationMessage';

export default function ChatConversationMessages({ mensagens, currentUser }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {mensagens.map(msg => (
        <ChatConversationMessage 
          key={msg.id} 
          mensagem={msg} 
          isCurrentUser={msg.remetente_email === currentUser?.email}
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}