import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import SchemaActionButtons from './SchemaActionButtons';

export default function TestResultsDetailPanel({ results, onSaveSchema }) {
  if (!results) return null;

  const isSuccess = results.sucesso !== false;
  const statusCode = results.http_status || (results.erro ? 500 : 200);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Resultado do Teste</CardTitle>
          <Badge variant={isSuccess ? 'default' : 'destructive'}>
            {isSuccess ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
            {statusCode}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--text-secondary)]">Tempo:</span>
            <span className="ml-2 font-semibold">
              {results.tempo_ms || results.teste?.tempo_resposta_ms || 0}ms
            </span>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Tamanho:</span>
            <span className="ml-2 font-semibold">
              {results.tamanho_bytes 
                ? (results.tamanho_bytes / 1024).toFixed(2) 
                : (JSON.stringify(results.resposta || {}).length / 1024).toFixed(2)}KB
            </span>
          </div>
        </div>
        {(results.erro || results.log_chamada?.erro_detalhado) && (
          <div className="p-2 bg-red-50 border border-red-200 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
              <div className="text-xs text-red-700">
                {results.erro || results.log_chamada?.erro_detalhado}
              </div>
            </div>
          </div>
        )}
        {results.schema && (
          <SchemaActionButtons schema={results.schema} onSave={() => onSaveSchema(results.schema)} />
        )}
      </CardContent>
    </Card>
  );
}