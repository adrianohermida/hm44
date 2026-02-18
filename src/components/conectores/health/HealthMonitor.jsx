import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export default function HealthMonitor({ status, latencia, taxaSucesso }) {
  const configs = {
    Saudável: { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/20' },
    Degradado: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/20' },
    Indisponível: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/20' },
  };

  const config = configs[status] || configs.Degradado;
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div>
        <Badge className={config.bg + ' ' + config.color}>{status}</Badge>
        <div className="text-xs text-[var(--text-secondary)] mt-1">
          {latencia}ms • {taxaSucesso}% sucesso
        </div>
      </div>
    </div>
  );
}