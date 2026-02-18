import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function CriarMonitoramentoModal({ open, onClose, tipo }) {
  const [termo, setTermo] = useState('');

  const criar = async () => {
    try {
      if (tipo === 'PROCESSO') {
        await base44.functions.invoke('criarMonitoramentoProcesso', { numero_cnj: termo });
      } else {
        await base44.functions.invoke('criarMonitoramentoNovosProcessos', { termo, tipo: 'TERMO' });
      }
      toast.success('Monitoramento criado');
      onClose();
    } catch {
      toast.error('Erro ao criar');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo Monitoramento</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input 
            placeholder={tipo === 'PROCESSO' ? 'Número CNJ' : 'Termo para monitorar'}
            value={termo}
            onChange={(e) => setTermo(e.target.value)}
          />
          <Button onClick={criar} className="w-full">Criar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}