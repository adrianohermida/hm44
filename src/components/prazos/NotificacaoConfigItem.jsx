import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';

export default function NotificacaoConfigItem({ config, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <Badge>{config.tipo_prazo}</Badge>
          <span className="text-sm text-[var(--text-secondary)]">
            {config.dias_antecedencia} dias antes
          </span>
        </div>
        <div className="flex gap-1 mt-1">
          {config.canais?.map(canal => (
            <Badge key={canal} variant="outline" className="text-xs">
              {canal}
            </Badge>
          ))}
        </div>
      </div>
      <Button size="icon" variant="ghost" onClick={onDelete}>
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );
}