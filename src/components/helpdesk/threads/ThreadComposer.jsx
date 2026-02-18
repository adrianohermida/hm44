import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

export default function ThreadComposer({ 
  value, 
  onChange, 
  onSubmit, 
  isLoading 
}) {
  return (
    <div className="p-4 border-t border-[var(--border-primary)]">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Digite sua mensagem... Use @email para mencionar alguém"
        rows={3}
        className="mb-2"
      />
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={onSubmit}
          disabled={!value.trim() || isLoading}
          className="bg-[var(--brand-primary)]"
        >
          <Send className="w-3.5 h-3.5 mr-1.5" />
          Enviar
        </Button>
      </div>
    </div>
  );
}