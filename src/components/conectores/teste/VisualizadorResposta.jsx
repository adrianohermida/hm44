import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Check, Code2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import TesteResultStatus from '../status/TesteResultStatus';

export default function VisualizadorResposta({ resultado }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = (texto) => {
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    toast.success('Copiado para área de transferência');
    setTimeout(() => setCopiado(false), 2000);
  };

  const formatarJSON = (obj) => JSON.stringify(obj, null, 2);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle>Resultado do Teste</CardTitle>
          <div className="flex items-center gap-2">
            <TesteResultStatus 
              status={resultado.sucesso ? 'SUCESSO' : 'ERRO'} 
              httpStatus={resultado.http_status}
            />
            <span className="text-xs text-[var(--text-secondary)]">
              {resultado.tempo_ms}ms
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="response" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
            <TabsTrigger value="response">Resposta</TabsTrigger>
            <TabsTrigger value="headers">Headers</TabsTrigger>
            <TabsTrigger value="metadata">Detalhes</TabsTrigger>
            {resultado.validacao && (
              <TabsTrigger value="validacao">Validação</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="response" className="space-y-3">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copiar(formatarJSON(resultado.resposta))}
              >
                {copiado ? <Check className="w-3 h-3 mr-2" /> : <Copy className="w-3 h-3 mr-2" />}
                Copiar JSON
              </Button>
            </div>
            <pre className="bg-[var(--bg-secondary)] p-4 rounded-lg overflow-x-auto text-xs border border-[var(--border-primary)]">
              <code className="language-json">
                {formatarJSON(resultado.resposta)}
              </code>
            </pre>
          </TabsContent>

          <TabsContent value="headers" className="space-y-3">
            <pre className="bg-[var(--bg-secondary)] p-4 rounded-lg overflow-x-auto text-xs border border-[var(--border-primary)]">
              <code className="language-json">
                {formatarJSON(resultado.headers || {})}
              </code>
            </pre>
          </TabsContent>

          <TabsContent value="metadata" className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-secondary)]">Status HTTP</p>
                <p className="text-sm font-semibold">{resultado.http_status}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-secondary)]">Tempo de Resposta</p>
                <p className="text-sm font-semibold">{resultado.tempo_ms}ms</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-secondary)]">Tamanho</p>
                <p className="text-sm font-semibold">
                  {resultado.tamanho_bytes ? `${(resultado.tamanho_bytes / 1024).toFixed(2)} KB` : 'N/A'}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[var(--text-secondary)]">Sucesso</p>
                <p className="text-sm font-semibold">
                  {resultado.sucesso ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 inline" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 inline" />
                  )}
                </p>
              </div>
            </div>
          </TabsContent>

          {resultado.validacao && (
            <TabsContent value="validacao" className="space-y-3">
              {resultado.validacao.valido ? (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    Schema validado com sucesso
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="text-sm text-amber-800 font-medium">
                      {resultado.validacao.divergencias?.length} divergências encontradas
                    </span>
                  </div>
                  <div className="space-y-2">
                    {resultado.validacao.divergencias?.map((div, idx) => (
                      <div key={idx} className="p-2 bg-[var(--bg-secondary)] rounded border border-[var(--border-primary)] text-xs">
                        <p className="font-mono text-amber-700">{div.path || div.campo}</p>
                        <p className="text-[var(--text-secondary)]">{div.mensagem}</p>
                        {div.severidade && (
                          <span className={`text-xs font-semibold ${
                            div.severidade === 'CRITICAL' ? 'text-red-600' : 
                            div.severidade === 'WARNING' ? 'text-amber-600' : 'text-blue-600'
                          }`}>
                            {div.severidade}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}