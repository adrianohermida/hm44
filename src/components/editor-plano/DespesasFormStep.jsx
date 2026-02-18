import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DespesasFormStep({ data, onChange }) {
  const [novaDespesa, setNovaDespesa] = useState({
    categoria: "alimentacao",
    descricao: "",
    valor_mensal: 0
  });

  const addDespesa = () => {
    if (novaDespesa.valor_mensal > 0) {
      onChange([...data, novaDespesa]);
      setNovaDespesa({ categoria: "alimentacao", descricao: "", valor_mensal: 0 });
    }
  };

  const removeDespesa = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const categoriaLabels = {
    alimentacao: "Alimentação",
    moradia: "Moradia",
    saude: "Saúde",
    educacao: "Educação",
    transporte: "Transporte",
    vestuario: "Vestuário",
    higiene: "Higiene",
    outros: "Outros"
  };

  const totalDespesas = data.reduce((sum, d) => sum + (d.valor_mensal || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-l-[var(--brand-warning)]">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Total de Despesas Essenciais: R$ {totalDespesas.toFixed(2)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <Label>Categoria</Label>
          <Select value={novaDespesa.categoria} onValueChange={(v) => setNovaDespesa(p => ({ ...p, categoria: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(categoriaLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Descrição</Label>
          <Input value={novaDespesa.descricao} onChange={(e) => setNovaDespesa(p => ({ ...p, descricao: e.target.value }))} placeholder="Ex: Aluguel" />
        </div>
        <div>
          <Label>Valor Mensal (R$)</Label>
          <div className="flex gap-2">
            <Input type="number" step="0.01" value={novaDespesa.valor_mensal} onChange={(e) => setNovaDespesa(p => ({ ...p, valor_mensal: parseFloat(e.target.value) || 0 }))} />
            <Button type="button" onClick={addDespesa} className="bg-[var(--brand-warning)]">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {data.map((despesa, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
            <div className="flex-1">
              <Badge variant="outline" className="mb-1 bg-yellow-100">{categoriaLabels[despesa.categoria]}</Badge>
              <p className="text-sm text-[var(--text-secondary)]">{despesa.descricao}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-[var(--brand-warning)]">R$ {despesa.valor_mensal.toFixed(2)}</p>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeDespesa(idx)} className="text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <p className="text-center text-[var(--text-secondary)] py-8">Nenhuma despesa adicionada</p>
        )}
      </div>
    </div>
  );
}