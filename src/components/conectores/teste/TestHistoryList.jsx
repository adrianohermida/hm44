import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function TestHistoryList({ tests, onSelect }) {
  if (!tests || tests.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-[var(--text-tertiary)]">Nenhum teste no histórico</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tests.map(test => (
        <div
          key={test.id}
          onClick={() => onSelect(test)}
          className="p-3 border rounded-lg cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {test.sucesso ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-medium">
                {new Date(test.created_date).toLocaleString()}
              </span>
            </div>
            <Badge variant={test.sucesso ? 'default' : 'destructive'}>
              {test.http_status}
            </Badge>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {test.tempo_ms}ms
          </p>
        </div>
      ))}
    </div>
  );
}