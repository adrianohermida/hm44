import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function AITemplateGenerator({ onGenerate, isLoading }) {
  const [prompt, setPrompt] = useState('');

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[var(--brand-primary)]" />
        Gerar Template com IA
      </h3>
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Descreva o email que deseja criar... Ex: Email profissional sobre novos serviços de direito trabalhista, com tom formal e call-to-action para agendamento de consulta"
        className="min-h-[120px] mb-4"
      />
      <Button 
        onClick={() => onGenerate(prompt)}
        disabled={!prompt || isLoading}
        className="w-full bg-[var(--brand-primary)]"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {isLoading ? 'Gerando...' : 'Gerar Template'}
      </Button>
    </Card>
  );
}