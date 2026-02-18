import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function CallbacksMonitor({ processoId }) {
  const { data: callbacks = [], refetch } = useQuery({
    queryKey: ['callbacks', processoId],
    queryFn: () => base44.entities.CallbackEscavador.filter({ processo_id: processoId }),
    refetchInterval: 10000 // Verificar a cada 10s
  });

  const handleProcessar = async (callbackId) => {
    try {
      const { data } = await base44.functions.invoke('processarCallbackPendente', {
        callback_id: callbackId,
        processo_id: processoId
      });
      
      toast.success('Callback processado');
      refetch();
    } catch (error) {
      toast.error('Erro ao processar callback');
    }
  };

  if (callbacks.length === 0) return null;

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Callbacks Recebidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {callbacks.slice(0, 5).map(cb => (
            <div 
              key={cb.id}
              className="flex items-center justify-between p-2 border border-[var(--border-primary)] rounded-lg"
            >
              <div className="flex items-center gap-2">
                {cb.processado ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : cb.status === 'Em tentativa' ? (
                  <Clock className="w-4 h-4 text-yellow-600" />
                ) : cb.status === 'Falha' ? (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-blue-600" />
                )}
                <div>
                  <p className="text-xs font-medium">{cb.evento}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {cb.created_date && formatDistanceToNow(new Date(cb.created_date), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={cb.processado ? 'default' : 'secondary'}>
                  {cb.processado ? 'Processado' : 'Pendente'}
                </Badge>
                {!cb.processado && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleProcessar(cb.id)}
                  >
                    Processar
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}