import React from 'react';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function RelatorioFiltroCard({ filtro, onSelect }) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.FiltroSalvo.delete(filtro.id),
    onSuccess: () => {
      queryClient.invalidateQueries(['filtros-salvos-relatorio']);
      toast.success('Filtro removido');
    }
  });

  return (
    <div className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 cursor-pointer" onClick={onSelect}>
      {filtro.favorito && <Star className="w-3 h-3 text-yellow-500 fill-current" />}
      <span className="text-sm flex-1">{filtro.nome}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6"
        onClick={(e) => {
          e.stopPropagation();
          deleteMutation.mutate();
        }}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
}