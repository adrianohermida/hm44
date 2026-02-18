import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function DividasFormStep({ dividas, credores, onDividasChange, onCredoresChange }) {
  const [novoCredor, setNovoCredor] = useState({ nome_credor: "", tipo_credor: "banco" });
  const [novaDivida, setNovaDivida] = useState({
    credor_id: "",
    tipo_divida: "cartao_credito",
    saldo_devedor_atual: 0,
    valor_parcela_atual: 0,
    status_divida: "em_dia"
  });

  const addCredor = () => {
    if (novoCredor.nome_credor) {
      const id = `temp_${Date.now()}`;
      onCredoresChange([...credores, { ...novoCredor, id }]);
      setNovoCredor({ nome_credor: "", tipo_credor: "banco" });
    }
  };

  const addDivida = () => {
    if (novaDivida.credor_id && novaDivida.saldo_devedor_atual > 0) {
      onDividasChange([...dividas, novaDivida]);
      setNovaDivida({ credor_id: "", tipo_divida: "cartao_credito", saldo_devedor_atual: 0, valor_parcela_atual: 0, status_divida: "em_dia" });
    }
  };

  const removeDivida = (index) => onDividasChange(dividas.filter((_, i) => i !== index));
  const getCredorNome = (id) => credores.find(c => c.id === id)?.nome_credor || "N/A";

  const tipoDividaLabels = {
    cartao_credito: "Cartão",
    emprestimo_pessoal: "Empréstimo",
    financiamento_veiculo: "Financ. Veículo",
    financiamento_imovel: "Financ. Imóvel",
    cheque_especial: "Cheque Especial",
    credito_consignado: "Consignado",
    outros: "Outros"
  };

  const totalDividas = dividas.reduce((sum, d) => sum + (d.saldo_devedor_atual || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-red-50 p-4 rounded-lg border-l-4 border-l-red-600">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Total de Dívidas: R$ {totalDividas.toFixed(2)}</p>
      </div>

      <div className="bg-[var(--bg-secondary)] p-4 rounded-lg space-y-3">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-[var(--brand-primary)]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Adicionar Credor</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <Label>Nome</Label>
            <Input value={novoCredor.nome_credor} onChange={(e) => setNovoCredor(p => ({ ...p, nome_credor: e.target.value }))} placeholder="Ex: Banco X" />
          </div>
          <div>
            <Label>Tipo</Label>
            <Select value={novoCredor.tipo_credor} onValueChange={(v) => setNovoCredor(p => ({ ...p, tipo_credor: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="banco">Banco</SelectItem>
                <SelectItem value="financeira">Financeira</SelectItem>
                <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                <SelectItem value="loja">Loja</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="button" onClick={addCredor} className="w-full bg-[var(--brand-primary)]">
              <Plus className="w-4 h-4 mr-2" />Adicionar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div>
          <Label>Credor</Label>
          <Select value={novaDivida.credor_id} onValueChange={(v) => setNovaDivida(p => ({ ...p, credor_id: v }))}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>{credores.map(c => <SelectItem key={c.id} value={c.id}>{c.nome_credor}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>Tipo</Label>
          <Select value={novaDivida.tipo_divida} onValueChange={(v) => setNovaDivida(p => ({ ...p, tipo_divida: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(tipoDividaLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Saldo (R$)</Label>
          <Input type="number" step="0.01" value={novaDivida.saldo_devedor_atual} onChange={(e) => setNovaDivida(p => ({ ...p, saldo_devedor_atual: parseFloat(e.target.value) || 0 }))} />
        </div>
        <div className="flex items-end">
          <Button type="button" onClick={addDivida} className="w-full bg-red-600 hover:bg-red-700">
            <Plus className="w-4 h-4 mr-2" />Adicionar
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {dividas.map((divida, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded-lg">
            <div className="flex-1">
              <p className="font-semibold text-[var(--text-primary)]">{getCredorNome(divida.credor_id)}</p>
              <Badge variant="outline" className="mt-1">{tipoDividaLabels[divida.tipo_divida]}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-semibold text-red-600">R$ {divida.saldo_devedor_atual.toFixed(2)}</p>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeDivida(idx)} className="text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
        {dividas.length === 0 && (
          <p className="text-center text-[var(--text-secondary)] py-8">Nenhuma dívida adicionada</p>
        )}
      </div>
    </div>
  );
}