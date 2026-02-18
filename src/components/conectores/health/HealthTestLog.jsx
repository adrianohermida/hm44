import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function HealthTestLog({ result }) {
  if (!result?.log_chamada) return null;

  const { log_chamada } = result;

  const copyCurl = () => {
    const params = log_chamada.parametros_enviados 
      ? Object.entries(log_chamada.parametros_enviados)
          .map(([k, v]) => `${k}=${v}`)
          .join('&')
      : '';
    
    const urlCompleta = params 
      ? `${log_chamada.url_completa}?${params}` 
      : log_chamada.url_completa;

    const curl = `curl -X ${log_chamada.metodo || 'GET'} '${urlCompleta}' \\
  -H 'Authorization: Bearer ${log_chamada.secret_usado}' \\
  -H 'Content-Type: application/json'`;

    navigator.clipboard.writeText(curl);
    toast.success('cURL copiado');
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Log da Chamada</CardTitle>
          <Button size="sm" variant="outline" onClick={copyCurl}>
            <Copy className="w-3 h-3 mr-1" />
            Copiar cURL
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">URL Completa</p>
          <code className="block bg-[var(--bg-secondary)] p-2 rounded text-xs break-all">
            {log_chamada.url_completa}
          </code>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Método</p>
            <code className="block bg-[var(--bg-secondary)] p-2 rounded text-xs">
              {log_chamada.metodo || 'GET'}
            </code>
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Versão</p>
            <code className="block bg-[var(--bg-secondary)] p-2 rounded text-xs">
              {log_chamada.versao_api || 'N/A'}
            </code>
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Headers</p>
          <pre className="bg-[var(--bg-secondary)] p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(log_chamada.headers_enviados, null, 2)}
          </pre>
        </div>
        {log_chamada.parametros_enviados && Object.keys(log_chamada.parametros_enviados).length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[var(--text-secondary)] mb-1">Parâmetros</p>
            <pre className="bg-[var(--bg-secondary)] p-2 rounded text-xs overflow-x-auto">
              {JSON.stringify(log_chamada.parametros_enviados, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}