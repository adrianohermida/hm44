import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp, Code, AlertCircle } from 'lucide-react';

export default function HealthTestResult({ result }) {
  const [showDetails, setShowDetails] = useState(false);
  
  if (!result) return null;

  const isSuccess = result.sucesso !== false && !result.erro;
  const statusCode = result.http_status || result.status_code || (result.erro ? 500 : 200);
  const latencia = result.latencia_ms || result.latencia || result.tempo_resposta_ms || result.tempo_ms || 0;

  return (
    <div className="space-y-3">
      <Alert className={isSuccess ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        <div className="flex items-start gap-3">
          {isSuccess ? (
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
          )}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">Tempo: {latencia}ms</span>
              <Badge variant={statusCode < 300 ? 'default' : 'destructive'}>
                {statusCode}
              </Badge>
            </div>
            {result.endpoint_testado && (
              <p className="text-xs text-[var(--text-secondary)]">
                Endpoint: {result.endpoint_testado}
              </p>
            )}
            {result.url_testado && (
              <p className="text-xs text-[var(--text-tertiary)] font-mono truncate">
                {result.url_testado}
              </p>
            )}
            {result.erro && (
              <div className="flex items-start gap-2 mt-2 p-2 bg-red-100 border border-red-300 rounded">
                <AlertCircle className="w-4 h-4 text-red-700 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-red-700 flex-1">{result.erro}</p>
              </div>
            )}
            {result.detalhes && typeof result.detalhes === 'string' && (
              <div className="flex items-start gap-2 mt-2 p-2 bg-amber-50 border border-amber-300 rounded">
                <AlertCircle className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 flex-1">💡 {result.detalhes}</p>
              </div>
            )}

          </div>
        </div>
      </Alert>

      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setShowDetails(!showDetails)}
        className="w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          Log da API Call
        </span>
        {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {showDetails && (
        <div className="space-y-3 pt-2">
          <div>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">REQUEST</p>
            <div className="bg-slate-900 rounded-lg p-3 overflow-x-auto">
              <p className="text-xs text-green-400 font-mono">
                {result.metodo || 'GET'} {result.url_testado || 'N/A'}
              </p>
              {result.detalhes?.secret_usado && (
                <p className="text-xs text-blue-300 font-mono mt-2">
                  API Key: {result.detalhes.secret_usado?.substring(0, 20)}...
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">RESPONSE</p>
            <div className="bg-slate-900 rounded-lg p-3">
              <p className="text-xs text-yellow-400 font-mono">
                HTTP {statusCode} {isSuccess ? '✓' : '✗'}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Latência: {latencia}ms
              </p>
              {result.erro && (
                <div className="mt-2 p-2 bg-red-900/20 rounded border border-red-700">
                  <p className="text-xs text-red-300 font-mono whitespace-pre-wrap">{result.erro}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}