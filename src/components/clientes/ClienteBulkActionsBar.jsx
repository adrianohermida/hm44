import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Merge, Trash2, Sparkles, Archive, X } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import MesclarClientesModal from './MesclarClientesModal';

export default function ClienteBulkActionsBar({ selectedIds, clientes, onClearSelection }) {
  const queryClient = useQueryClient();
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const clientesSelecionados = clientes.filter(c => selectedIds.includes(c.id));

  const mesclarMutation = useMutation({
    mutationFn: async (clientePrincipalId) => {
      try {
        const response = await base44.functions.invoke('mesclarClientes', {
          cliente_ids: selectedIds,
          cliente_principal_id: clientePrincipalId
        });
        return response.data;
      } catch (error) {
        console.error('Erro na mutation:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clientes']);
      toast.success(`${data?.clientes_mesclados || selectedIds.length} clientes mesclados`);
      setShowMergeModal(false);
      onClearSelection();
    },
    onError: (err) => {
      console.error('Erro ao mesclar:', err);
      toast.error(err?.response?.data?.error || err.message || 'Erro ao mesclar clientes');
    }
  });

  const enriquecerMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await base44.functions.invoke('enriquecerClientes', {
          cliente_ids: selectedIds
        });
        return response.data;
      } catch (error) {
        console.error('Erro na mutation:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clientes']);
      toast.success(`${data?.enriquecidos || 0} clientes enriquecidos`);
      onClearSelection();
    },
    onError: (err) => {
      console.error('Erro ao enriquecer:', err);
      toast.error(err?.response?.data?.error || err.message || 'Erro ao enriquecer');
    }
  });

  const arquivarMutation = useMutation({
    mutationFn: async () => {
      try {
        const response = await base44.functions.invoke('arquivarClientes', {
          cliente_ids: selectedIds
        });
        return response.data;
      } catch (error) {
        console.error('Erro na mutation:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clientes']);
      toast.success(`${data?.arquivados || selectedIds.length} clientes arquivados`);
      onClearSelection();
      setShowArchiveDialog(false);
    },
    onError: (err) => {
      console.error('Erro ao arquivar:', err);
      toast.error(err?.response?.data?.error || err.message || 'Erro ao arquivar');
      setShowArchiveDialog(false);
    }
  });

  const excluirMutation = useMutation({
    mutationFn: async () => {
      const erros = [];
      for (const id of selectedIds) {
        try {
          await base44.entities.Cliente.delete(id);
        } catch (error) {
          erros.push(id);
        }
      }
      if (erros.length > 0) {
        throw new Error(`${erros.length} cliente(s) não puderam ser excluídos`);
      }
      return { excluidos: selectedIds.length };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['clientes']);
      toast.success(`${data.excluidos} clientes excluídos`);
      onClearSelection();
      setShowDeleteDialog(false);
    },
    onError: (err) => {
      toast.error(err.message || 'Erro ao excluir');
      setShowDeleteDialog(false);
    }
  });

  if (selectedIds.length === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-lg shadow-lg p-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{selectedIds.length} selecionados</Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="h-6 w-px bg-[var(--border-primary)]" />

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowMergeModal(true)}
              disabled={selectedIds.length < 2 || mesclarMutation.isPending}
            >
              <Merge className="h-4 w-4 mr-2" />
              Mesclar
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => enriquecerMutation.mutate()}
              disabled={enriquecerMutation.isPending}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Enriquecer
            </Button>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowArchiveDialog(true)}
              disabled={arquivarMutation.isPending}
            >
              <Archive className="h-4 w-4 mr-2" />
              Arquivar
            </Button>

            <Button
              size="sm"
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              disabled={excluirMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </div>

      <MesclarClientesModal
        open={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        clientes={clientesSelecionados}
        onConfirm={(clientePrincipalId) => mesclarMutation.mutate(clientePrincipalId)}
        loading={mesclarMutation.isPending}
      />

      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivar {selectedIds.length} clientes?</AlertDialogTitle>
            <AlertDialogDescription>
              Os clientes arquivados não aparecerão nas listagens principais, mas seus dados serão preservados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => arquivarMutation.mutate()}>
              Arquivar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {selectedIds.length} clientes?</AlertDialogTitle>
            <AlertDialogDescription className="text-red-600">
              ⚠️ ATENÇÃO: Esta ação é IRREVERSÍVEL. Todos os dados serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => excluirMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir Permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}