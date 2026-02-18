import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function BreakingChangeDetector({ camposRemovidos, tiposAlterados }) {
  if (!camposRemovidos?.length && !tiposAlterados?.length) return null;

  return (
    <Alert className="border-red-500/50 bg-red-500/10">
      <AlertTriangle className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-500">Breaking Changes Detectados</AlertTitle>
      <AlertDescription className="text-sm space-y-1">
        {camposRemovidos?.length > 0 && (
          <div>• {camposRemovidos.length} campos removidos</div>
        )}
        {tiposAlterados?.length > 0 && (
          <div>• {tiposAlterados.length} tipos alterados</div>
        )}
      </AlertDescription>
    </Alert>
  );
}