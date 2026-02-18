import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Link as LinkIcon, Server, Code, CheckCircle, XCircle } from 'lucide-react';
import IDCopyButton from '@/components/common/IDCopyButton';

export default function LogTesteDetalhado({ resultado }) {
  if (!resultado) return null;

  const { contexto, teste_id, endpoint_id, provedor_id } = resultado;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Detalhes da Execução</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* IDs */}
        <div className="space-y-2">
          {teste_id && <IDCopyButton id={teste_id} label="Teste ID" />}
          {endpoint_id && <IDCopyButton id={endpoint_id} label="Endpoint ID" />}
          {provedor_id && <IDCopyButton id={provedor_id} label="Provedor ID" />}
        </div>

        {/* Contexto */}
        {contexto && (
          <>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <Server className="w-4 h-4 text-[var(--text-tertiary)]" />
                <span className="font-medium text-[var(--text-secondary)]">Versão API:</span>
                <Badge variant="outline">{contexto.versao_api || 'N/A'}</Badge>
              </div>
              
              <div className="flex items-center gap-2 text-xs">
                <Code className="w-4 h-4 text-[var(--text-tertiary)]" />
                <span className="font-medium text-[var(--text-secondary)]">Método:</span>
                <Badge>{contexto.metodo || 'GET'}</Badge>
              </div>
            </div>

            {contexto.url_completa && (
              <div>
                <p className="text-xs font-medium mb-1 text-[var(--text-secondary)] flex items-center gap-1">
                  <LinkIcon className="w-3 h-3" /> URL Completa
                </p>
                <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto select-all">
                  {contexto.url_completa}
                </pre>
              </div>
            )}

            {contexto.base_url && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[var(--text-tertiary)]">Base URL:</span>
                  <p className="font-mono text-[10px] truncate">{contexto.base_url}</p>
                </div>
                <div>
                  <span className="text-[var(--text-tertiary)]">Path:</span>
                  <p className="font-mono text-[10px] truncate">{contexto.path}</p>
                </div>
              </div>
            )}

            {contexto.path_params_substituidos?.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-2">Path Params Substituídos:</p>
                <div className="space-y-1">
                  {contexto.path_params_substituidos.map((pp, i) => (
                    <div key={i} className="flex items-center justify-between bg-orange-50 dark:bg-orange-900/20 p-2 rounded text-xs">
                      <code className="font-bold">{`{${pp.nome}}`}</code>
                      <span>→</span>
                      <code className="bg-orange-200 dark:bg-orange-800 px-1 rounded">{pp.valor}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contexto.headers_enviados?.length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1">Headers Enviados:</p>
                <div className="flex flex-wrap gap-1">
                  {contexto.headers_enviados.map((h, i) => (
                    <Badge key={i} variant="outline" className="text-xs">{h}</Badge>
                  ))}
                </div>
              </div>
            )}

            {contexto.parametros_usados && Object.keys(contexto.parametros_usados).length > 0 && (
              <div>
                <p className="text-xs font-medium mb-1">Parâmetros Usados:</p>
                <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto">
                  {JSON.stringify(contexto.parametros_usados, null, 2)}
                </pre>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}