import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TestResult({ result }) {
  if (!result) return null;

  // Se for o teste de comunicação com estrutura especial
  if (result.data?.testes) {
    return <ComunicacaoTestResult result={result.data} />;
  }

  const Icon = result.success ? CheckCircle : XCircle;
  const bgColor = result.success ? 'bg-green-50' : 'bg-red-50';
  const borderColor = result.success ? 'border-green-200' : 'border-red-200';
  const iconColor = result.success ? 'text-green-600' : 'text-red-600';

  return (
    <div className="space-y-3">
      <Alert className={`${bgColor} ${borderColor}`}>
        <Icon className={`h-4 w-4 ${iconColor}`} />
        <AlertDescription className="text-[var(--text-primary)]">
          <strong>{result.success ? 'Passou' : 'Falhou'}</strong>
          {result.message && <span className="ml-2">{result.message}</span>}
        </AlertDescription>
      </Alert>

      {result.details && (
        <div className="bg-[var(--bg-tertiary)] rounded-lg p-4">
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Detalhes:</h4>
          <pre className="text-xs text-[var(--text-secondary)] whitespace-pre-wrap">
            {JSON.stringify(result.details, null, 2)}
          </pre>
        </div>
      )}

      {result.error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {result.error}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function ComunicacaoTestResult({ result }) {
  const { resumo, testes, violacoes_criticas, funcionalidades_testadas } = result;

  return (
    <div className="space-y-4">
      {/* Resumo */}
      <Alert className={resumo?.failed === 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
        {resumo?.failed === 0 ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
        <AlertDescription>
          <div className="font-bold text-lg">{resumo?.status_geral}</div>
          <div className="text-sm mt-1">
            {resumo?.passed}/{resumo?.total} testes passaram • Taxa de sucesso: {resumo?.taxa_sucesso}
          </div>
        </AlertDescription>
      </Alert>

      {/* Funcionalidades Testadas */}
      {funcionalidades_testadas && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Info className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Funcionalidades Testadas</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="font-semibold text-blue-800 mb-1">Entities:</div>
              <div className="space-x-1">
                {funcionalidades_testadas.entities?.map(e => (
                  <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-blue-800 mb-1">Functions:</div>
              <div className="space-x-1 flex flex-wrap gap-1">
                {funcionalidades_testadas.functions?.map(f => (
                  <Badge key={f} variant="outline" className="text-xs">{f}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-blue-800 mb-1">Fluxos:</div>
              <div className="space-x-1 flex flex-wrap gap-1">
                {funcionalidades_testadas.fluxos?.map(fl => (
                  <Badge key={fl} variant="outline" className="text-xs">{fl}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="font-semibold text-blue-800 mb-1">Recursos:</div>
              <div className="space-x-1 flex flex-wrap gap-1">
                {funcionalidades_testadas.recursos?.map(r => (
                  <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Testes */}
      <div className="space-y-2">
        <h4 className="font-semibold text-sm">Resultados Detalhados:</h4>
        {testes?.map((teste, idx) => (
          <div key={idx} className={`p-3 rounded-lg border ${
            teste.status === 'PASS' ? 'bg-green-50 border-green-200' :
            teste.status === 'SKIP' ? 'bg-gray-50 border-gray-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-2">
              {teste.status === 'PASS' && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
              {teste.status === 'FAIL' && <XCircle className="h-4 w-4 text-red-600 mt-0.5" />}
              {teste.status === 'SKIP' && <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />}
              <div className="flex-1">
                <div className="font-medium text-sm">{teste.teste}</div>
                {teste.erro && (
                  <div className="text-xs text-red-700 mt-1 font-mono">{teste.erro}</div>
                )}
                {teste.detalhes && (
                  <details className="mt-2">
                    <summary className="text-xs cursor-pointer text-gray-600 hover:text-gray-900">Ver detalhes</summary>
                    <pre className="text-xs mt-1 p-2 bg-white/50 rounded overflow-x-auto">
                      {JSON.stringify(teste.detalhes, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Violações Críticas */}
      {violacoes_criticas?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h4 className="font-bold text-red-900">Violações Críticas Detectadas</h4>
          </div>
          <div className="space-y-3">
            {violacoes_criticas.map((v, idx) => (
              <div key={idx} className="bg-white rounded p-3">
                <div className="font-semibold text-sm text-red-900 mb-1">{v.teste}</div>
                <div className="text-xs text-red-700 mb-2">❌ {v.erro}</div>
                {v.correcao && (
                  <div className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
                    <div className="font-semibold text-blue-900 mb-1">💡 Como corrigir:</div>
                    <div className="whitespace-pre-wrap text-blue-800">{v.correcao}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}