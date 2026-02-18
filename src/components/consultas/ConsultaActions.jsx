import React from 'react';
import { CheckCircle, XCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ConsultaActions({ onApprove, onReject, onSchedule, status }) {
  if (status === 'aprovado' || status === 'agendado') {
    return (
      <Button size="sm" variant="outline" onClick={onSchedule} className="w-full">
        <Calendar className="w-3 h-3 mr-1" aria-hidden="true" />
        {status === 'agendado' ? 'Reagendar' : 'Agendar'}
      </Button>
    );
  }

  if (status === 'rejeitado') return null;

  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        variant="default" 
        onClick={onApprove} 
        className="bg-[var(--brand-success)] hover:bg-green-600 flex-1"
      >
        <CheckCircle className="w-3 h-3 mr-1" aria-hidden="true" />
        Aprovar
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onReject} 
        className="text-[var(--brand-error)] hover:bg-red-50 flex-1"
      >
        <XCircle className="w-3 h-3 mr-1" aria-hidden="true" />
        Rejeitar
      </Button>
    </div>
  );
}