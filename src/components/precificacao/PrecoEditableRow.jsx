import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Pencil } from 'lucide-react';

export default function PrecoEditableRow({ preco, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(preco);

  const calcularPreco = (dados) => {
    const base = dados.valor_referencia || 0;
    const margemPerc = (dados.margem_percentual || 0) / 100;
    const margemVal = dados.margem_valor || 0;
    return base + (base * margemPerc) + margemVal;
  };

  const handleSave = async () => {
    const precoFinal = calcularPreco(form);
    await onSave({ ...form, preco_venda: precoFinal });
    setEditing(false);
  };

  if (!editing) {
    return (
      <tr className="border-t hover:bg-[var(--bg-secondary)]">
        <td className="p-3">{preco.titulo}</td>
        <td className="p-3"><Badge variant="outline">{preco.categoria}</Badge></td>
        <td className="p-3 text-right">R$ {preco.valor_referencia?.toFixed(2)}</td>
        <td className="p-3 text-right">
          {preco.quota_gratuita_diaria ? (
            <span className="text-xs font-mono text-[var(--brand-primary)]">
              {preco.quota_gratuita_diaria.toLocaleString()}
            </span>
          ) : (
            <span className="text-xs text-[var(--text-tertiary)]">-</span>
          )}
        </td>
        <td className="p-3 text-right">
          {preco.custo_quota ? (
            <span className="text-xs font-mono">
              {preco.custo_quota} un
            </span>
          ) : (
            <span className="text-xs text-[var(--text-tertiary)]">-</span>
          )}
        </td>
        <td className="p-3 text-right">{preco.margem_percentual}%</td>
        <td className="p-3 text-right font-bold text-[var(--brand-primary)]">
          R$ {preco.preco_venda?.toFixed(2)}
        </td>
        <td className="p-3 text-center">
          <Badge className={preco.modelo_cobranca === 'quota_gratuita' ? 'bg-green-100 text-green-800' : ''}>
            {preco.modelo_cobranca === 'quota_gratuita' ? '🎁 Gratuito' : preco.modelo_cobranca}
          </Badge>
        </td>
        <td className="p-3">
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
            <Pencil className="w-3 h-3" />
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-t bg-blue-50">
      <td className="p-2">{preco.titulo}</td>
      <td className="p-2"><Badge variant="outline">{preco.categoria}</Badge></td>
      <td className="p-2">{preco.valor_referencia?.toFixed(2)}</td>
      <td className="p-2">
        <Input
          type="number"
          value={form.margem_percentual}
          onChange={(e) => setForm({ ...form, margem_percentual: parseFloat(e.target.value) })}
          className="w-20"
        />
      </td>
      <td className="p-2">
        <Input
          type="number"
          value={form.margem_valor}
          onChange={(e) => setForm({ ...form, margem_valor: parseFloat(e.target.value) })}
          className="w-24"
        />
      </td>
      <td className="p-2 text-right font-bold">R$ {calcularPreco(form).toFixed(2)}</td>
      <td className="p-2"><Badge>{preco.modelo_cobranca}</Badge></td>
      <td className="p-2 flex gap-1">
        <Button size="sm" onClick={handleSave}><Check className="w-3 h-3" /></Button>
        <Button size="sm" variant="ghost" onClick={() => setEditing(false)}><X className="w-3 h-3" /></Button>
      </td>
    </tr>
  );
}