import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Settings, TrendingUp, Database, Clock, CheckCircle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

const METRICAS_DISPONIVEIS = [
  { id: 'volume_importacao', nome: 'Volume de Importação por Tabela', icon: Database },
  { id: 'taxa_sucesso', nome: 'Taxa de Sucesso de Sincronização', icon: CheckCircle },
  { id: 'tempo_resposta', nome: 'Tempo Médio de Resposta', icon: Clock },
  { id: 'processos_sync', nome: 'Processos Sincronizados', icon: TrendingUp }
];

export default function DashboardPersonalizavel({ escritorioId }) {
  const [metricasSelecionadas, setMetricasSelecionadas] = useState([
    'volume_importacao',
    'taxa_sucesso'
  ]);
  const [mostrarConfig, setMostrarConfig] = useState(false);

  const { data: analytics } = useQuery({
    queryKey: ['analytics-datajud', escritorioId],
    queryFn: async () => {
      const [testes, health, processos] = await Promise.all([
        base44.entities.TesteEndpoint.filter({ escritorio_id: escritorioId, provedor_id: 'datajud' }, '-created_date', 100),
        base44.entities.HistoricoSaudeProvedor.filter({ escritorio_id: escritorioId }, '-created_date', 100),
        base44.entities.Processo.filter({ escritorio_id: escritorioId, sync_status: 'synced' })
      ]);

      return {
        volumeImportacao: [
          { nome: 'Movimentos', total: await base44.entities.TabelaMovimentoCNJ.filter({}).then(r => r.length) },
          { nome: 'Classes', total: await base44.entities.TabelaClasseCNJ.filter({}).then(r => r.length) },
          { nome: 'Assuntos', total: await base44.entities.TabelaAssuntoCNJ.filter({}).then(r => r.length) },
          { nome: 'Documentos', total: await base44.entities.DocumentoPublico.filter({}).then(r => r.length) }
        ],
        taxaSucesso: [
          { data: 'Últimos 7 dias', sucesso: testes.filter(t => t.sucesso).length, falha: testes.filter(t => !t.sucesso).length }
        ],
        tempoResposta: health.slice(0, 10).reverse().map(h => ({
          endpoint: h.endpoint_nome?.split('_').pop() || 'N/A',
          latencia: h.tempo_resposta_ms || 0
        })),
        processosSyncronizados: processos.length
      };
    },
    enabled: !!escritorioId
  });

  const toggleMetrica = (id) => {
    setMetricasSelecionadas(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMostrarConfig(!mostrarConfig)}
        >
          <Settings className="w-4 h-4 mr-2" />
          Configurar Dashboard
        </Button>
      </div>

      {mostrarConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Selecionar Métricas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {METRICAS_DISPONIVEIS.map((metrica) => (
                <div key={metrica.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={metricasSelecionadas.includes(metrica.id)}
                    onCheckedChange={() => toggleMetrica(metrica.id)}
                  />
                  <Label className="flex items-center gap-2">
                    <metrica.icon className="w-4 h-4" />
                    {metrica.nome}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {metricasSelecionadas.includes('volume_importacao') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Volume de Importação</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics?.volumeImportacao || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="nome" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {metricasSelecionadas.includes('tempo_resposta') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tempo de Resposta (ms)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={analytics?.tempoResposta || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="endpoint" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="latencia" stroke="#3b82f6" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {metricasSelecionadas.includes('taxa_sucesso') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Taxa de Sucesso</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics?.taxaSucesso || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sucesso" fill="#10b981" name="Sucesso" />
                  <Bar dataKey="falha" fill="#ef4444" name="Falha" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {metricasSelecionadas.includes('processos_sync') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Processos Sincronizados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-5xl font-bold text-green-600">
                  {analytics?.processosSyncronizados || 0}
                </p>
                <p className="text-sm text-gray-500 mt-2">Total sincronizado com DataJud</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}