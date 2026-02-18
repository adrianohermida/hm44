import React, { useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import TicketMessageItem from './TicketMessageItem';
import { Loader2 } from 'lucide-react';

export default function TicketMessages({ messages, loading }) {
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = React.useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map(msg => (
        <TicketMessageItem key={msg.id} message={msg} currentUser={currentUser} />
      ))}
      {messages.length === 0 && (
        <p className="text-[var(--text-secondary)] text-center">Nenhuma mensagem ainda</p>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}