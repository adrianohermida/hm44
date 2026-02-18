import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Save } from "lucide-react";

export default function RelatorioForm({ clientes, planos, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    cliente_id: "",
    plano_pagamento_id: "",
    tipo_relatorio: "diagnostico",
    data_emissao: new Date().toISOString().split('T')[0],
    profissional_responsavel: "",
    conteudo_relatorio: {
      resumo_executivo: "",
      analise_situacao: "",
      recomendacoes: "",
      conclusoes: ""
    },
    status: "rascunho"
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleConteudoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      conteudo_relatorio: {
        ...prev.conteudo_relatorio,
        [field]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const planosDoCliente = formData.cliente_id
    ? planos.filter(p => p.cliente_id === formData.cliente_id)
    : [];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-4xl my-8 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Novo Relatório</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente_id">Cliente *</Label>
                <Select
                  value={formData.cliente_id}
                  onValueChange={(value) => handleChange("cliente_id", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(cliente => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tipo_relatorio">Tipo de Relatório *</Label>
                <Select
                  value={formData.tipo_relatorio}
                  onValueChange={(value) => handleChange("tipo_relatorio", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diagnostico">Diagnóstico</SelectItem>
                    <SelectItem value="plano_pagamento">Plano de Pagamento</SelectItem>
                    <SelectItem value="parecer_tecnico">Parecer Técnico</SelectItem>
                    <SelectItem value="acompanhamento">Acompanhamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="data_emissao">Data de Emissão</Label>
                <Input
                  id="data_emissao"
                  type="date"
                  value={formData.data_emissao}
                  onChange={(e) => handleChange("data_emissao", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="profissional_responsavel">Profissional Responsável</Label>
                <Input
                  id="profissional_responsavel"
                  value={formData.profissional_responsavel}
                  onChange={(e) => handleChange("profissional_responsavel", e.target.value)}
                  placeholder="Nome do advogado/analista"
                />
              </div>

              {planosDoCliente.length > 0 && (
                <div className="md:col-span-2">
                  <Label htmlFor="plano_pagamento_id">Plano de Pagamento (opcional)</Label>
                  <Select
                    value={formData.plano_pagamento_id}
                    onValueChange={(value) => handleChange("plano_pagamento_id", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Nenhum plano selecionado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>Nenhum</SelectItem>
                      {planosDoCliente.map(plano => (
                        <SelectItem key={plano.id} value={plano.id}>
                          Plano de {plano.data_geracao} - R$ {plano.valor_parcela_proposta?.toFixed(2)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Conteúdo do Relatório</h3>

              <div>
                <Label htmlFor="resumo_executivo">Resumo Executivo</Label>
                <Textarea
                  id="resumo_executivo"
                  value={formData.conteudo_relatorio.resumo_executivo}
                  onChange={(e) => handleConteudoChange("resumo_executivo", e.target.value)}
                  rows={3}
                  placeholder="Breve resumo da situação do cliente..."
                />
              </div>

              <div>
                <Label htmlFor="analise_situacao">Análise da Situação</Label>
                <Textarea
                  id="analise_situacao"
                  value={formData.conteudo_relatorio.analise_situacao}
                  onChange={(e) => handleConteudoChange("analise_situacao", e.target.value)}
                  rows={4}
                  placeholder="Análise detalhada da situação financeira..."
                />
              </div>

              <div>
                <Label htmlFor="recomendacoes">Recomendações</Label>
                <Textarea
                  id="recomendacoes"
                  value={formData.conteudo_relatorio.recomendacoes}
                  onChange={(e) => handleConteudoChange("recomendacoes", e.target.value)}
                  rows={4}
                  placeholder="Recomendações para o cliente..."
                />
              </div>

              <div>
                <Label htmlFor="conclusoes">Conclusões</Label>
                <Textarea
                  id="conclusoes"
                  value={formData.conteudo_relatorio.conclusoes}
                  onChange={(e) => handleConteudoChange("conclusoes", e.target.value)}
                  rows={3}
                  placeholder="Conclusões finais do relatório..."
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-slate-50 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600"
            >
              <Save className="w-4 h-4 mr-2" />
              Criar Relatório
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}