import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ProcessoMarcarClienteList({ 
  partes, 
  selected, 
  onToggle 
}) {
  if (partes.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        <p className="text-sm">Nenhuma parte encontrada</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full pr-4">
      <div className="space-y-2">
        {partes.map((parte) => (
          <div
            key={parte.id}
            className="flex items-start gap-3 p-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            onClick={() => onToggle(parte.id)}
          >
            <Checkbox
              checked={selected.includes(parte.id)}
              onCheckedChange={() => onToggle(parte.id)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-[var(--text-primary)]">{parte.nome}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge variant="outline" className="text-xs">
                  {parte.tipo_parte === 'polo_ativo' ? 'Ativo' : 
                   parte.tipo_parte === 'polo_passivo' ? 'Passivo' : 'Terceiro'}
                </Badge>
                {parte.cpf_cnpj && (
                  <span className="text-xs text-[var(--text-secondary)]">
                    {parte.cpf_cnpj}
                  </span>
                )}
                {parte.qualificacao && (
                  <Badge className="text-xs bg-[var(--brand-primary)] text-white">
                    {parte.qualificacao}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}