import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ProcessoAssunto({ assunto }) {
  if (!assunto) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <FileText className="w-4 h-4" />
          Assunto
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[var(--brand-text-primary)] leading-relaxed">
          {assunto}
        </p>
      </CardContent>
    </Card>
  );
}