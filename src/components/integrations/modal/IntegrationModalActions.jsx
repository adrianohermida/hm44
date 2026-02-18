import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Info } from 'lucide-react';

export default function IntegrationModalActions({ 
  isConnected, 
  loading, 
  error, 
  onConnect, 
  onClose 
}) {
  return (
    <div className="space-y-4 py-2">
      {!isConnected && (
        <Alert className="border-[var(--brand-primary-200)] bg-[var(--brand-primary-50)]">
          <Info className="h-4 w-4 text-[var(--brand-primary-700)]" />
          <AlertDescription className="text-[var(--brand-primary-700)] text-sm">
            Você será redirecionado para autorizar o acesso.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isConnected && (
        <div className="flex gap-3">
          <Button onClick={onConnect} disabled={loading} className="flex-1 bg-[var(--brand-primary)]">
            {loading ? 'Conectando...' : 'Conectar'}
          </Button>
          <Button onClick={onClose} variant="outline" disabled={loading} className="flex-1">
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}