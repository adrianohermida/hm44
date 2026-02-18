import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Merge, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function ProvedorBulkActions({ selectedIds, onClear, onMerge, onSearchEndpoints }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async () => {
      for (const id of selectedIds) {
        await base44.entities.ProvedorAPI.delete(id);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provedores'] });
      toast.success(`${selectedIds.length} provedores excluídos`);
      onClear();
    }
  });

  if (selectedIds.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 p-3 bg-[var(--bg-tertiary)] rounded-lg border">
      {selectedIds.length === 2 && (
        <Button variant="outline" size="sm" onClick={() => onMerge(selectedIds)}>
          <Merge className="w-4 h-4 mr-1" />Mesclar 2 provedores
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={() => onSearchEndpoints(selectedIds)}>
        <Search className="w-4 h-4 mr-1" />Buscar endpoints
      </Button>
      <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate()}>
        <Trash2 className="w-4 h-4 mr-1" />Excluir ({selectedIds.length})
      </Button>
    </div>
  );
}