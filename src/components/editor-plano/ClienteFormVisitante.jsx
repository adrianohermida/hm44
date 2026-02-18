import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";

export default function ClienteFormVisitante({ data, onChange }) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-2 text-sm">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <p className="text-[var(--text-secondary)]">
          <strong>Modo Simulação:</strong> Informe apenas dados socioeconômicos gerais. 
          Seus dados pessoais não serão coletados nesta etapa.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label>Faixa de Renda Mensal</Label>
          <Select value={data.faixa_renda || ""} onValueChange={(v) => onChange({ ...data, faixa_renda: v })}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ate_2000">Até R$ 2.000</SelectItem>
              <SelectItem value="2000_5000">R$ 2.000 - R$ 5.000</SelectItem>
              <SelectItem value="5000_10000">R$ 5.000 - R$ 10.000</SelectItem>
              <SelectItem value="acima_10000">Acima de R$ 10.000</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Região</Label>
          <Select value={data.regiao || ""} onValueChange={(v) => onChange({ ...data, regiao: v })}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="norte">Norte</SelectItem>
              <SelectItem value="nordeste">Nordeste</SelectItem>
              <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
              <SelectItem value="sudeste">Sudeste</SelectItem>
              <SelectItem value="sul">Sul</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}