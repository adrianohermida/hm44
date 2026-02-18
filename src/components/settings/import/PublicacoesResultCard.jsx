import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function PublicacoesResultCard({ result }) {
  if (!result) return null;

  return (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-green-900 mb-2">
              Importação concluída
            </h4>
            <div className="text-sm space-y-1">
              <p>✅ {result.importadas} publicações importadas</p>
              <p>📋 {result.processos_criados} processos criados</p>
              <p>🔗 {result.processos_vinculados} processos vinculados</p>
              {result.prazos_criados > 0 && (
                <p className="text-purple-600">
                  ⏰ {result.prazos_criados} prazos calculados
                </p>
              )}
              {result.erros?.length > 0 && (
                <p className="text-red-600">
                  ⚠️ {result.erros.length} erros
                </p>
              )}
            </div>
          </div>
        </div>

        {result.erros?.length > 0 && (
          <div className="mt-4 max-h-40 overflow-y-auto">
            <p className="text-xs font-semibold mb-2">Erros:</p>
            {result.erros.slice(0, 10).map((erro, idx) => (
              <p key={idx} className="text-xs text-red-600">
                Linha {erro.linha}: {erro.erro}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}