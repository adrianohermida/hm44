import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const EVENTS = [
  { value: 'teste_executado', label: 'Teste Executado' },
  { value: 'breaking_change', label: 'Breaking Change' },
  { value: 'erro_critico', label: 'Erro Crítico' },
  { value: 'latencia_alta', label: 'Latência Alta' },
];

export default function WebhookEventSelector({ selected, onChange }) {
  return (
    <div className="space-y-2">
      {EVENTS.map(e => (
        <div key={e.value} className="flex items-center gap-2">
          <Checkbox 
            checked={selected.includes(e.value)}
            onCheckedChange={(v) => {
              if (v) onChange([...selected, e.value]);
              else onChange(selected.filter(s => s !== e.value));
            }}
          />
          <Label className="text-sm">{e.label}</Label>
        </div>
      ))}
    </div>
  );
}