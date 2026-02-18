import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function ClienteFormStep({ data, onChange, isNewClient = false }) {
  return (
    <div className="space-y-4">
      {isNewClient && (
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-[var(--text-secondary)]">
          <strong>Novo Cliente:</strong> Preencha os dados completos para cadastrar o cliente no sistema.
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label>Nome Completo *</Label>
          <Input value={data.nome_completo || ""} onChange={(e) => onChange({ ...data, nome_completo: e.target.value })} required />
        </div>
        <div>
          <Label>CPF *</Label>
          <Input value={data.cpf || ""} onChange={(e) => onChange({ ...data, cpf: e.target.value })} placeholder="000.000.000-00" required />
        </div>
        <div>
          <Label>Data Nascimento</Label>
          <Input type="date" value={data.data_nascimento || ""} onChange={(e) => onChange({ ...data, data_nascimento: e.target.value })} />
        </div>
        <div>
          <Label>Telefone *</Label>
          <Input value={data.telefone || ""} onChange={(e) => onChange({ ...data, telefone: e.target.value })} required />
        </div>
        <div>
          <Label>E-mail</Label>
          <Input type="email" value={data.email || ""} onChange={(e) => onChange({ ...data, email: e.target.value })} />
        </div>
        <div>
          <Label>Estado Civil</Label>
          <Select value={data.estado_civil || "solteiro"} onValueChange={(v) => onChange({ ...data, estado_civil: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="solteiro">Solteiro(a)</SelectItem>
              <SelectItem value="casado">Casado(a)</SelectItem>
              <SelectItem value="divorciado">Divorciado(a)</SelectItem>
              <SelectItem value="viuvo">Viúvo(a)</SelectItem>
              <SelectItem value="uniao_estavel">União Estável</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Nº Dependentes</Label>
          <Input type="number" min="0" value={data.numero_dependentes || 0} onChange={(e) => onChange({ ...data, numero_dependentes: parseInt(e.target.value) || 0 })} />
        </div>
        <div>
          <Label>Profissão</Label>
          <Input value={data.profissao || ""} onChange={(e) => onChange({ ...data, profissao: e.target.value })} />
        </div>
        <div>
          <Label>Renda Mensal</Label>
          <Input type="number" step="0.01" value={data.renda_mensal || 0} onChange={(e) => onChange({ ...data, renda_mensal: parseFloat(e.target.value) || 0 })} />
        </div>
        <div className="md:col-span-2">
          <Label>Endereço Completo</Label>
          <Input value={data.endereco_completo || ""} onChange={(e) => onChange({ ...data, endereco_completo: e.target.value })} />
        </div>
        <div>
          <Label>Cidade</Label>
          <Input value={data.cidade || ""} onChange={(e) => onChange({ ...data, cidade: e.target.value })} />
        </div>
        <div>
          <Label>Estado (UF)</Label>
          <Input value={data.estado || ""} onChange={(e) => onChange({ ...data, estado: e.target.value })} maxLength={2} />
        </div>
        <div className="md:col-span-2">
          <Label>Observações</Label>
          <Textarea value={data.observacoes || ""} onChange={(e) => onChange({ ...data, observacoes: e.target.value })} rows={3} />
        </div>
      </div>
    </div>
  );
}