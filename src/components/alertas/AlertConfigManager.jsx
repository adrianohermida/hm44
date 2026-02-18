import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Plus, Bell, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import AlertFormModal from './AlertFormModal';
import LoadingState from '@/components/common/LoadingState';
import EmptyState from '@/components/common/EmptyState';
import { useEscritorio } from '@/components/hooks/useEscritorio';

export default function AlertConfigManager({ provedores = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const queryClient = useQueryClient();
  const { data: escritorio } = useEscritorio();

  const { data: alertas = [], isLoading } = useQuery({
    queryKey: ['alertas', escritorio?.id],
    queryFn: () => base44.entities.AlertaConfig.filter({ escritorio_id: escritorio.id }, '-created_date'),
    enabled: !!escritorio?.id
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.AlertaConfig.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['alertas']);
      toast.success('✅ Alerta deletado');
    },
    onError: (error) => {
      toast.error('❌ Erro ao deletar: ' + error.message);
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, ativo }) => base44.entities.AlertaConfig.update(id, { ativo }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['alertas']);
      toast.success(variables.ativo ? '✅ Alerta ativado' : '⏸️ Alerta pausado');
    },
    onError: (error) => {
      toast.error('❌ Erro ao atualizar: ' + error.message);
    }
  });

  const getTipoLabel = (tipo) => {
    const labels = {
      latencia: 'Latência Alta',
      taxa_sucesso: 'Taxa Sucesso Baixa',
      downtime: 'Downtime',
      quota_excedida: 'Quota Excedida'
    };
    return labels[tipo] || tipo;
  };

  const getComparacaoLabel = (comp) => {
    const labels = {
      maior_que: '>',
      menor_que: '<',
      igual: '='
    };
    return labels[comp] || comp;
  };

  if (isLoading) return <LoadingState message="Carregando alertas..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Alertas Configurados</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Configure notificações automáticas baseadas em métricas
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Alerta
        </Button>
      </div>

      {alertas.length === 0 ? (
        <EmptyState 
          title="Nenhum alerta configurado"
          description="Configure alertas para ser notificado sobre problemas"
          action={
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Alerta
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4">
          {alertas.map(alerta => {
            const provedor = provedores.find(p => p.id === alerta.provedor_id);
            
            return (
              <Card key={alerta.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Bell className="w-5 h-5 text-[var(--brand-primary)]" />
                        <h3 className="font-semibold text-[var(--text-primary)]">
                          {getTipoLabel(alerta.tipo)}
                        </h3>
                        <Badge variant={alerta.ativo ? 'default' : 'secondary'}>
                          {alerta.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--text-secondary)]">Condição:</span>
                          <code className="text-[var(--text-primary)] font-mono">
                            {getTipoLabel(alerta.tipo)} {getComparacaoLabel(alerta.comparacao)} {alerta.threshold_value}
                            {alerta.tipo === 'latencia' ? 'ms' : alerta.tipo === 'taxa_sucesso' ? '%' : ''}
                          </code>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--text-secondary)]">Provedor:</span>
                          <span className="text-[var(--text-primary)]">
                            {provedor?.nome || 'Todos os provedores'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--text-secondary)]">Canais:</span>
                          <div className="flex gap-1">
                            {alerta.canais?.map(canal => (
                              <Badge key={canal} variant="outline" className="text-xs">
                                {canal}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        {alerta.destinatarios?.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-[var(--text-secondary)]">Destinatários:</span>
                            <span className="text-xs text-[var(--text-primary)]">
                              {alerta.destinatarios.join(', ')}
                            </span>
                          </div>
                        )}
                        
                        {alerta.total_disparos > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-[var(--text-secondary)]">Disparos:</span>
                            <Badge variant="outline" className="text-xs">
                              {alerta.total_disparos}x
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleMutation.mutate({ id: alerta.id, ativo: !alerta.ativo })}
                        disabled={toggleMutation.isPending}
                      >
                        {toggleMutation.isPending ? 'Salvando...' : (alerta.ativo ? 'Desativar' : 'Ativar')}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditing(alerta);
                          setShowForm(true);
                        }}
                        disabled={deleteMutation.isPending || toggleMutation.isPending}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(alerta.id)}
                        disabled={deleteMutation.isPending || toggleMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {showForm && (
        <AlertFormModal
          alerta={editing}
          provedores={provedores}
          escritorioId={escritorio?.id}
          onClose={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}