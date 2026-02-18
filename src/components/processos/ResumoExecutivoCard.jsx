import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export default function ResumoExecutivoCard({ resumo }) {
  if (!resumo) return null;

  return (
    <Card className="border-[var(--border-primary)] bg-gradient-to-br from-[var(--brand-primary-50)] to-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
          <Sparkles className="w-5 h-5 text-[var(--brand-primary)]" />
          Resumo Executivo (IA)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">{resumo}</p>
      </CardContent>
    </Card>
  );
}