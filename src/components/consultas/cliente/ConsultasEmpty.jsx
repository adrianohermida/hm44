import React from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ConsultasEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Calendar className="w-16 h-16 text-[var(--text-tertiary)] mb-4" />
      <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
        Nenhuma consulta agendada
      </h3>
      <p className="text-[var(--text-secondary)] mb-6 max-w-md">
        Você ainda não tem consultas agendadas. Agende sua primeira consulta jurídica agora.
      </p>
      <Link to={createPageUrl('AgendarConsulta')}>
        <Button className="bg-[var(--brand-primary)]">
          Agendar Consulta
        </Button>
      </Link>
    </div>
  );
}