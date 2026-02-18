import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function CancelarModal({ agendamento, open, onClose, onConfirm, loading }) {
  const [motivo, setMotivo] = useState('');

  const handleConfirm = () => {
    onConfirm(agendamento, motivo);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="cancelar-description">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--brand-error)]">
            <AlertTriangle className="w-5 h-5" aria-hidden="true" />
            Cancelar Consulta
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4" id="cancelar-description">
          <p className="text-sm text-[var(--text-secondary)]">
            Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita.
          </p>
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] mb-2 block">
              Motivo do cancelamento (opcional)
            </label>
            <Textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o motivo..."
              className="min-h-[80px]"
              aria-label="Motivo do cancelamento"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Voltar</Button>
          <Button 
            onClick={handleConfirm} 
            disabled={loading}
            className="bg-[var(--brand-error)] hover:bg-red-700"
          >
            {loading ? 'Cancelando...' : 'Confirmar Cancelamento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}