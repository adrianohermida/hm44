import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ErrorBoundary from '@/components/common/ErrorBoundary';

function MergeProvedorModalContent({ provedores, onClose }) {
  const [target, setTarget] = useState('');
  const queryClient = useQueryClient();

  const mergeMutation = useMutation({
    mutationFn: async () => {
      const source = provedores.find(p => p.id !== target);
      const endpoints = await base44.entities.EndpointAPI.filter({ provedor_id: source.id });
      for (const ep of endpoints) {
        await base44.entities.EndpointAPI.update(ep.id, { provedor_id: target });
      }
      await base44.entities.ProvedorAPI.delete(source.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['provedores'] });
      queryClient.invalidateQueries({ queryKey: ['endpoints'] });
      toast.success('Provedores mesclados');
      onClose();
    }
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mesclar Provedores</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)]">
            Escolha o provedor de destino. O outro será excluído e seus endpoints migrados.
          </p>
          <Select value={target} onValueChange={setTarget}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o destino" />
            </SelectTrigger>
            <SelectContent>
              {provedores.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => mergeMutation.mutate()} disabled={!target}>Mesclar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MergeProvedorModal(props) {
  return (
    <ErrorBoundary>
      <MergeProvedorModalContent {...props} />
    </ErrorBoundary>
  );
}