import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import AparicaoCard from './AparicaoCard';

export default function MonitoramentoAparicoes({ aparicoes, onToggleVisualizado, onToggleImportante }) {
  if (!aparicoes || aparicoes.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bell className="w-12 h-12 text-[var(--brand-text-tertiary)] mx-auto mb-3" />
          <p className="text-sm text-[var(--brand-text-secondary)]">Nenhuma aparição registrada</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Aparições ({aparicoes.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {aparicoes.map(aparicao => (
          <AparicaoCard
            key={aparicao.id}
            aparicao={aparicao}
            onToggleVisualizado={onToggleVisualizado}
            onToggleImportante={onToggleImportante}
          />
        ))}
      </CardContent>
    </Card>
  );
}