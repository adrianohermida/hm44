import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, X, RotateCw } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DockerBulkActions({ selectedIds, onClear }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      await Promise.all(
        ids.map(id => base44.entities.DockerAnalise.delete(id))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['docker-analises']);
      toast.success(`${selectedIds.length} análises excluídas`);
      onClear();
    },
    onError: () => toast.error('Erro ao excluir análises')
  });

  if (selectedIds.length === 0) return null;

  return (
    <div className="flex items-center gap-3 bg-[var(--brand-primary-50)] border border-[var(--brand-primary)] rounded-lg p-3">
      <span className="text-sm font-medium">{selectedIds.length} selecionadas</span>
      <Button 
        size="sm" 
        variant="destructive"
        onClick={() => {
          if (confirm(`Excluir ${selectedIds.length} análises?`)) {
            deleteMutation.mutate(selectedIds);
          }
        }}
        disabled={deleteMutation.isPending}
      >
        <Trash2 className="w-4 h-4 mr-1" />
        Excluir Todas
      </Button>
      <Button size="sm" variant="outline" onClick={onClear}>
        <X className="w-4 h-4 mr-1" />
        Limpar
      </Button>
    </div>
  );
}