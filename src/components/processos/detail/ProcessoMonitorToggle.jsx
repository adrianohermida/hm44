import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export default function ProcessoMonitorToggle({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--text-secondary)] hidden sm:inline">
        Monitor:
      </span>
      <Button
        size="sm"
        variant={value ? 'default' : 'outline'}
        onClick={onChange}
        aria-label={value ? 'Desativar monitoramento' : 'Ativar monitoramento'}
        aria-pressed={value}
      >
        {value ? <Eye className="w-4 h-4 sm:mr-2" /> : <EyeOff className="w-4 h-4 sm:mr-2" />}
        <span className="hidden sm:inline">{value ? 'ON' : 'OFF'}</span>
      </Button>
    </div>
  );
}