import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { ExternalLink, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import ProcessoClienteItemActions from './ProcessoClienteItemActions';

export default function ProcessoClienteItem({ 
  cliente, 
  processoId, 
  onRemove, 
  onLigar, 
  onEmail, 
  onMensagem, 
  onAgendar 
}) {
  const navigate = useNavigate();

  const getPoloBadge = (polo) => {
    if (polo === 'polo_ativo') return { label: 'Ativo', variant: 'default' };
    if (polo === 'polo_passivo') return { label: 'Passivo', variant: 'secondary' };
    return { label: 'Terceiro', variant: 'outline' };
  };

  const badge = getPoloBadge(cliente.parte_polo);

  return (
    <div className="border border-[var(--border-primary)] rounded-lg p-3 bg-[var(--bg-primary)]">
      <div className="flex items-start gap-3">
        <CustomAvatar
          src={cliente.foto_url}
          alt={cliente.nome_completo}
          fallback={cliente.nome_completo?.charAt(0)}
          className="h-10 w-10"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm truncate">{cliente.nome_completo}</p>
            <Badge variant={badge.variant} className="text-xs">{badge.label}</Badge>
          </div>
          {cliente.parte_qualificacao && (
            <p className="text-xs text-[var(--text-tertiary)]">{cliente.parte_qualificacao}</p>
          )}
          {cliente.email && (
            <p className="text-xs text-[var(--text-secondary)] truncate">{cliente.email}</p>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}&fromProcesso=${processoId}`)}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            onClick={() => onRemove(cliente.parte_id)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <ProcessoClienteItemActions
        cliente={cliente}
        onLigar={onLigar}
        onEmail={onEmail}
        onMensagem={onMensagem}
        onAgendar={onAgendar}
      />
    </div>
  );
}