import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User, Building } from 'lucide-react';

export default function ProcessoParteItem({ parte }) {
  const Icon = parte.documento_tipo === 'CNPJ' ? Building : User;

  return (
    <div className="flex items-start gap-3 p-3 bg-[var(--brand-bg-secondary)] rounded-lg mb-2">
      <Icon className="w-4 h-4 mt-1 text-[var(--brand-text-tertiary)]" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-sm text-[var(--brand-text-primary)]">{parte.nome}</p>
          {parte.principal && <Badge variant="outline" className="text-xs">Principal</Badge>}
        </div>
        <p className="text-xs text-[var(--brand-text-secondary)]">{parte.tipo_parte}</p>
        {parte.documento_numero && (
          <p className="text-xs text-[var(--brand-text-tertiary)] mt-1">
            {parte.documento_tipo}: {parte.documento_numero}
          </p>
        )}
        {parte.oabs && parte.oabs.length > 0 && (
          <div className="flex gap-1 mt-1">
            {parte.oabs.map((oab, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                OAB {oab.numero}/{oab.uf}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}