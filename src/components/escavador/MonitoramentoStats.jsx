import React from 'react';
import { Eye, Bell, TrendingUp } from 'lucide-react';

export default function MonitoramentoStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="p-3 bg-[var(--brand-bg-secondary)] rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Eye className="w-4 h-4 text-[var(--brand-primary)]" />
          <span className="text-xs text-[var(--brand-text-secondary)]">Monitorados</span>
        </div>
        <p className="text-2xl font-bold text-[var(--brand-text-primary)]">{stats.total || 0}</p>
      </div>
      <div className="p-3 bg-[var(--brand-bg-secondary)] rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4 text-[var(--brand-warning)]" />
          <span className="text-xs text-[var(--brand-text-secondary)]">Não Lidas</span>
        </div>
        <p className="text-2xl font-bold text-[var(--brand-text-primary)]">{stats.naoLidas || 0}</p>
      </div>
      <div className="p-3 bg-[var(--brand-bg-secondary)] rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-[var(--brand-success)]" />
          <span className="text-xs text-[var(--brand-text-secondary)]">Este Mês</span>
        </div>
        <p className="text-2xl font-bold text-[var(--brand-text-primary)]">{stats.esteMes || 0}</p>
      </div>
    </div>
  );
}