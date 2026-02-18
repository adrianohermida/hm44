import React from 'react';
import { Clock, Zap, Database } from 'lucide-react';

export default function TesteMetricsBar({ tempo_ms, tamanho_bytes }) {
  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const getLatencyColor = (ms) => {
    if (ms < 500) return 'text-green-500';
    if (ms < 2000) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-1.5">
        <Clock className={`w-4 h-4 ${getLatencyColor(tempo_ms)}`} />
        <span className="text-[var(--text-secondary)]">{tempo_ms}ms</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Zap className="w-4 h-4 text-blue-500" />
        <span className="text-[var(--text-secondary)]">{getLatencyColor(tempo_ms) === 'text-green-500' ? 'Rápido' : tempo_ms < 2000 ? 'Normal' : 'Lento'}</span>
      </div>
      {tamanho_bytes && (
        <div className="flex items-center gap-1.5">
          <Database className="w-4 h-4 text-purple-500" />
          <span className="text-[var(--text-secondary)]">{formatBytes(tamanho_bytes)}</span>
        </div>
      )}
    </div>
  );
}