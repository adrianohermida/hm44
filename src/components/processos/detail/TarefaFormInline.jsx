import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Check } from 'lucide-react';

export default function TarefaFormInline({ onSave, onCancel }) {
  const [form, setForm] = useState({
    titulo: '',
    data_limite: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-[var(--bg-secondary)] rounded space-y-2">
      <Input
        size="sm"
        placeholder="Título da tarefa"
        value={form.titulo}
        onChange={(e) => setForm({...form, titulo: e.target.value})}
        required
      />
      <Input
        size="sm"
        type="date"
        value={form.data_limite}
        onChange={(e) => setForm({...form, data_limite: e.target.value})}
        required
      />
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