import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function RespostaViewer({ resposta }) {
  if (!resposta) return null;

  return (
    <Card>
      <CardContent className="pt-4">
        <h3 className="font-semibold text-[var(--text-primary)] mb-2">Resposta da API</h3>
        <pre className="text-xs bg-[var(--bg-tertiary)] p-3 rounded overflow-auto max-h-96">
          {JSON.stringify(resposta, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}