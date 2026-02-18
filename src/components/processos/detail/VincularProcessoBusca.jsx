import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Search } from 'lucide-react';

export default function VincularProcessoBusca({ onBuscar, buscando }) {
  const [cnj, setCnj] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cnj.trim()) {
      onBuscar(cnj.replace(/\D/g, ''));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label>Número CNJ do Processo Principal</Label>
      <div className="flex gap-2">
        <Input
          placeholder="0000000-00.0000.0.00.0000"
          value={cnj}
          onChange={(e) => setCnj(e.target.value)}
          disabled={buscando}
        />
        <Button type="submit" disabled={buscando || !cnj.trim()}>
          {buscando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>
    </form>
  );
}