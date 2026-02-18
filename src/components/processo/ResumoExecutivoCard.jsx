import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileCheck, AlertCircle, Calendar, Lightbulb } from 'lucide-react';

export default function ResumoExecutivoCard({ resumo }) {
  if (!resumo) return null;

  return (
    <Card className="border-[var(--brand-primary)]">
      <CardHeader className="bg-[var(--brand-primary-50)]">
        <CardTitle className="flex items-center gap-2 text-[var(--brand-primary-700)]">
          <FileCheck className="w-5 h-5" />
          Resumo Executivo - Análise IA
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div>
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">Identificação</h3>
          <p className="text-sm text-[var(--text-secondary)]">{resumo.identificacao}</p>
        </div>

        {resumo.partes?.length > 0 && (
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-2">Partes</h3>
            <div className="flex flex-wrap gap-2">
              {resumo.partes.map((p, i) => (
                <Badge key={i} variant="outline">{p}</Badge>
              ))}
            </div>
          </div>
        )}

        {resumo.pontos_criticos?.length > 0 && (
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-[var(--brand-warning)]" />
              Pontos Críticos
            </h3>
            <ul className="space-y-1">
              {resumo.pontos_criticos.map((p, i) => (
                <li key={i} className="text-sm text-[var(--text-secondary)]">• {p}</li>
              ))}
            </ul>
          </div>
        )}

        {resumo.prazos?.length > 0 && (
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[var(--brand-error)]" />
              Prazos Importantes
            </h3>
            <ul className="space-y-1">
              {resumo.prazos.map((p, i) => (
                <li key={i} className="text-sm text-[var(--text-secondary)]">• {p}</li>
              ))}
            </ul>
          </div>
        )}

        {resumo.recomendacoes?.length > 0 && (
          <div className="bg-[var(--brand-info)]/10 p-3 rounded-lg">
            <h3 className="font-semibold text-[var(--text-primary)] flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-[var(--brand-info)]" />
              Recomendações
            </h3>
            <ul className="space-y-1">
              {resumo.recomendacoes.map((r, i) => (
                <li key={i} className="text-sm text-[var(--text-secondary)]">• {r}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}