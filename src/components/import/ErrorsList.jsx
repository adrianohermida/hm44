import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function ErrorsList({ erros }) {
  if (!erros || erros.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="text-sm font-medium mb-2">{erros.length} erro(s) detectado(s)</div>
        <div className="max-h-40 overflow-y-auto space-y-1 text-xs">
          {erros.slice(0, 10).map((e, i) => (
            <div key={i}>Linha {e.linha}: {e.erro}</div>
          ))}
          {erros.length > 10 && <div className="text-[var(--text-secondary)]">... e mais {erros.length - 10}</div>}
        </div>
      </AlertDescription>
    </Alert>
  );
}