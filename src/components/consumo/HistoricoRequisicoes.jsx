import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function HistoricoRequisicoes({ requisicoes }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimas Requisições</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {requisicoes.map(r => (
            <div key={r.id} className="flex items-center justify-between p-2 border rounded">
              <div>
                <p className="text-sm font-medium">{r.endpoint}</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {new Date(r.created_date).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={r.sucesso ? 'default' : 'destructive'}>
                  {r.creditos} créditos
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}