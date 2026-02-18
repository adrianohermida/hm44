import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, RefreshCw, XCircle } from 'lucide-react';

export default function DuplicateStrategy({ value, onChange }) {
  const strategies = [
    {
      value: 'skip',
      icon: XCircle,
      label: 'Pular duplicados',
      description: 'Não importa processos que já existem (recomendado)',
      color: 'text-blue-600'
    },
    {
      value: 'update',
      icon: RefreshCw,
      label: 'Atualizar existentes',
      description: 'Sobrescreve dados dos processos duplicados',
      color: 'text-amber-600'
    },
    {
      value: 'fail',
      icon: AlertTriangle,
      label: 'Cancelar se duplicado',
      description: 'Interrompe importação ao encontrar duplicata',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="space-y-3">
      <Label>Estratégia para duplicados</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        {strategies.map(({ value: stratValue, icon: Icon, label, description, color }) => (
          <div
            key={stratValue}
            className="flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-[var(--bg-secondary)] transition-colors"
            onClick={() => onChange(stratValue)}
          >
            <RadioGroupItem value={stratValue} id={stratValue} />
            <div className="flex-1">
              <label htmlFor={stratValue} className="flex items-center gap-2 cursor-pointer">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="font-medium">{label}</span>
              </label>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">{description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}