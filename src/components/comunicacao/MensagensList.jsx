import React, { useRef, useEffect } from 'react';
import MensagemItem from './MensagemItem';

export default function MensagensList({ mensagens }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[var(--bg-primary)]">
      {mensagens.map(msg => (
        <MensagemItem key={msg.id} mensagem={msg} />
      ))}
      <div ref={endRef} />
    </div>
  );
}