import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';
import TicketMessages from './TicketMessages';
import TicketInput from './TicketInput';
import TicketHeader from './TicketHeader';

export default function TicketDetail({ ticket, onUpdate }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (ticket) loadMessages();
  }, [ticket]);

  const loadMessages = async () => {
    setLoading(true);
    const data = await base44.entities.TicketMensagem.filter({ ticket_id: ticket.id }, 'created_date');
    setMessages(data);
    setLoading(false);
  };

  const handleSend = async (texto, anexos = []) => {
    const user = await base44.auth.me();
    const tipoRemetente = user.role === 'admin' ? 'admin' : 'cliente';
    
    await base44.entities.TicketMensagem.create({
      ticket_id: ticket.id,
      remetente_email: user.email,
      remetente_nome: user.full_name,
      tipo_remetente: tipoRemetente,
      conteudo: texto,
      anexos: anexos.length > 0 ? anexos : undefined,
      escritorio_id: 'escritorio_padrao'
    });
    await loadMessages();
    onUpdate();
  };

  if (!ticket) {
    return (
      <Card className="lg:col-span-2 p-8 flex items-center justify-center bg-[var(--bg-primary)]">
        <p className="text-[var(--text-secondary)]">Selecione um ticket</p>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2 flex flex-col h-[600px] bg-[var(--bg-primary)]">
      <TicketHeader ticket={ticket} />
      <TicketMessages messages={messages} loading={loading} />
      <TicketInput onSend={handleSend} />
    </Card>
  );
}