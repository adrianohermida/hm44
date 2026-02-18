import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export default function TopErrorsList({ erros }) {
  return (
    <div className="space-y-2">
      {erros.map((erro, i) => (
        <div key={i} className="p-2 bg-[var(--bg-secondary)] rounded flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium">{erro.mensagem}</p>
            <Badge variant="outline" className="mt-1">{erro.count}x</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}