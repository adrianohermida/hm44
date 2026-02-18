import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

export default function DiarioOrigemSelector({ origens, selectedIds, onChange }) {
  const handleToggle = (id) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const groupedByEstado = origens.reduce((acc, origem) => {
    const estado = origem.estado || 'Outros';
    if (!acc[estado]) acc[estado] = [];
    acc[estado].push(origem);
    return acc;
  }, {});

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {Object.entries(groupedByEstado).map(([estado, origensList]) => (
        <div key={estado}>
          <h4 className="text-sm font-semibold mb-2 text-[var(--brand-text-primary)]">{estado}</h4>
          <div className="space-y-2">
            {origensList.map(origem => (
              <label key={origem.id} className="flex items-center gap-2 p-2 hover:bg-[var(--brand-bg-secondary)] rounded cursor-pointer">
                <Checkbox
                  checked={selectedIds.includes(origem.id)}
                  onCheckedChange={() => handleToggle(origem.id)}
                />
                <div className="flex-1">
                  <p className="text-sm text-[var(--brand-text-primary)]">{origem.nome}</p>
                  <p className="text-xs text-[var(--brand-text-tertiary)]">{origem.sigla}</p>
                </div>
                <Badge variant="outline" className="text-xs">{origem.categoria}</Badge>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}