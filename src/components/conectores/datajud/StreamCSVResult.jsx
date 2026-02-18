import React from 'react';
import { Download, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StreamCSVResult({ result, errors, onDownloadErrors }) {
  if (!result) return null;

  const hasErrors = errors && errors.length > 0;

  return (
    <Card className="border-[var(--brand-primary)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--brand-primary)]">
          <CheckCircle2 className="w-5 h-5" />
          Importação Concluída
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-[var(--text-tertiary)]">Total processado</p>
            <p className="text-2xl font-bold">{result.total}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-tertiary)]">Duração</p>
            <p className="text-2xl font-bold">{result.duracao}s</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-tertiary)]">Sucesso</p>
            <p className="text-2xl font-bold text-green-600">{result.sucesso}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-tertiary)]">Falhas</p>
            <p className="text-2xl font-bold text-red-600">{result.falhas}</p>
          </div>
        </div>

        {hasErrors && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {errors.length} erro(s) detectado(s)
              </span>
            </div>
            <Button
              onClick={onDownloadErrors}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Relatório de Erros (CSV)
            </Button>
          </div>
        )}

        {result.job_id && (
          <p className="text-xs text-[var(--text-tertiary)] text-center">
            Job ID: {result.job_id}
          </p>
        )}
      </CardContent>
    </Card>
  );
}