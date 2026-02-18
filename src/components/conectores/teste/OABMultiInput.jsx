import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function OABMultiInput({ values = [], onChange }) {
  const [numero, setNumero] = useState('');
  const [uf, setUf] = useState('');

  const handleAdd = () => {
    if (numero.trim() && uf.trim()) {
      onChange([...values, { numero: numero.trim(), uf: uf.trim().toUpperCase() }]);
      setNumero('');
      setUf('');
    }
  };

  const handleRemove = (idx) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <label className="text-xs font-semibold text-[var(--text-secondary)] mb-1 block">OABs</label>
      <div className="flex gap-2 mb-2">
        <Input
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Número"
          className="flex-1"
        />
        <Input
          value={uf}
          onChange={(e) => setUf(e.target.value)}
          placeholder="UF"
          className="w-16"
          maxLength={2}
        />
        <Button type="button" size="sm" onClick={handleAdd} variant="outline">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {values.map((oab, idx) => (
          <Badge key={idx} variant="secondary" className="gap-1">
            {oab.numero}/{oab.uf}
            <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemove(idx)} />
          </Badge>
        ))}
      </div>
    </div>
  );
}