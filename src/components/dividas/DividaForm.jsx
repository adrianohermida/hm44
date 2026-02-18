import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

export default function DividaForm({ divida, clientes, credores, onSave, onCancel }) {
  const [formData, setFormData] = useState(divida || {
    cliente_id: "",
    credor_id: "",
    tipo_divida: "emprestimo_pessoal",
    numero_contrato: "",
    valor_original: 0,
    saldo_devedor_atual: 0,
    valor_parcela_atual: 0,
    quantidade_parcelas_total: 0,
    quantidade_parcelas_pagas: 0,
    taxa_juros_mensal: 0,
    data_primeiro_vencimento: "",
    dia_vencimento: 1,
    status_divida: "em_dia",
    observacoes: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="shadow-2xl border-0">
      <CardHeader className="bg-gradient-to-r from-red-600 to-rose-500 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">{divida ? "Editar Dívida" : "Nova Dívida"}</CardTitle>
          <Button variant="ghost" size="icon" onClick={onCancel} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Cliente *</Label>
              <Select value={formData.cliente_id} onValueChange={(v) => setFormData(p => ({ ...p, cliente_id: v }))} required>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{clientes.map(c => <SelectItem key={c.id} value={c.id}>{c.nome_completo}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Credor *</Label>
              <Select value={formData.credor_id} onValueChange={(v) => setFormData(p => ({ ...p, credor_id: v }))} required>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>{credores.map(c => <SelectItem key={c.id} value={c.id}>{c.nome_credor}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Tipo de Dívida *</Label>
              <Select value={formData.tipo_divida} onValueChange={(v) => setFormData(p => ({ ...p, tipo_divida: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="emprestimo_pessoal">Empréstimo Pessoal</SelectItem>
                  <SelectItem value="financiamento_veiculo">Financiamento Veículo</SelectItem>
                  <SelectItem value="financiamento_imovel">Financiamento Imóvel</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cheque_especial">Cheque Especial</SelectItem>
                  <SelectItem value="credito_consignado">Crédito Consignado</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Número do Contrato</Label>
              <Input value={formData.numero_contrato} onChange={(e) => setFormData(p => ({ ...p, numero_contrato: e.target.value }))} />
            </div>
            <div>
              <Label>Valor Original (R$)</Label>
              <Input type="number" step="0.01" value={formData.valor_original} onChange={(e) => setFormData(p => ({ ...p, valor_original: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Saldo Devedor (R$) *</Label>
              <Input type="number" step="0.01" value={formData.saldo_devedor_atual} onChange={(e) => setFormData(p => ({ ...p, saldo_devedor_atual: parseFloat(e.target.value) || 0 }))} required />
            </div>
            <div>
              <Label>Parcela Mensal (R$) *</Label>
              <Input type="number" step="0.01" value={formData.valor_parcela_atual} onChange={(e) => setFormData(p => ({ ...p, valor_parcela_atual: parseFloat(e.target.value) || 0 }))} required />
            </div>
            <div>
              <Label>Total Parcelas</Label>
              <Input type="number" value={formData.quantidade_parcelas_total} onChange={(e) => setFormData(p => ({ ...p, quantidade_parcelas_total: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Parcelas Pagas</Label>
              <Input type="number" value={formData.quantidade_parcelas_pagas} onChange={(e) => setFormData(p => ({ ...p, quantidade_parcelas_pagas: parseInt(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Taxa Juros Mensal (%)</Label>
              <Input type="number" step="0.01" value={formData.taxa_juros_mensal} onChange={(e) => setFormData(p => ({ ...p, taxa_juros_mensal: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <Label>Dia Vencimento</Label>
              <Input type="number" min="1" max="31" value={formData.dia_vencimento} onChange={(e) => setFormData(p => ({ ...p, dia_vencimento: parseInt(e.target.value) || 1 }))} />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={formData.status_divida} onValueChange={(v) => setFormData(p => ({ ...p, status_divida: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="em_dia">Em Dia</SelectItem>
                  <SelectItem value="atraso_30_dias">Atraso 30 dias</SelectItem>
                  <SelectItem value="atraso_60_dias">Atraso 60 dias</SelectItem>
                  <SelectItem value="atraso_90_dias">Atraso 90 dias</SelectItem>
                  <SelectItem value="negativado">Negativado</SelectItem>
                  <SelectItem value="juridico">Jurídico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label>Observações</Label>
              <Textarea value={formData.observacoes} onChange={(e) => setFormData(p => ({ ...p, observacoes: e.target.value }))} rows={3} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-[var(--bg-secondary)] flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit" className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />{divida ? "Atualizar" : "Cadastrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}