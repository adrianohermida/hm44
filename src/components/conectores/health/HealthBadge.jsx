import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

const CONFIG = {
  'Saudável': { icon: CheckCircle2, className: 'bg-green-500/20 text-green-400' },
  'Degradado': { icon: AlertTriangle, className: 'bg-amber-500/20 text-amber-400' },
  'Indisponível': { icon: XCircle, className: 'bg-red-500/20 text-red-400' },
  'Desconhecido': { icon: HelpCircle, className: 'bg-slate-500/20 text-slate-400' }
};

export default function HealthBadge({ status = 'Desconhecido' }) {
  const config = CONFIG[status] || CONFIG['Desconhecido'];
  const Icon = config.icon;

  return (
    <Badge className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </Badge>
  );
}