import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function RelatorioSalvarFiltroModal({ open, onClose, filtros, escritorioId, userEmail }) {
  const [nome, setNome] = useState('');
  const queryClient = useQueryClient();

  const salvarMutation = useMutation({
    mutationFn: () => base44.entities.FiltroSalvo.create({
      user_email: userEmail,
      nome,
      filtros,
      tipo: 'relatorio'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['filtros-salvos-relatorio']);
      toast.success('Filtro salvo');
      setNome('');
      onClose();
    }
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Salvar Filtros</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Nome do filtro"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => salvarMutation.mutate()} disabled={!nome || salvarMutation.isPending}>
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}