import React from 'react';
import { Trophy, Calendar, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function VideoCompletionModal({ isOpen, onClose, onSchedule, onSubmitCase }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl mb-4">
            <Trophy className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-2" />
            Parabéns! Jornada Completa 🎉
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-center text-[var(--text-secondary)] mb-6">
          Você completou toda a jornada educacional. Agora é hora de agir!
        </p>

        <div className="space-y-3">
          <Button onClick={onSchedule} className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] py-6 text-lg">
            <Calendar className="w-5 h-5 mr-2" />
            Agendar Consulta Gratuita
          </Button>
          
          <Button onClick={onSubmitCase} variant="outline" className="w-full py-6 text-lg">
            <FileText className="w-5 h-5 mr-2" />
            Enviar Meu Caso
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}