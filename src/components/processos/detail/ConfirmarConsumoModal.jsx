import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ConfirmarConsumoModal({ 
  open, 
  onOpenChange, 
  onConfirm, 
  loading,
  titulo = "Confirmar Consulta ao Tribunal",
  descricao = "Esta ação irá consumir créditos da API do provedor.",
  creditos = 1
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            {titulo}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <CreditCard className="w-4 h-4" />
            <AlertDescription>
              {descricao}
            </AlertDescription>
          </Alert>

          <div className="bg-[var(--bg-secondary)] rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[var(--text-secondary)]">Créditos estimados:</span>
              <span className="text-lg font-bold text-[var(--brand-primary)]">{creditos}</span>
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              Os créditos serão debitados da sua conta do provedor
            </p>
          </div>

          <p className="text-sm text-[var(--text-secondary)]">
            Deseja prosseguir com a consulta?
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={async () => {
              console.log('[ConfirmarConsumoModal] Confirmação clicada');
              await onConfirm();
              onOpenChange(false);
            }}
            disabled={loading}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            {loading ? 'Processando...' : 'Confirmar Consulta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}