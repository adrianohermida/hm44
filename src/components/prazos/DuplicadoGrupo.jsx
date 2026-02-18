import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Merge } from 'lucide-react';

export default function DuplicadoGrupo({ grupo, onMesclar }) {
  const [selecionado, setSelecionado] = useState(grupo[0].id);

  const handleMesclar = () => {
    const excluir = grupo.filter(p => p.id !== selecionado).map(p => p.id);
    onMesclar({ manter: selecionado, excluir });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-sm">{grupo[0].titulo}</p>
          <Button size="sm" onClick={handleMesclar}>
            <Merge className="w-4 h-4 mr-2" />
            Mesclar
          </Button>
        </div>
        {grupo.map(prazo => (
          <div key={prazo.id} className="flex items-center gap-2 p-2 border rounded">
            <Checkbox
              checked={selecionado === prazo.id}
              onCheckedChange={() => setSelecionado(prazo.id)}
            />
            <span className="text-sm">ID: {prazo.id.slice(0, 8)}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}