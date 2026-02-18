import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Sparkles, Loader2 } from 'lucide-react';

export default function HelpdeskAISuggestions({ ticketId, onSelect, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ['ai-suggestions', ticketId],
    queryFn: async () => {
      const response = await base44.functions.invoke('sugerirResposta', { ticket_id: ticketId });
      return response.data;
    }
  });

  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--brand-primary)]" />
            Sugestões IA
          </h4>
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="w-3 h-3" />
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--brand-primary)]" />
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {data?.sugestoes?.map((sugestao, idx) => (
              <button
                key={idx}
                onClick={() => onSelect(sugestao)}
                className="w-full text-left p-3 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="flex items-start justify-between mb-1">
                  <span className="text-sm font-medium">{sugestao.titulo}</span>
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {Math.round(sugestao.confianca * 100)}%
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {sugestao.resposta}
                </p>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}