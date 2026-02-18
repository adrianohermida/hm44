import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProcessoForm({ processo, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    numero_cnj: processo?.numero_cnj || '',
    tribunal: processo?.tribunal || '',
    classe: processo?.classe || '',
    data_distribuicao: processo?.data_distribuicao || '',
    valor_causa: processo?.valor_causa || ''
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div>
        <Label>Número CNJ *</Label>
        <Input required value={form.numero_cnj} onChange={(e) => setForm({ ...form, numero_cnj: e.target.value })} />
      </div>
      <div>
        <Label>Tribunal</Label>
        <Input value={form.tribunal} onChange={(e) => setForm({ ...form, tribunal: e.target.value })} />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}