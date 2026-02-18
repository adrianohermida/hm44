import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { RefreshCw, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useEscritorio } from '@/components/hooks/useEscritorio';

export default function SecretRotationManager({ secretName, provedores = [] }) {
  const [showDialog, setShowDialog] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [dataAgendada, setDataAgendada] = useState('');
  const queryClient = useQueryClient();
  
  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useEscritorio();
  const escritorioId = escritorio?.id;

  const { data: rotacoes = [], isLoading } = useQuery({
    queryKey: ['rotacoes', secretName, escritorioId],
    queryFn: () => base44.entities.SecretRotation.filter(
      { secret_name: secretName, escritorio_id: escritorioId },
      '-created_date',
      10
    ),
    enabled: !!escritorioId && !!secretName,
    staleTime: 1 * 60 * 1000
  });

  const agendarMutation = useMutation({
    mutationFn: ({ tipo, dataAgendada }) => {
      const provedoresAfetados = provedores
        .filter(p => p.requer_autenticacao && (p.secret_name === secretName || p.api_key_config?.secret_name === secretName))
        .map(p => p.id);

      return base44.entities.SecretRotation.create({
        escritorio_id: escritorioId,
        secret_name: secretName,
        tipo,
        status: tipo === 'manual' ? 'agendada' : 'agendada',
        data_agendada: dataAgendada || new Date().toISOString(),
        provedores_afetados: provedoresAfetados,
        motivo,
        executado_por: user.email
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rotacoes']);
      toast.success('✅ Rotação agendada');
      setShowDialog(false);
      setMotivo('');
      setDataAgendada('');
    },
    onError: (error) => {
      toast.error('❌ Erro ao agendar: ' + error.message);
    }
  });

  const executarMutation = useMutation({
    mutationFn: async (rotacaoId) => {
      const response = await base44.functions.invoke('executarRotacaoSecret', { rotacao_id: rotacaoId });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['rotacoes']);
      queryClient.invalidateQueries(['provedores']);
      toast.success('✅ Rotação executada');
    },
    onError: (error) => {
      toast.error('❌ Erro ao executar: ' + error.message);
    }
  });

  const handleAgendar = (tipo) => {
    agendarMutation.mutate({ tipo, dataAgendada });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Rotação de Secret</CardTitle>
            <Button size="sm" onClick={() => setShowDialog(true)}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Agendar Rotação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-10 bg-[var(--bg-tertiary)] rounded animate-pulse" />
              ))}
            </div>
          ) : rotacoes.length === 0 ? (
            <p className="text-xs text-[var(--text-secondary)]">Nenhuma rotação agendada</p>
          ) : (
            <div className="space-y-2">
              {rotacoes.map(rot => (
                <div key={rot.id} className="flex items-center justify-between p-2 rounded bg-[var(--bg-tertiary)]">
                  <div className="flex items-center gap-2">
                    {rot.status === 'concluida' ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : rot.status === 'falhou' ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className="text-xs">
                      {rot.data_agendada && format(new Date(rot.data_agendada), 'dd/MM/yyyy HH:mm')}
                    </span>
                    <Badge variant="outline" className="text-[10px]">{rot.tipo}</Badge>
                  </div>
                  {rot.status === 'agendada' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => executarMutation.mutate(rot.id)}
                      disabled={executarMutation.isPending || agendarMutation.isPending}
                    >
                      {executarMutation.isPending ? 'Executando...' : 'Executar'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agendar Rotação - {secretName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Motivo</Label>
              <Textarea
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                placeholder="Rotação de segurança periódica..."
              />
            </div>
            <div>
              <Label>Data/Hora (opcional - imediato se vazio)</Label>
              <Input
                type="datetime-local"
                value={dataAgendada}
                onChange={e => setDataAgendada(e.target.value)}
              />
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-xs">
              <p className="font-medium text-yellow-900 mb-1">⚠️ Atenção:</p>
              <p className="text-yellow-700">
                {provedores.filter(p => p.secret_name === secretName || p.api_key_config?.secret_name === secretName).length} provedor(es) serão afetados.
                Certifique-se de atualizar o secret nas variáveis de ambiente antes de executar.
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowDialog(false)} 
                variant="outline" 
                className="flex-1"
                disabled={agendarMutation.isPending}
              >
                Cancelar
              </Button>
              <Button 
                onClick={() => handleAgendar('manual')} 
                className="flex-1"
                disabled={agendarMutation.isPending}
              >
                {agendarMutation.isPending ? 'Agendando...' : 'Agendar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}