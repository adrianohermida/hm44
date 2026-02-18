import React from 'react';
import { Phone, Mail, Users, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function AtendimentoItem({ atendimento, onEdit, onDelete }) {
  const tipoIcons = {
    ligacao: Phone,
    email: Mail,
    reuniao: Users,
    mensagem: MessageSquare
  };

  const Icon = tipoIcons[atendimento.tipo_atendimento] || MessageSquare;

  return (
    <div className="flex items-start gap-3 p-3 bg-[var(--bg-secondary)] rounded-lg">
      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[var(--brand-primary)]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] capitalize">{atendimento.tipo_atendimento}</p>
        <p className="text-xs text-[var(--text-secondary)] truncate">{atendimento.observacoes}</p>
        <p className="text-xs text-[var(--text-tertiary)] mt-1">
          {format(new Date(atendimento.data || atendimento.created_date), 'dd/MM/yyyy HH:mm')}
        </p>
      </div>
      <div className="flex gap-1">
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onEdit(atendimento)}>
          <Edit className="w-3 h-3" />
        </Button>
        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onDelete(atendimento.id)}>
          <Trash2 className="w-3 h-3 text-red-600" />
        </Button>
      </div>
    </div>
  );
}