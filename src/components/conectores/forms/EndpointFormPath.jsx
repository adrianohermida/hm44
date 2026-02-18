import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const METODOS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

export default function EndpointFormPath({ form, onChange }) {
  return (
    <div className="space-y-3">
      <Select 
        value={form.metodo} 
        onValueChange={v => onChange({...form, metodo: v})}
      >
        <SelectTrigger>
          <SelectValue placeholder="Método HTTP" />
        </SelectTrigger>
        <SelectContent>
          {METODOS.map(m => (
            <SelectItem key={m} value={m}>{m}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input 
        placeholder="Path (ex: /api/v2/endpoint)" 
        value={form.path} 
        onChange={e => onChange({...form, path: e.target.value})} 
      />
      
      <Input 
        type="number" 
        placeholder="Créditos consumidos" 
        value={form.creditos_consumidos} 
        onChange={e => onChange({...form, creditos_consumidos: parseInt(e.target.value) || 0})} 
      />
    </div>
  );
}