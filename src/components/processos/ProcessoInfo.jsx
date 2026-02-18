import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, User, Gavel, Calendar } from 'lucide-react';

export default function ProcessoInfo({ processo }) {
  return (
    <Card className="border-[var(--border-primary)]">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">Informações Básicas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {processo.tribunal && (
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-primary)]">{processo.tribunal}</span>
          </div>
        )}
        {processo.classe && (
          <div className="flex items-center gap-2">
            <Gavel className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-primary)]">{processo.classe}</span>
          </div>
        )}
        {processo.data_distribuicao && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-primary)]">{processo.data_distribuicao}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}