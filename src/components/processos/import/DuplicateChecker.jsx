import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';

export default function DuplicateChecker({ duplicados, onStrategyChange, strategy }) {
  if (!duplicados || duplicados.total === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <p className="font-semibold">
            {duplicados.total} duplicados detectados:
          </p>
          <div className="flex gap-2 flex-wrap text-sm">
            {duplicados.planilha > 0 && (
              <Badge variant="outline">{duplicados.planilha} na planilha</Badge>
            )}
            {duplicados.db > 0 && (
              <Badge variant="outline">{duplicados.db} já existentes no sistema</Badge>
            )}
          </div>
          <select
            value={strategy}
            onChange={(e) => onStrategyChange(e.target.value)}
            className="w-full mt-2 p-2 border rounded"
          >
            <option value="skip">Pular duplicados</option>
            <option value="update">Atualizar registros existentes</option>
            <option value="merge">Mesclar dados (manter + complementar)</option>
            <option value="fail">Falhar importação</option>
          </select>
        </div>
      </AlertDescription>
    </Alert>
  );
}