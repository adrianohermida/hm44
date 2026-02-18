import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Sparkles } from 'lucide-react';

export default function ClassificacaoIABadge({ classificacao }) {
  if (!classificacao) return null;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          {classificacao.nome}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <p className="text-xs mb-1">{classificacao.descricao}</p>
        <p className="text-xs text-[var(--brand-text-tertiary)]">{classificacao.hierarquia}</p>
      </TooltipContent>
    </Tooltip>
  );
}