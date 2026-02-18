import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AndamentosList from './AndamentosList';

export default function AndamentosTimeline({ andamentos, onSelect }) {
  return (
    <Card className="border-[var(--border-primary)]">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">Linha do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        <AndamentosList andamentos={andamentos} onSelect={onSelect} />
      </CardContent>
    </Card>
  );
}