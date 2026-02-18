import React from 'react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { AlertCircle, Archive, Eye, FileText, Users } from 'lucide-react';

export default function EventoProcessoItem({ evento }) {
  const icons = {
    movimentacao_nova: FileText,
    segredo_alterado: Eye,
    arquivado: Archive,
    envolvido_novo: Users,
    cabecalho_alterado: AlertCircle
  };
  
  const Icon = icons[evento.tipo_evento] || FileText;

  return (
    <div className="flex items-start gap-3 p-3 bg-[var(--brand-bg-secondary)] rounded-lg">
      <Icon className="w-4 h-4 mt-1 text-[var(--brand-primary)]" />
      <div className="flex-1">
        <Badge variant="outline" className="text-xs mb-1">{evento.tipo_evento}</Badge>
        <p className="text-xs text-[var(--brand-text-secondary)]">
          {format(new Date(evento.data_evento), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
        </p>
      </div>
    </div>
  );
}