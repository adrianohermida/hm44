import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function JobLogsTimeline({ logs }) {
  if (!logs?.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Timeline de Execução</CardTitle>
      </CardHeader>
      <CardContent className="max-h-64 overflow-y-auto">
        <div className="space-y-3">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 relative">
              {i < logs.length - 1 && (
                <div className="absolute left-2 top-6 bottom-0 w-px bg-[var(--border-primary)]" />
              )}
              <CheckCircle className="w-4 h-4 text-[var(--brand-primary)] flex-shrink-0 mt-1" />
              <div className="flex-1">
                <p className="text-sm font-medium">{log.mensagem}</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {new Date(log.timestamp).toLocaleTimeString()} · {log.progresso}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}