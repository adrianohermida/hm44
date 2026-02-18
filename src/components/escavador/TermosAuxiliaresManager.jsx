import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';

export default function TermosAuxiliaresManager({ termos, onChange }) {
  const [novoTermo, setNovoTermo] = useState('');
  const [condicao, setCondicao] = useState('CONTEM');

  const handleAdd = () => {
    if (novoTermo) {
      onChange([...termos, { termo: novoTermo, condicao }]);
      setNovoTermo('');
    }
  };

  const handleRemove = (index) => {
    onChange(termos.filter((_, i) => i !== index));
  };

  const condicaoLabels = {
    CONTEM: 'Contém',
    NAO_CONTEM: 'Não contém',
    CONTEM_ALGUMA: 'Contém algum'
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Termo auxiliar"
          value={novoTermo}
          onChange={(e) => setNovoTermo(e.target.value)}
          className="flex-1"
        />
        <Select value={condicao} onValueChange={setCondicao}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CONTEM">Contém</SelectItem>
            <SelectItem value="NAO_CONTEM">Não contém</SelectItem>
            <SelectItem value="CONTEM_ALGUMA">Contém algum</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" size="icon" onClick={handleAdd}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      {termos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {termos.map((t, i) => (
            <Badge key={i} variant="secondary" className="flex items-center gap-2">
              <span className="text-xs">{condicaoLabels[t.condicao]}: {t.termo}</span>
              <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemove(i)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}