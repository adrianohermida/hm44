import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Clock } from 'lucide-react';
import PublicacaoCheckbox from './PublicacaoCheckbox';

export default function PublicacoesList({ 
  publicacoes, 
  selectedIds, 
  onToggle, 
  isLoading 
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (publicacoes.length === 0) {
    return (
      <div className="text-center p-8 text-[var(--text-secondary)]">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Nenhuma publicação pendente</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2">
        {publicacoes.map(pub => (
          <PublicacaoCheckbox
            key={pub.id}
            publicacao={pub}
            checked={selectedIds.includes(pub.id)}
            onCheckedChange={() => onToggle(pub.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
}