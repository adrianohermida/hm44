import React, { useState } from 'react';
import { Calendar, Clock, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export default function RemarcarModal({ agendamento, open, onClose, onSave, loading }) {
  const [novaData, setNovaData] = useState('');
  const [novaHora, setNovaHora] = useState('');

  const handleSave = () => {
    if (!novaData || !novaHora) return;
    onSave(agendamento, novaData, novaHora);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent aria-describedby="remarcar-description">
        <DialogHeader>
          <DialogTitle>Remarcar Consulta</DialogTitle>
        </DialogHeader>
        <div className="space-y-4" id="remarcar-description">
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Nova Data
            </label>
            <Input 
              type="date" 
              value={novaData} 
              onChange={(e) => setNovaData(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              aria-label="Nova data"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4" aria-hidden="true" />
              Novo Horário
            </label>
            <Input 
              type="time" 
              value={novaHora} 
              onChange={(e) => setNovaHora(e.target.value)}
              aria-label="Novo horário"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={loading || !novaData || !novaHora}>
            <Save className="w-4 h-4 mr-2" aria-hidden="true" />
            {loading ? 'Salvando...' : 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}