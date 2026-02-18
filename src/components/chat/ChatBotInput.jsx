import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

export default function ChatBotInput({ onSend, disabled }) {
  const [texto, setTexto] = useState('');

  const handleSend = () => {
    if (!texto.trim()) return;
    onSend(texto);
    setTexto('');
  };

  return (
    <div className="p-3 border-t border-[var(--border-primary)] flex gap-2">
      <Input
        placeholder="Digite sua mensagem..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        disabled={disabled}
        className="flex-1"
      />
      <Button onClick={handleSend} disabled={disabled} className="bg-[var(--brand-primary)]">
        <Send className="w-4 h-4" />
      </Button>
    </div>
  );
}