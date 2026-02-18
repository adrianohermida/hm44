import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const pacotes = [
  { creditos: 100, valor: 99, economia: 0 },
  { creditos: 500, valor: 449, economia: 10 },
  { creditos: 1000, valor: 799, economia: 20 }
];

export default function PacotesCreditosGrid() {
  const comprar = async (pacote) => {
    try {
      const { data } = await base44.functions.invoke('criarCheckoutSession', pacote);
      window.location.href = data.url;
    } catch {
      toast.error('Erro ao criar sessão');
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {pacotes.map(p => (
        <Card key={p.creditos}>
          <CardHeader>
            <CardTitle>{p.creditos} créditos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold">R$ {p.valor}</p>
            {p.economia > 0 && <p className="text-sm text-green-600">Economize {p.economia}%</p>}
            <Button onClick={() => comprar(p)} className="w-full">Comprar</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}