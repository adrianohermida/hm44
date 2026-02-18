import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, Eye } from 'lucide-react';
import AparicaoDetalhes from './AparicaoDetalhes';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AparicaoModal({ aparicao, open, onClose, onUpdate }) {
  const marcar = async (acao) => {
    try {
      await base44.functions.invoke('marcarAparicao', { aparicao_id: aparicao.id, acao });
      toast.success('Aparição atualizada');
      onUpdate();
      onClose();
    } catch (error) {
      toast.error('Erro ao atualizar');
    }
  };

  if (!aparicao) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Aparição</DialogTitle>
        </DialogHeader>
        <AparicaoDetalhes aparicao={aparicao} />
        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => marcar('visualizar')}>
            <Eye className="w-4 h-4 mr-2" />
            Marcar como lida
          </Button>
          <Button variant="outline" onClick={() => marcar('importante')}>
            <Star className="w-4 h-4 mr-2" />
            Marcar importante
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}