import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, X, ExternalLink, Key, DollarSign, RefreshCw } from 'lucide-react';
import ProvedorHealthCard from '@/components/conectores/health/ProvedorHealthCard';
import HealthHistory from '@/components/conectores/health/HealthHistory';
import ProvedorEndpointsList from '@/components/conectores/endpoints/ProvedorEndpointsList';
import QuotaConfigPanel from '@/components/provedores/QuotaConfigPanel';
import ConsumoHistoricoProvedor from '@/components/conectores/consumo/ConsumoHistoricoProvedor';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import ErrorBoundary from '@/components/common/ErrorBoundary';

function ProvedorDetailModalContent({ provedor, onClose, onEdit }) {
  const [tab, setTab] = useState('info');
  const queryClient = useQueryClient();
  
  const { data: saldo, refetch: refetchSaldo, isLoading: loadingSaldo } = useQuery({
    queryKey: ['saldo', provedor?.id],
    queryFn: async () => {
      if (provedor?.nome === 'Escavador' || provedor?.endpoint_saldo_id) {
        const { data } = await base44.functions.invoke('consultarSaldoEscavador');
        return data;
      }
      return null;
    },
    enabled: !!(provedor?.endpoint_saldo_id || provedor?.nome === 'Escavador'),
    refetchInterval: 60000
  });
  
  if (!provedor) return null;

  return (
    <Dialog open={!!provedor} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>{provedor.nome}</DialogTitle>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => onEdit(provedor)} className="bg-[var(--brand-primary)]">
                <Edit className="w-4 h-4 mr-2" />Editar
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)]">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="health">Saúde</TabsTrigger>
            <TabsTrigger value="quota">Quota</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="consumo">Consumo</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
          {(provedor.endpoint_saldo_id || provedor.nome === 'Escavador') && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Saldo API
                  </span>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={() => refetchSaldo()}
                    disabled={loadingSaldo}
                    className="h-6 w-6"
                  >
                    <RefreshCw className={`w-3 h-3 ${loadingSaldo ? 'animate-spin' : ''}`} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {saldo?.sucesso ? (
                  <>
                    <div className="text-2xl font-bold">{saldo.quantidade_creditos}</div>
                    <p className="text-xs text-[var(--text-tertiary)]">{saldo.saldo_descricao}</p>
                  </>
                ) : (
                  <p className="text-sm text-[var(--text-tertiary)]">
                    {loadingSaldo ? 'Carregando...' : 'Não disponível'}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Tipo de API</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge>{provedor.tipo}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">URLs Base</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {provedor.base_url_v1 && (
                <div>
                  <span className="text-xs text-[var(--brand-text-secondary)]">V1:</span>
                  <code className="block text-sm bg-[var(--brand-bg-tertiary)] px-2 py-1 rounded mt-1">
                    {provedor.base_url_v1}
                  </code>
                </div>
              )}
              {provedor.base_url_v2 && (
                <div>
                  <span className="text-xs text-[var(--brand-text-secondary)]">V2:</span>
                  <code className="block text-sm bg-[var(--brand-bg-tertiary)] px-2 py-1 rounded mt-1">
                    {provedor.base_url_v2}
                  </code>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Key className="w-4 h-4" />Autenticação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-xs text-[var(--text-tertiary)]">Tipo:</span>
                <Badge className="ml-2">{provedor.tipo_autenticacao || 'api_key'}</Badge>
              </div>
              
              {(provedor.tipo_autenticacao === 'api_key' || provedor.tipo_autenticacao === 'hybrid') && provedor.api_key_config && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[var(--text-secondary)]">API Key Config:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[var(--text-tertiary)]">Secret:</span>
                      <code className="block text-sm bg-[var(--bg-tertiary)] px-2 py-1 rounded mt-1">
                        {provedor.api_key_config.secret_name || provedor.secret_name || 'N/A'}
                      </code>
                    </div>
                    {provedor.api_key_config.header_name && (
                      <div>
                        <span className="text-[var(--text-tertiary)]">Header:</span>
                        <code className="block text-sm bg-[var(--bg-tertiary)] px-2 py-1 rounded mt-1">
                          {provedor.api_key_config.header_name}
                        </code>
                      </div>
                    )}
                    {provedor.api_key_config.query_param_name && (
                      <div>
                        <span className="text-[var(--text-tertiary)]">Query Param:</span>
                        <code className="block text-sm bg-[var(--bg-tertiary)] px-2 py-1 rounded mt-1">
                          {provedor.api_key_config.query_param_name}
                        </code>
                      </div>
                    )}
                    {provedor.api_key_config.prefix && (
                      <div>
                        <span className="text-[var(--text-tertiary)]">Prefix:</span>
                        <code className="block text-sm bg-[var(--bg-tertiary)] px-2 py-1 rounded mt-1">
                          {provedor.api_key_config.prefix}
                        </code>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {(provedor.tipo_autenticacao === 'oauth2' || provedor.tipo_autenticacao === 'hybrid') && provedor.oauth_config && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-[var(--text-secondary)]">OAuth 2.0 Config:</div>
                  <div className="space-y-2 text-xs">
                    {provedor.oauth_config.client_id && (
                      <div>
                        <span className="text-[var(--text-tertiary)]">Client ID:</span>
                        <code className="block text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded mt-1 truncate">
                          {provedor.oauth_config.client_id}
                        </code>
                      </div>
                    )}
                    {provedor.oauth_config.auth_url && (
                      <div>
                        <span className="text-[var(--text-tertiary)]">Auth URL:</span>
                        <code className="block text-xs bg-[var(--bg-tertiary)] px-2 py-1 rounded mt-1 truncate">
                          {provedor.oauth_config.auth_url}
                        </code>
                      </div>
                    )}
                    {provedor.oauth_config.scopes && provedor.oauth_config.scopes.length > 0 && (
                      <div>
                        <span className="text-[var(--text-tertiary)]">Scopes ({provedor.oauth_config.scopes.length}):</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {provedor.oauth_config.scopes.map((scope, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">
                              {scope.split('/').pop()}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {provedor.documentacao_url && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Documentação</CardTitle>
              </CardHeader>
              <CardContent>
                <a 
                  href={provedor.documentacao_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[var(--brand-primary)] hover:underline"
                >
                  Acessar documentação
                  <ExternalLink className="w-4 h-4" />
                </a>
              </CardContent>
            </Card>
          )}

          {provedor.descricao && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[var(--brand-text-secondary)]">{provedor.descricao}</p>
              </CardContent>
            </Card>
          )}
          </TabsContent>

          <TabsContent value="health" className="space-y-4">
            <ProvedorHealthCard 
              provedor={provedor} 
              onTest={() => queryClient.invalidateQueries(['provedores'])} 
            />
            <HealthHistory provedorId={provedor.id} />
          </TabsContent>

          <TabsContent value="quota" className="space-y-4">
            <QuotaConfigPanel provedor={provedor} />
          </TabsContent>

          <TabsContent value="endpoints" className="space-y-4">
            <ProvedorEndpointsList provedorId={provedor.id} />
          </TabsContent>

          <TabsContent value="consumo" className="space-y-4">
            <ConsumoHistoricoProvedor 
              provedorId={provedor.id}
              escritorioId={provedor.escritorio_id}
            />
          </TabsContent>
        </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function ProvedorDetailModal(props) {
  return (
    <ErrorBoundary>
      <ProvedorDetailModalContent {...props} />
    </ErrorBoundary>
  );
}