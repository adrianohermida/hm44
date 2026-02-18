import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, TrendingDown, TrendingUp } from 'lucide-react';

export default function ViolationHistory({ history = [] }) {
  if (history.length === 0) {
    return (
      <p className="text-xs text-[var(--text-tertiary)] italic">
        Nenhum histórico de verificações
      </p>
    );
  }

  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <div className="mt-3">
      <h5 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        Histórico de Verificações ({history.length})
      </h5>
      <ScrollArea className="max-h-48">
        <div className="space-y-2">
          {sortedHistory.map((entry, i) => {
            const prevEntry = sortedHistory[i + 1];
            const trend = prevEntry ? entry.lines - prevEntry.lines : 0;
            
            return (
              <div 
                key={i}
                className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-primary)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <Badge className={
                    entry.status === 'resolved' ? 'bg-green-600' :
                    entry.status === 'reintroduced' ? 'bg-red-600' :
                    'bg-orange-600'
                  }>
                    {entry.status === 'resolved' ? '✅ Resolvido' :
                     entry.status === 'reintroduced' ? '🔄 Reintroduzido' :
                     '⏳ Pendente'}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-mono font-bold">
                      {entry.lines}L
                    </span>
                    {trend !== 0 && (
                      <span className={`text-xs flex items-center gap-0.5 ${
                        trend > 0 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {trend > 0 ? (
                          <><TrendingUp className="w-3 h-3" />+{trend}</>
                        ) : (
                          <><TrendingDown className="w-3 h-3" />{trend}</>
                        )}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {new Date(entry.timestamp).toLocaleString('pt-BR')}
                </p>
                {entry.note && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {entry.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}