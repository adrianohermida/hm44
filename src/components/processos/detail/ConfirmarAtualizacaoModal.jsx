import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmarAtualizacaoModal({ open, onOpenChange, onConfirm, loading }) {
  const [clicked, setClicked] = React.useState(false);

  const handleConfirm = () => {
    if (clicked || loading) return;
    setClicked(true);
    onConfirm();
    setTimeout(() => setClicked(false), 3000);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Confirmar Atualização do Processo
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Esta ação irá consultar novamente o processo no Escavador e <strong>sobrescrever</strong> todas as informações atuais do processo.
            </p>
            <p className="text-amber-600 font-medium">
              ⚠️ Esta operação consome créditos da API Escavador.
            </p>
            <p>
              Todos os dados existentes (tribunal, classe, assunto, valor da causa, etc.) serão substituídos pelos dados mais recentes da API.
            </p>
            <p className="text-sm text-[var(--text-tertiary)]">
              Deseja continuar?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading || clicked}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading || clicked}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            {loading || clicked ? 'Atualizando...' : 'Sim, Atualizar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}