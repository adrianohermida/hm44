import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Star } from 'lucide-react';
import CEPInput from '../CEPInput';

export default function EnderecoItem({ endereco, onChange, onRemove, onMarcarPreferencial }) {
  return (
    <Card className="p-3">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Select value={endereco.tipo} onValueChange={(v) => onChange({...endereco, tipo: v})}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residencial">Residencial</SelectItem>
              <SelectItem value="comercial">Comercial</SelectItem>
              <SelectItem value="correspondencia">Correspondência</SelectItem>
            </SelectContent>
          </Select>
          <Button type="button" variant="ghost" size="icon" onClick={onMarcarPreferencial}>
            <Star className={`w-4 h-4 ${endereco.preferencial_correspondencia ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
        <CEPInput value={endereco.cep} onChange={(d) => onChange({...endereco, ...d})} />
        <div className="grid grid-cols-2 gap-2">
          <Input placeholder="Número" value={endereco.numero || ''} onChange={(e) => onChange({...endereco, numero: e.target.value})} />
          <Input placeholder="Complemento" value={endereco.complemento || ''} onChange={(e) => onChange({...endereco, complemento: e.target.value})} />
        </div>
      </div>
    </Card>
  );
}