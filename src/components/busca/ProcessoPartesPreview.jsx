import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle2, Briefcase } from 'lucide-react';

export default function ProcessoPartesPreview({ partes }) {
  const cliente = partes.find(p => p.e_cliente_escritorio);
  const ativas = partes.filter(p => p.tipo_parte === 'polo_ativo').length;
  const passivas = partes.filter(p => p.tipo_parte === 'polo_passivo').length;

  return (
    <Card className="p-3 bg-[var(--brand-bg-secondary)]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-[var(--brand-text-secondary)]" />
          <span className="text-sm font-medium text-[var(--brand-text-primary)]">
            {partes.length} parte(s)
          </span>
        </div>
        <div className="flex gap-1 text-xs">
          <Badge variant="outline" className="text-[10px]">{ativas} ativo</Badge>
          <Badge variant="outline" className="text-[10px]">{passivas} passivo</Badge>
        </div>
      </div>
      <div className="space-y-1.5">
        {partes.slice(0, 2).map((parte, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            {parte.e_cliente_escritorio && (
              <CheckCircle2 className="w-3 h-3 text-[var(--brand-success)] flex-shrink-0" />
            )}
            <span className={parte.e_cliente_escritorio ? 'font-semibold text-[var(--brand-success)]' : 'text-[var(--brand-text-secondary)]'}>
              {parte.nome}
            </span>
            {parte.advogados?.length > 0 && (
              <Briefcase className="w-3 h-3 text-[var(--brand-text-tertiary)]" />
            )}
          </div>
        ))}
        {partes.length > 2 && (
          <p className="text-[10px] text-[var(--brand-text-tertiary)] mt-1">
            +{partes.length - 2} parte(s)
          </p>
        )}
      </div>
    </Card>
  );
}