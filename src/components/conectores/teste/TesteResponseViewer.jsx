import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Save } from 'lucide-react';
import { toast } from 'sonner';
import TesteResultStatus from '../status/TesteResultStatus';
import TesteMetricsBar from '../metrics/TesteMetricsBar';
import SchemaValidator from '../validation/SchemaValidator';

export default function TesteResponseViewer({ resultado, endpoint, onSaveSchema }) {
  if (!resultado) return null;

  const tamanho = resultado.tamanho_bytes || JSON.stringify(resultado.resposta || {}).length;

  const copyToClipboard = (data) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    toast.success('Copiado para área de transferência');
  };

  const handleSaveSchema = () => {
    if (resultado.schema) {
      onSaveSchema?.(resultado.schema);
      toast.success('Schema salvo no endpoint');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Resposta</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <TesteResultStatus 
              status={resultado.sucesso ? 'SUCESSO' : 'ERRO'} 
              httpStatus={resultado.http_status || (resultado.erro ? 500 : 200)} 
            />
            {resultado.schema && (
              <>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(resultado.schema)}>
                  <Copy className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Copiar Schema</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleSaveSchema}>
                  <Save className="w-4 h-4 sm:mr-1" />
                  <span className="hidden sm:inline">Salvar Schema</span>
                </Button>
              </>
            )}
          </div>
        </div>
        <TesteMetricsBar 
          tempo_ms={resultado.tempo_ms} 
          tamanho_bytes={tamanho} 
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="body">
          <div className="overflow-x-auto pb-2 -mx-2 px-2">
            <TabsList className="w-full sm:w-auto inline-flex">
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="chamada">Chamada</TabsTrigger>
              {endpoint?.schema_resposta && <TabsTrigger value="validacao">Validação</TabsTrigger>}
            </TabsList>
          </div>
          <TabsContent value="body" className="mt-3">
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-2 right-2 z-10"
                onClick={() => copyToClipboard(resultado.resposta || resultado)}
              >
                <Copy className="w-4 h-4" />
              </Button>
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto max-h-[400px] font-mono">
                <code className="language-json">
                  {JSON.stringify(resultado.resposta || resultado, null, 2)}
                </code>
              </pre>
            </div>
          </TabsContent>
          <TabsContent value="headers" className="mt-3">
            <div className="space-y-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  ℹ️ <strong>Headers Recebidos</strong> da API externa (response headers)
                </p>
              </div>
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => copyToClipboard(resultado.headers)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto font-mono max-h-[300px]">
                  <code className="language-json">
                    {JSON.stringify(resultado.headers || {}, null, 2)}
                  </code>
                </pre>
              </div>
              
              {resultado.log_chamada?.headers_enviados && (
                <>
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded mt-4">
                    <p className="text-xs text-green-800 dark:text-green-200">
                      📤 <strong>Headers Enviados</strong> para a API (request headers)
                    </p>
                  </div>
                  <div className="relative">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="absolute top-2 right-2 z-10"
                      onClick={() => copyToClipboard(resultado.log_chamada.headers_enviados)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-xs overflow-x-auto font-mono max-h-[300px]">
                      <code className="language-json">
                        {JSON.stringify(resultado.log_chamada.headers_enviados, null, 2)}
                      </code>
                    </pre>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          <TabsContent value="chamada" className="mt-3">
            {(() => {
              // FALLBACK: usar contexto se log_chamada ausente
              const logData = resultado.log_chamada || {
                metodo: resultado.contexto?.metodo || endpoint?.metodo || 'N/A',
                url_completa: resultado.contexto?.url_completa || 'N/A',
                versao_api: resultado.contexto?.versao_api || endpoint?.versao_api || 'N/A',
                headers_enviados: resultado.contexto?.headers_enviados || {},
                parametros_enviados: resultado.contexto?.parametros_enviados || {},
                body_enviado: resultado.contexto?.body_enviado || null,
                secret_usado: '***',
                secret_name: resultado.contexto?.secret_name || 'N/A',
                auth_location: 'unknown',
                erro_detalhado: resultado.contexto?.erro_detalhado
              };

              const authInfo = logData.auth_location === 'query_param' 
                ? `Query Param: ${logData.secret_name}` 
                : logData.auth_location === 'header'
                ? `Header: ${logData.secret_name}`
                : `Secret: ${logData.secret_name}`;

              return (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded border">
                    <div className="text-xs">
                      <span className="font-semibold text-[var(--text-secondary)]">Autenticação via:</span>
                      <span className="ml-2 text-[var(--text-primary)]">{authInfo}</span>
                    </div>
                    <div className="text-xs">
                      <span className="font-semibold text-[var(--text-secondary)]">Secret:</span>
                      <code className="ml-2 bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 rounded text-yellow-800 dark:text-yellow-200">
                        {logData.secret_usado}
                      </code>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const headers = logData.headers_enviados || {};
                        let curlCmd = `curl -X ${logData.metodo} '${logData.url_completa}'`;
                        
                        for (const [key, value] of Object.entries(headers)) {
                          curlCmd += ` \\\n  -H '${key}: ${value}'`;
                        }
                        
                        if (logData.body_enviado) {
                          curlCmd += ` \\\n  -d '${logData.body_enviado}'`;
                        }
                        
                        navigator.clipboard.writeText(curlCmd);
                        toast.success('Comando curl copiado');
                      }}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar cURL
                    </Button>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">cURL Completo</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto max-h-[200px] select-all">
{(() => {
  const headers = logData.headers_enviados || {};
  let cmd = `curl -X ${logData.metodo} '${logData.url_completa}'`;
  
  for (const [key, value] of Object.entries(headers)) {
    cmd += ` \\\n  -H '${key}: ${value}'`;
  }
  
  if (logData.body_enviado) {
    cmd += ` \\\n  -d '${logData.body_enviado}'`;
  }
  
  return cmd;
})()}
                    </pre>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">URL Completa</p>
                    <pre className="bg-[var(--bg-secondary)] p-2 rounded text-xs break-all select-all">
                      {logData.url_completa}
                    </pre>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">Método</p>
                      <pre className="bg-[var(--bg-secondary)] p-2 rounded text-xs">
                        {logData.metodo}
                      </pre>
                    </div>
                    <div>
                      <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">Versão API</p>
                      <pre className="bg-[var(--bg-secondary)] p-2 rounded text-xs">
                        {logData.versao_api}
                      </pre>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">Headers Enviados</p>
                    <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto select-all max-h-[200px]">
                      {JSON.stringify(logData.headers_enviados, null, 2)}
                    </pre>
                  </div>
                  
                  {logData.parametros_enviados && Object.keys(logData.parametros_enviados).length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">Parâmetros Enviados</p>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto select-all max-h-[200px]">
                        {JSON.stringify(logData.parametros_enviados, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {logData.body_enviado && (
                    <div>
                      <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">Body Enviado</p>
                      <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto select-all max-h-[200px]">
                        {logData.body_enviado}
                      </pre>
                    </div>
                  )}
                  
                  {logData.erro_detalhado && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
                      <p className="text-xs font-semibold text-red-800 dark:text-red-200 mb-2">Erro Detalhado</p>
                      <pre className="text-xs text-red-700 dark:text-red-300 whitespace-pre-wrap select-all max-h-[300px] overflow-auto">
                        {logData.erro_detalhado}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })()}
          </TabsContent>
          {endpoint?.schema_resposta && (
            <TabsContent value="validacao" className="mt-3">
              <SchemaValidator 
                response={resultado.resposta} 
                expectedSchema={endpoint.schema_resposta} 
              />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}