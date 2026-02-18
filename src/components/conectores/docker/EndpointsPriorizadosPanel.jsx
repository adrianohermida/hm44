import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Zap, TrendingUp, Activity, Play } from 'lucide-react';

const categoriaConfig = {
  'CRITICO': { color: 'bg-red-100 text-red-800 dark:bg-red-950/50', icon: Zap },
  'IMPORTANTE': { color: 'bg-orange-100 text-orange-800 dark:bg-orange-950/50', icon: TrendingUp },
  'NORMAL': { color: 'bg-blue-100 text-blue-800 dark:bg-blue-950/50', icon: Activity },
  'OPCIONAL': { color: 'bg-gray-100 text-gray-800 dark:bg-gray-950/50', icon: Activity }
};

export default function EndpointsPriorizadosPanel({ endpoints, onTestarEndpoint }) {
  const endpointsPriorizados = useMemo(() => {
    if (!endpoints?.length) return [];
    
    return endpoints
      .map(ep => ({
        ...ep,
        score: ep.prioridade_teste?.score || 0,
        categoria: ep.prioridade_teste?.categoria || 'NORMAL'
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [endpoints]);

  if (endpointsPriorizados.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-600" />
          Top 10 Endpoints Prioritários para Teste
        </CardTitle>
        <p className="text-xs text-[var(--text-tertiary)]">
          IA identificou os endpoints mais críticos baseado em importância funcional
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[500px]">
          <div className="divide-y divide-[var(--border-primary)]">
            {endpointsPriorizados.map((endpoint, index) => {
              const config = categoriaConfig[endpoint.categoria] || categoriaConfig['NORMAL'];
              const Icon = config.icon;

              return (
                <div 
                  key={index} 
                  className="p-4 hover:bg-[var(--bg-secondary)] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="text-xs font-mono">
                          {endpoint.metodo}
                        </Badge>
                        <code className="text-xs truncate">
                          {endpoint.path}
                        </code>
                      </div>
                      
                      <h4 className="text-sm font-semibold mb-1">{endpoint.nome}</h4>
                      
                      {endpoint.descricao && (
                        <p className="text-xs text-[var(--text-secondary)] mb-2 line-clamp-2">
                          {endpoint.descricao}
                        </p>
                      )}

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={config.color}>
                          <Icon className="w-3 h-3 mr-1" />
                          {endpoint.categoria}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Score: {endpoint.score}/100
                        </Badge>
                      </div>

                      {endpoint.prioridade_teste?.motivo && (
                        <div className="mt-2 text-xs bg-[var(--bg-tertiary)] p-2 rounded">
                          <span className="font-semibold">Motivo: </span>
                          {endpoint.prioridade_teste.motivo}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[var(--brand-primary)]">
                          #{index + 1}
                        </div>
                      </div>
                      {onTestarEndpoint && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => onTestarEndpoint(endpoint)}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Testar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}