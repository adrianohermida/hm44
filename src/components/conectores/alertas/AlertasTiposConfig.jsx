import React from 'react';
import { Switch } from '@/components/ui/switch';

export default function AlertasTiposConfig({ form, onChange }) {
  return (
    <div className="space-y-3 border-t border-[var(--border-primary)] pt-4">
      <h3 className="font-semibold text-[var(--text-primary)]">
        Tipos de Alertas
      </h3>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">
          Breaking Changes
        </span>
        <Switch 
          checked={form.alertar_breaking_changes} 
          onCheckedChange={v => onChange({...form, alertar_breaking_changes: v})} 
        />
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--text-secondary)]">
          Erros Críticos (5xx)
        </span>
        <Switch 
          checked={form.alertar_erros_criticos} 
          onCheckedChange={v => onChange({...form, alertar_erros_criticos: v})} 
        />
      </div>
    </div>
  );
}