import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";

export default function AIPromptConfig({ config, onChange }) {
  return (
    <div className="space-y-4">
      <div>
        <Label>Tópico do Artigo</Label>
        <Input
          value={config.topico}
          onChange={(e) => onChange({ ...config, topico: e.target.value })}
          placeholder="Ex: Como renegociar dívidas bancárias"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Tom do Artigo</Label>
          <Select value={config.tom} onValueChange={(v) => onChange({ ...config, tom: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="profissional">Profissional</SelectItem>
              <SelectItem value="acessivel">Acessível</SelectItem>
              <SelectItem value="tecnico">Técnico</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Público-Alvo</Label>
          <Select value={config.publico} onValueChange={(v) => onChange({ ...config, publico: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leigos">Pessoas Físicas (Leigos)</SelectItem>
              <SelectItem value="advogados">Advogados</SelectItem>
              <SelectItem value="empresas">Empresas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Analisar Concorrentes</Label>
            <Switch
              checked={config.analisarConcorrentes ?? true}
              onCheckedChange={(v) => onChange({ ...config, analisarConcorrentes: v })}
            />
          </div>
          <p className="text-xs text-gray-600">
            Analisa TOP 3 artigos ranqueando e identifica gaps de conteúdo
          </p>

          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Incluir Estatísticas</Label>
            <Switch
              checked={config.incluirEstatisticas ?? true}
              onCheckedChange={(v) => onChange({ ...config, incluirEstatisticas: v })}
            />
          </div>
          <p className="text-xs text-gray-600">
            Busca dados reais do IBGE, Serasa, Banco Central
          </p>
        </div>
      </Card>
    </div>
  );
}