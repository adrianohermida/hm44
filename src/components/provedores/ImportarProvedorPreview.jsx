import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function ImportarProvedorPreview({ preview }) {
  return (
    <Card>
      <CardContent className="pt-4">
        <p className="text-sm font-medium mb-2">
          {preview.total} provedores encontrados (mostrando 5)
        </p>
        <div className="space-y-2">
          {preview.sample.map((item, i) => (
            <div key={i} className="p-2 bg-[var(--bg-secondary)] rounded text-xs">
              <strong>{item.nome}</strong> · {item.tipo} · {item.url_base}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}