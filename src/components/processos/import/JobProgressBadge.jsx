import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function JobProgressBadge({ status }) {
  const config = {
    processando: { icon: Loader2, className: 'animate-spin' },
    concluido: { icon: CheckCircle, className: '' },
    falhou: { icon: XCircle, className: '' }
  };

  const { icon: Icon, className } = config[status] || config.processando;

  return (
    <Badge variant="outline" className={cn(
      status === 'concluido' && 'bg-green-100 text-green-700 border-green-300',
      status === 'falhou' && 'bg-red-100 text-red-700 border-red-300'
    )}>
      <Icon className={cn("w-3 h-3 mr-1", className)} />
      {status}
    </Badge>
  );
}