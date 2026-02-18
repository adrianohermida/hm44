import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Link2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProcessoEditRelacionadosTab({ formData, setFormData }) {
  const [showForm, setShowForm] = useState(false);
  const [novoRelacionado, setNovoRelacionado] = useState({ 
    numero_cnj: '', 
    tipo_relacao: 'apenso' 
  });

  const relacionados = formData.processos_relacionados || [];
  const apensos = formData.apensos_raw ? formData.apensos_raw.split(',').filter(Boolean) : [];

  const handleAddRelacionado = () => {
    if (!novoRelacionado.numero_cnj) {
      toast.error('Informe o número CNJ');
      return;
    }

    const cnj = novoRelacionado.numero_cnj.replace(/\D/g, '');
    if (cnj.length !== 20) {
      toast.error('CNJ deve ter 20 dígitos');
      return;
    }

    const novos = [...relacionados, {
      numero_relacionado: cnj,
      tipo_relacao: novoRelacionado.tipo_relacao
    }];

    setFormData({
      ...formData,
      processos_relacionados: novos
    });

    setNovoRelacionado({ numero_cnj: '', tipo_relacao: 'apenso' });
    setShowForm(false);
    toast.success('Processo relacionado adicionado');
  };

  const handleRemoveRelacionado = (index) => {
    const novos = relacionados.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      processos_relacionados: novos
    });
    toast.success('Processo relacionado removido');
  };

  const handleSetProcessoPai = () => {
    if (formData.processo_pai_id) {
      setFormData({
        ...formData,
        processo_pai_id: '',
        relation_type: ''
      });
      toast.success('Processo pai removido');
    }
  };

  return (
    <div className="space-y-6">
      {/* Processo Pai */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Processo Principal (Pai)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CNJ do Processo Pai</Label>
              <Input
                value={formData.processo_pai_id || ''}
                onChange={e => setFormData({...formData, processo_pai_id: e.target.value})}
                placeholder="0000000-00.0000.0.00.0000"
                maxLength={25}
              />
            </div>
            <div>
              <Label>Tipo de Relação</Label>
              <Select
                value={formData.relation_type || ''}
                onValueChange={v => setFormData({...formData, relation_type: v})}
                disabled={!formData.processo_pai_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apenso">Apenso</SelectItem>
                  <SelectItem value="recurso">Recurso</SelectItem>
                  <SelectItem value="incidente">Incidente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {formData.processo_pai_id && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleSetProcessoPai}
            >
              Remover Processo Pai
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Apensos (String legado) */}
      {apensos.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Apensos (Dados Legado)</CardTitle>
              <Badge variant="outline">{apensos.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {apensos.map((cnj, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <Link2 className="w-4 h-4 text-[var(--text-tertiary)]" />
                  <span className="font-mono">{cnj.trim()}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-2">
              Use a seção abaixo para gerenciar processos relacionados
            </p>
          </CardContent>
        </Card>
      )}

      {/* Processos Relacionados */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Processos Relacionados</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{relacionados.length}</Badge>
              <Button 
                size="sm" 
                onClick={() => setShowForm(!showForm)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showForm && (
            <div className="p-4 bg-[var(--bg-secondary)] rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Número CNJ</Label>
                  <Input
                    value={novoRelacionado.numero_cnj}
                    onChange={e => setNovoRelacionado({
                      ...novoRelacionado,
                      numero_cnj: e.target.value
                    })}
                    placeholder="0000000-00.0000.0.00.0000"
                  />
                </div>
                <div>
                  <Label>Tipo de Relação</Label>
                  <Select
                    value={novoRelacionado.tipo_relacao}
                    onValueChange={v => setNovoRelacionado({
                      ...novoRelacionado,
                      tipo_relacao: v
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apenso">Apenso</SelectItem>
                      <SelectItem value="recurso">Recurso</SelectItem>
                      <SelectItem value="incidente">Incidente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddRelacionado}>
                  Adicionar
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {relacionados.length === 0 ? (
            <p className="text-sm text-[var(--text-tertiary)] text-center py-4">
              Nenhum processo relacionado
            </p>
          ) : (
            <div className="space-y-2">
              {relacionados.map((rel, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-3 border border-[var(--border-primary)] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Link2 className="w-4 h-4 text-[var(--text-tertiary)]" />
                    <div>
                      <p className="font-mono text-sm">
                        {rel.numero_relacionado}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {rel.tipo_relacao}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemoveRelacionado(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}