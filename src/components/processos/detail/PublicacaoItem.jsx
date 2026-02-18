import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, AlertTriangle, CheckSquare } from 'lucide-react';
import { format } from 'date-fns';

export default function PublicacaoItem({ publicacao, onCreateTarefa }) {
  const tipoLabels = {
    intimacao: 'Intimação',
    sentenca: 'Sentença',
    despacho: 'Despacho',
    acordao: 'Acórdão',
    outro: 'Outro'
  };

  const urgenciaConfig = {
    alta: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    media: { color: 'bg-yellow-100 text-yellow-800', icon: null },
    baixa: { color: 'bg-blue-100 text-blue-800', icon: null }
  };

  const urgencia = publicacao.ia_analise?.urgencia || 'media';
  const config = urgenciaConfig[urgencia];

  return (
    <div className="p-3 bg-[var(--bg-secondary)] rounded-lg">
      <div className="flex items-start justify-between gap-2 mb-2">
        <Badge variant="outline">{tipoLabels[publicacao.tipo]}</Badge>
        {config.icon && <config.icon className="w-4 h-4 text-red-600" />}
      </div>
      <p className="text-sm text-[var(--text-primary)] mb-2 line-clamp-2">{publicacao.conteudo}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <Calendar className="w-3 h-3" />
          {format(new Date(publicacao.data), 'dd/MM/yyyy')}
          <span>•</span>
          <span>{publicacao.fonte}</span>
        </div>
        {publicacao.prazo_dias && onCreateTarefa && (
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-7 text-xs"
            onClick={() => onCreateTarefa(publicacao)}
          >
            <CheckSquare className="w-3 h-3 mr-1" />Tarefa
          </Button>
        )}
      </div>
    </div>
  );
}