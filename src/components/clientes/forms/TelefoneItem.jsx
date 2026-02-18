import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Star } from 'lucide-react';

export default function TelefoneItem({ telefone, onChange, onRemove, onMarcarPrincipal }) {
  return (
    <Card className="p-3">
      <div className="flex gap-2 items-start">
        <Input 
          placeholder="(00) 00000-0000" 
          value={telefone.telefone || ''} 
          onChange={(e) => onChange({...telefone, telefone: e.target.value})} 
          className="flex-1"
        />
        <Select value={telefone.tipo} onValueChange={(v) => onChange({...telefone, tipo: v})}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="celular">Celular</SelectItem>
            <SelectItem value="fixo">Fixo</SelectItem>
            <SelectItem value="comercial">Comercial</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1">
          <Checkbox checked={telefone.whatsapp} onCheckedChange={(c) => onChange({...telefone, whatsapp: c})} />
          <span className="text-xs">WhatsApp</span>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onMarcarPrincipal}>
          <Star className={`w-4 h-4 ${telefone.principal ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Card>
  );
}