import React from 'react';
import { User, Scale } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function EnvolvidoComAdvogados({ envolvido }) {
  return (
    <div className="p-3 bg-[var(--brand-bg-secondary)] rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-[var(--brand-text-tertiary)]" />
        <p className="font-medium text-sm text-[var(--brand-text-primary)]">{envolvido.nome}</p>
      </div>
      <Badge variant="outline" className="text-xs mb-2">{envolvido.tipo_normalizado}</Badge>
      {envolvido.advogados && envolvido.advogados.length > 0 && (
        <div className="mt-2 pl-3 border-l-2 border-[var(--brand-primary-200)]">
          {envolvido.advogados.map((adv, i) => (
            <div key={i} className="mb-1">
              <div className="flex items-center gap-1">
                <Scale className="w-3 h-3 text-[var(--brand-primary)]" />
                <p className="text-xs text-[var(--brand-text-secondary)]">{adv.nome}</p>
              </div>
              {adv.oabs && adv.oabs.map((oab, j) => (
                <span key={j} className="text-xs text-[var(--brand-text-tertiary)] ml-4">
                  OAB {oab.numero}/{oab.uf}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}