import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function ResumoIACard({ resumo }) {
  if (!resumo?.conteudo) return null;

  return (
    <Card className="border-l-4 border-l-[var(--brand-primary)]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="w-4 h-4 text-[var(--brand-primary)]" />
          Resumo Inteligente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--brand-text-secondary)] leading-relaxed whitespace-pre-wrap">
          {resumo.conteudo}
        </p>
      </CardContent>
    </Card>
  );
}