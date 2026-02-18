import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, Calendar, MapPin, DollarSign } from 'lucide-react';

export default function ProcessoEditEscavadorTab({ formData, setFormData }) {
  const dadosEscavador = formData.dados_completos_api || {};
  
  return (
    <div className="space-y-6">
      {/* Informações Temporais */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Datas e Prazos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data Última Movimentação</Label>
              <Input
                type="date"
                value={formData.data_ultima_movimentacao || ''}
                onChange={e => setFormData({
                  ...formData,
                  data_ultima_movimentacao: e.target.value
                })}
              />
            </div>
            <div>
              <Label>Data Última Verificação</Label>
              <Input
                type="datetime-local"
                value={formData.data_ultima_verificacao || ''}
                onChange={e => setFormData({
                  ...formData,
                  data_ultima_verificacao: e.target.value
                })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Data de Início</Label>
              <Input
                type="date"
                value={formData.data_inicio || ''}
                onChange={e => setFormData({
                  ...formData,
                  data_inicio: e.target.value
                })}
              />
            </div>
            <div>
              <Label>Ano de Início</Label>
              <Input
                type="number"
                value={formData.ano_inicio || ''}
                onChange={e => setFormData({
                  ...formData,
                  ano_inicio: parseInt(e.target.value) || null
                })}
                placeholder="Ex: 2024"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Localização e Origem */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Localização e Origem
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Estado de Origem (Nome)</Label>
              <Input
                value={formData.estado_origem_nome || ''}
                onChange={e => setFormData({
                  ...formData,
                  estado_origem_nome: e.target.value
                })}
                placeholder="Ex: São Paulo"
              />
            </div>
            <div>
              <Label>Estado de Origem (Sigla)</Label>
              <Input
                value={formData.estado_origem_sigla || ''}
                onChange={e => setFormData({
                  ...formData,
                  estado_origem_sigla: e.target.value.toUpperCase()
                })}
                placeholder="Ex: SP"
                maxLength={2}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Valores e Quantidades */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Métricas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Quantidade de Movimentações</Label>
              <Input
                type="number"
                value={formData.quantidade_movimentacoes || 0}
                onChange={e => setFormData({
                  ...formData,
                  quantidade_movimentacoes: parseInt(e.target.value) || 0
                })}
              />
            </div>
            <div>
              <Label>Grau da Instância</Label>
              <Input
                type="number"
                value={formData.grau_instancia || ''}
                onChange={e => setFormData({
                  ...formData,
                  grau_instancia: parseInt(e.target.value) || null
                })}
                placeholder="1 ou 2"
                min="1"
                max="2"
              />
            </div>
          </div>

          <div>
            <Label>Situação do Processo</Label>
            <Input
              value={formData.situacao_processo || ''}
              onChange={e => setFormData({
                ...formData,
                situacao_processo: e.target.value
              })}
              placeholder="Ex: Baixado, Em andamento, Arquivado"
            />
          </div>
        </CardContent>
      </Card>

      {/* Flags e Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Database className="w-4 h-4" />
            Flags e Estados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="fontes_arquivadas"
              checked={formData.fontes_tribunais_arquivadas || false}
              onChange={e => setFormData({
                ...formData,
                fontes_tribunais_arquivadas: e.target.checked
              })}
              className="w-4 h-4"
            />
            <Label htmlFor="fontes_arquivadas" className="cursor-pointer">
              Fontes dos tribunais arquivadas
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <Label>Tempo desde última verificação</Label>
              <Input
                value={formData.tempo_desde_ultima_verificacao || ''}
                onChange={e => setFormData({
                  ...formData,
                  tempo_desde_ultima_verificacao: e.target.value
                })}
                placeholder="Ex: 2 dias atrás"
              />
            </div>
            <div>
              <Label>Log de Importação ID</Label>
              <Input
                value={formData.log_importacao_id || ''}
                onChange={e => setFormData({
                  ...formData,
                  log_importacao_id: e.target.value
                })}
                placeholder="ID do log"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dados Completos da API (JSON) */}
      {Object.keys(dadosEscavador).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Database className="w-4 h-4" />
              Dados Brutos da API
              <Badge variant="outline" className="ml-auto">
                {Object.keys(dadosEscavador).length} campos
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={JSON.stringify(dadosEscavador, null, 2)}
              onChange={e => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setFormData({
                    ...formData,
                    dados_completos_api: parsed
                  });
                } catch (err) {
                  // Ignora JSON inválido durante edição
                }
              }}
              className="font-mono text-xs"
              rows={10}
            />
            <p className="text-xs text-[var(--text-tertiary)] mt-2">
              ⚠️ Edite com cuidado - JSON deve ser válido
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}