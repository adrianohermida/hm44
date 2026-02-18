import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Send } from 'lucide-react';

export default function EmailComposer({ defaultTo, onSuccess }) {
  const [to, setTo] = useState(defaultTo || '');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await base44.functions.invoke('sendEmail', { to, subject, body });
      setTo('');
      setSubject('');
      setBody('');
      onSuccess?.();
    } catch (error) {
      alert('Erro ao enviar e-mail');
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="space-y-4">
      <Input
        type="email"
        placeholder="Para"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        required
      />
      <Input
        placeholder="Assunto"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <Textarea
        placeholder="Mensagem"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        required
      />
      <Button type="submit" disabled={sending} className="w-full">
        <Send className="w-4 h-4 mr-2" />
        {sending ? 'Enviando...' : 'Enviar E-mail'}
      </Button>
    </form>
  );
}