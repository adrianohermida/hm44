import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';

export default function RelatorioToggleSwitch({ isActive, onToggle, isPending }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <Label>Envio automático</Label>
        <p className="text-sm text-[var(--text-tertiary)]">
          Enviar relatório todo dia 1 às 9h para todos os admins
        </p>
      </div>
      <Switch checked={isActive} onCheckedChange={onToggle} disabled={isPending} />
    </div>
  );
}