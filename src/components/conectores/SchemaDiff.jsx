import React from 'react';
import { Badge } from '@/components/ui/badge';

export default function SchemaDiff({ anterior, novo, path = '' }) {
  const diffs = [];

  const compare = (a, b, currentPath) => {
    if (a?.type !== b?.type) {
      diffs.push({ path: currentPath, tipo: 'TIPO_MUDOU', de: a?.type, para: b?.type });
    }

    if (a?.type === 'object' && b?.type === 'object') {
      const keysA = Object.keys(a.properties || {});
      const keysB = Object.keys(b.properties || {});

      keysA.forEach(k => {
        if (!keysB.includes(k)) {
          diffs.push({ path: `${currentPath}.${k}`, tipo: 'REMOVIDO' });
        }
      });

      keysB.forEach(k => {
        if (!keysA.includes(k)) {
          diffs.push({ path: `${currentPath}.${k}`, tipo: 'ADICIONADO' });
        } else {
          compare(a.properties[k], b.properties[k], `${currentPath}.${k}`);
        }
      });
    }
  };

  compare(anterior, novo, path || 'root');

  if (diffs.length === 0) {
    return <p className="text-sm text-[var(--text-secondary)]">Schemas idênticos</p>;
  }

  return (
    <div className="space-y-2">
      {diffs.map((d, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <Badge variant={d.tipo === 'REMOVIDO' ? 'destructive' : d.tipo === 'ADICIONADO' ? 'default' : 'secondary'}>
            {d.tipo}
          </Badge>
          <code className="text-xs">{d.path}</code>
          {d.de && <span className="text-[var(--text-tertiary)]">{d.de} → {d.para}</span>}
        </div>
      ))}
    </div>
  );
}