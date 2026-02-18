import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

export default function RateLimitWarning({ percentual, limite, periodo }) {
  if (percentual < 80) return null;

  return (
    <Alert className="border-amber-500/50 bg-amber-500/10">
      <AlertTriangle className="h-4 w-4 text-amber-500" />
      <AlertDescription className="text-sm text-amber-500">
        {percentual}% do limite de {limite} requisições/{periodo} atingido
      </AlertDescription>
    </Alert>
  );
}