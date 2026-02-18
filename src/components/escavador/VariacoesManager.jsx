import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, AlertCircle } from 'lucide-react';

export default function VariacoesManager({ variacoes, onChange, maxVariacoes = 3 }) {
  const [nova, setNova] = useState('');

  const handleAdd = () => {
    if (nova && variacoes.length < maxVariacoes) {
      onChange([...variacoes, nova]);
      setNova('');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Adicionar variação do termo"
          value={nova}
          onChange={(e) => setNova(e.target.value)}
          disabled={variacoes.length >= maxVariacoes}
        />
        <Button type="button" size="icon" onClick={handleAdd} disabled={!nova || variacoes.length >= maxVariacoes}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {variacoes.length >= maxVariacoes && (
        <p className="text-xs text-[var(--brand-warning)] flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Máximo de {maxVariacoes} variações
        </p>
      )}
      {variacoes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {variacoes.map((v, i) => (
            <Badge key={i} variant="secondary">
              {v}
              <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => onChange(variacoes.filter((_, idx) => idx !== i))} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}