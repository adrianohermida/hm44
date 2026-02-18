import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export default function TribunalCard({ tribunal }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-[var(--brand-primary)]" />
          <div className="flex-1">
            <p className="font-semibold text-[var(--text-primary)]">{tribunal.nome}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{tribunal.sigla}</Badge>
              <span className="text-xs text-[var(--text-tertiary)]">{tribunal.categoria}</span>
            </div>
            {tribunal.estados && (
              <p className="text-xs text-[var(--text-secondary)] mt-2">
                {tribunal.estados.map(e => e.sigla).join(', ')}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}