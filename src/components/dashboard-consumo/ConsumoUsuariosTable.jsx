import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function ConsumoUsuariosTable({ consumos }) {
  const usuarios = consumos.reduce((acc, c) => {
    if (!acc[c.usuario_email]) {
      acc[c.usuario_email] = { email: c.usuario_email, creditos: 0, requests: 0 };
    }
    acc[c.usuario_email].creditos += c.creditos_utilizados;
    acc[c.usuario_email].requests += 1;
    return acc;
  }, {});

  const data = Object.values(usuarios).sort((a, b) => b.creditos - a.creditos);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Consumo por Usuário</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {data.slice(0, 10).map(u => (
            <div key={u.email} className="flex items-center justify-between text-sm p-2 bg-[var(--bg-tertiary)] rounded">
              <span className="text-[var(--text-secondary)]">{u.email}</span>
              <span className="font-semibold">{u.creditos} créditos ({u.requests} req)</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}