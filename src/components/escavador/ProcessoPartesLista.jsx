import React from 'react';
import { Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ProcessoParteItem from './ProcessoParteItem';

export default function ProcessoPartesLista({ partes }) {
  if (!partes || partes.length === 0) return null;

  const poloAtivo = partes.filter(p => p.polo === 'ATIVO');
  const poloPassivo = partes.filter(p => p.polo === 'PASSIVO');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Partes Envolvidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {poloAtivo.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-[var(--brand-text-secondary)]">Polo Ativo</h4>
            {poloAtivo.map((parte, idx) => (
              <ProcessoParteItem key={idx} parte={parte} />
            ))}
          </div>
        )}
        {poloPassivo.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-[var(--brand-text-secondary)]">Polo Passivo</h4>
            {poloPassivo.map((parte, idx) => (
              <ProcessoParteItem key={idx} parte={parte} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}