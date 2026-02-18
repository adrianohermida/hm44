import React from 'react';
import { Card } from '@/components/ui/card';

export default function CSVPreview({ data, mapping }) {
  const preview = data.slice(0, 3);

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-[var(--text-primary)]">
        Preview (3 primeiros registros)
      </h3>
      {preview.map((row, idx) => (
        <Card key={idx} className="p-3 bg-[var(--bg-secondary)]">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            {row[mapping.numero_cnj] || 'Sem número'}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">
            {row[mapping.tribunal]} - {row[mapping.classe]}
          </p>
        </Card>
      ))}
      <p className="text-sm text-[var(--text-tertiary)]">
        Total: {data.length} processos
      </p>
    </div>
  );
}