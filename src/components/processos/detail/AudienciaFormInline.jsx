import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Check } from 'lucide-react';

export default function AudienciaFormInline({ onSave, onCancel }) {
  const [form, setForm] = useState({
    tipo: 'conciliacao',
    data: '',
    hora: '',
    local: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-[var(--bg-secondary)] rounded space-y-2">
      <Select value={form.tipo} onValueChange={(v) => setForm({...form, tipo: v})}>
        <SelectTrigger className="h-8"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="conciliacao">Conciliação</SelectItem>
          <SelectItem value="instrucao">Instrução</SelectItem>
          <SelectItem value="julgamento">Julgamento</SelectItem>
        </SelectContent>
      </Select>
      <Input size="sm" type="date" value={form.data} onChange={(e) => setForm({...form, data: e.target.value})} required />
      <Input size="sm" type="time" value={form.hora} onChange={(e) => setForm({...form, hora: e.target.value})} required />
      <Input size="sm" placeholder="Local" value={form.local} onChange={(e) => setForm({...form, local: e.target.value})} />
      <div className="flex gap-1">
        <Button type="submit" size="sm" className="flex-1">
          <Check className="w-3 h-3 mr-1" />Salvar
        </Button>
        <Button type="button" size="sm" variant="ghost" onClick={onCancel}>
          <X className="w-3 h-3" />
        </Button>
      </div>
    </form>
  );
}