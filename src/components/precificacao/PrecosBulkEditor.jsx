import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function PrecosBulkEditor({ precos, onApply }) {
  const [margem, setMargem] = useState({ percentual: 30, valor: 0 });

  const aplicar = () => {
    const updated = precos.map(p => {
      const base = p.valor_referencia || 0;
      const margemPerc = margem.percentual / 100;
      const precoVenda = base + (base * margemPerc) + margem.valor;
      return {
        ...p,
        margem_percentual: margem.percentual,
        margem_valor: margem.valor,
        preco_venda: precoVenda
      };
    });
    onApply(updated);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">Edição em Lote</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 items-end">
        <div>
          <Label>Margem %</Label>
          <Input
            type="number"
            value={margem.percentual}
            onChange={(e) => setMargem({ ...margem, percentual: parseFloat(e.target.value) })}
            className="w-24"
          />
        </div>
        <div>
          <Label>Margem R$</Label>
          <Input
            type="number"
            value={margem.valor}
            onChange={(e) => setMargem({ ...margem, valor: parseFloat(e.target.value) })}
            className="w-28"
          />
        </div>
        <Button onClick={aplicar}>Aplicar em Todos ({precos.length})</Button>
      </CardContent>
    </Card>
  );
}