import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, XCircle } from 'lucide-react';
import TesteResponseViewer from './TesteResponseViewer';
import SchemaComparator from '../SchemaComparator';
import TesteTimeline from '../TesteTimeline';

export default function ResultadoPainel({ resultado, endpoint, testes, onSaveSchema }) {
  if (!resultado) return null;

  return (
    <div className="space-y-4">
      <TesteResponseViewer 
        resultado={resultado} 
        endpoint={endpoint}
        onSaveSchema={onSaveSchema}
      />
      
      {endpoint?.schema_resposta && resultado.schema && (
        <SchemaComparator 
          schemaAnterior={endpoint.schema_resposta} 
          schemaNovo={resultado.schema} 
        />
      )}
      
      {resultado.validacao && !resultado.validacao.valido && (
        <Card className="border-amber-300 bg-amber-50/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-amber-900 mb-2 text-sm sm:text-base">
                  Divergências de Schema ({resultado.validacao.divergencias.length})
                </h3>
                {resultado.validacao.breaking_changes?.length > 0 && (
                  <p className="text-sm text-amber-800 mb-3 font-medium">
                    ⚠️ {resultado.validacao.breaking_changes.length} breaking changes críticas detectadas
                  </p>
                )}
                <div className="space-y-2 mt-3">
                  {resultado.validacao.divergencias.slice(0, 3).map((div, idx) => (
                    <div key={idx} className="bg-white p-2 rounded border border-amber-200 text-xs">
                      <span className="font-mono text-amber-900">{div.campo}</span>
                      <span className="text-amber-700 ml-2">→ {div.mensagem}</span>
                    </div>
                  ))}
                  {resultado.validacao.divergencias.length > 3 && (
                    <p className="text-xs text-amber-700 italic">
                      +{resultado.validacao.divergencias.length - 3} divergências adicionais...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {!resultado.sucesso && resultado.log_chamada?.erro_detalhado && (
        <Card className="border-red-300 bg-red-50/50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-red-900 mb-2 text-sm sm:text-base">Erro Detalhado</h3>
                <pre className="bg-red-900 text-red-100 p-3 rounded text-xs overflow-x-auto font-mono break-words">
                  {resultado.log_chamada.erro_detalhado}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <TesteTimeline testes={testes} />
    </div>
  );
}