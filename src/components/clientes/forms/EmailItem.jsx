import React from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Star } from 'lucide-react';

export default function EmailItem({ email, onChange, onRemove, onMarcarPrincipal }) {
  return (
    <Card className="p-3">
      <div className="flex gap-2 items-start">
        <Input 
          type="email"
          placeholder="email@exemplo.com" 
          value={email.email || ''} 
          onChange={(e) => onChange({...email, email: e.target.value})} 
          className="flex-1"
        />
        <Select value={email.tipo} onValueChange={(v) => onChange({...email, tipo: v})}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pessoal">Pessoal</SelectItem>
            <SelectItem value="trabalho">Trabalho</SelectItem>
            <SelectItem value="outro">Outro</SelectItem>
          </SelectContent>
        </Select>
        <Button type="button" variant="ghost" size="icon" onClick={onMarcarPrincipal}>
          <Star className={`w-4 h-4 ${email.principal ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </Button>
        <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    </Card>
  );
}