import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import PendenciaItem from './PendenciaItem';

export default function PendenciasPanel({ pendencias }) {
  if (!pendencias?.length) return null;

  return (
    <Card className="border-yellow-200 bg-yellow-50">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          Pendências ({pendencias.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {pendencias.map((p, i) => (
          <PendenciaItem key={i} pendencia={p} />
        ))}
      </CardContent>
    </Card>
  );
}