import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';

export default function ImportPreview({ data, onConfirm, onBack }) {
  const categorias = [...new Set(data.map(e => e.category))];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Preview ({data.length})</span>
          <div className="flex gap-2">
            {categorias.map(c => (
              <Badge key={c} variant="outline">{c}</Badge>
            ))}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-[400px] overflow-y-auto space-y-2">
          {data.slice(0, 15).map((e, i) => (
            <div key={i} className="p-3 bg-[var(--bg-secondary)] rounded-lg">
              <div className="font-semibold">{e.name}</div>
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                {e.category} • {e.version} • {e.provider}
              </div>
            </div>
          ))}
          {data.length > 15 && (
            <p className="text-sm text-[var(--text-tertiary)] text-center py-2">
              + {data.length - 15} endpoints
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} className="flex-1">
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>
          <Button onClick={onConfirm} className="flex-1">
            Importar {data.length} Endpoints
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}