import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function RendasFormStep({ data, onChange }) {
  const [novaRenda, setNovaRenda] = useState({
    tipo_renda: "salario",
    descricao: "",
    valor_mensal: 0
  });

  const addRenda = () => {
    if (novaRenda.valor_mensal > 0) {
      onChange([...data, novaRenda]);
      setNovaRenda({ tipo_renda: "salario", descricao: "", valor_mensal: 0 });
    }
  };

  const removeRenda = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const tipoLabels = {
    salario: "Salário",
    aposentadoria: "Aposentadoria",
    pensao: "Pensão",
    autonomo: "Autônomo",
    aluguel: "Aluguel",
    investimentos: "Investimentos",
    outros: "Outros"
  };

  const totalRendas = data.reduce((sum, r) => sum + (r.valor_mensal || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--brand-primary-50)] p-4 rounded-lg border-l-4 border-l-[var(--brand-primary)]">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Total de Rendas: R$ {totalRendas.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label>Tipo</Label>
          <Select value={novaRenda.tipo_renda} onValueChange={(v) => setNovaRenda(p => ({ ...p, tipo_renda: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(tipoLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Descrição</Label>
          <Input value={novaRenda.descricao} onChange={(e) => setNovaRenda(p => ({ ...p, descricao: e.target.value }))} placeholder="Ex: Salário CLT" />
        </div>
        <div>
          <Label>Valor Mensal (R$)</Label>
          <div className="flex gap-2">
            <Input type="number" step="0.01" value={novaRenda.valor_mensal} onChange={(e) => setNovaRenda(p => ({ ...p, valor_mensal: parseFloat(e.target.value) || 0 }))} />
            <Button type="button" onClick={addRenda} className="bg-[var(--brand-primary)]">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((renda, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
            <div className="flex-1">
              <Badge variant="outline" className="mb-1">{tipoLabels[renda.tipo_renda]}</Badge>
              <p className="text-sm text-[var(--text-secondary)]">{renda.descricao}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-[var(--brand-success)]">R$ {renda.valor_mensal.toFixed(2)}</p>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeRenda(idx)} className="text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-center text-[var(--text-secondary)] py-8">Nenhuma fonte de renda adicionada</p>
        )}
      </div>
    </div>
  );
}