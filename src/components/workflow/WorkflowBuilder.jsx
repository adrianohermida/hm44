import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ArrowRight, GitBranch } from 'lucide-react';

export default function WorkflowBuilder({ workflow, onChange }) {
  const [etapas, setEtapas] = useState(workflow?.etapas || []);

  const adicionarEtapa = () => {
    const novaEtapa = {
      nome: '',
      ordem: etapas.length,
      tipo: 'sequencial',
      responsavel_email: '',
      prazo_dias: 7,
      descricao: '',
    };
    const novasEtapas = [...etapas, novaEtapa];
    setEtapas(novasEtapas);
    onChange({ ...workflow, etapas: novasEtapas });
  };

  const removerEtapa = (index) => {
    const novasEtapas = etapas.filter((_, i) => i !== index).map((e, i) => ({ ...e, ordem: i }));
    setEtapas(novasEtapas);
    onChange({ ...workflow, etapas: novasEtapas });
  };

  const atualizarEtapa = (index, campo, valor) => {
    const novasEtapas = [...etapas];
    novasEtapas[index] = { ...novasEtapas[index], [campo]: valor };
    setEtapas(novasEtapas);
    onChange({ ...workflow, etapas: novasEtapas });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Etapas do Workflow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {etapas.map((etapa, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                {etapa.tipo === 'paralela' ? (
                  <GitBranch className="w-5 h-5 text-[var(--brand-primary)]" />
                ) : (
                  <ArrowRight className="w-5 h-5 text-[var(--brand-primary)]" />
                )}
                <span className="font-semibold text-sm">Etapa {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removerEtapa(index)}
                  className="ml-auto"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Nome da etapa"
                  value={etapa.nome}
                  onChange={(e) => atualizarEtapa(index, 'nome', e.target.value)}
                />
                <Select
                  value={etapa.tipo}
                  onValueChange={(value) => atualizarEtapa(index, 'tipo', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sequencial">Sequencial</SelectItem>
                    <SelectItem value="paralela">Paralela</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  placeholder="Prazo (dias)"
                  value={etapa.prazo_dias}
                  onChange={(e) => atualizarEtapa(index, 'prazo_dias', parseInt(e.target.value))}
                />
                <Input
                  type="email"
                  placeholder="Email do responsável"
                  value={etapa.responsavel_email}
                  onChange={(e) => atualizarEtapa(index, 'responsavel_email', e.target.value)}
                />
              </div>

              <Input
                placeholder="Descrição da etapa"
                value={etapa.descricao}
                onChange={(e) => atualizarEtapa(index, 'descricao', e.target.value)}
              />
            </div>
          ))}

          <Button onClick={adicionarEtapa} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Etapa
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}