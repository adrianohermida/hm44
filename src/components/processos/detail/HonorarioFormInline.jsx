import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Check } from 'lucide-react';

export default function HonorarioFormInline({ onSave, onCancel }) {
  const [form, setForm] = useState({
    valor_total: '',
    descricao: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      valor_total: parseFloat(form.valor_total),
      valor_pago: 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-2 bg-[var(--bg-secondary)] rounded space-y-2">
      <Input
        size="sm"
        type="number"
        step="0.01"
        placeholder="Valor (R$)"
        value={form.valor_total}
        onChange={(e) => setForm({...form, valor_total: e.target.value})}
        required
      />
      <Input
        size="sm"
        placeholder="Descrição"
        value={form.descricao}
        onChange={(e) => setForm({...form, descricao: e.target.value})}
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