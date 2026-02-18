import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export default function MovimentacoesLista({ movimentacoes }) {
  return (
    <div className="space-y-3">
      {movimentacoes.map((mov) => (
        <Card key={mov.id}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[var(--brand-primary)]" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {new Date(mov.data).toLocaleDateString()}
                  </span>
                  <Badge variant={mov.tipo === 'PUBLICACAO' ? 'default' : 'outline'}>
                    {mov.tipo}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">{mov.conteudo}</p>
                {mov.fonte && (
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">
                    Fonte: {mov.fonte.nome}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}