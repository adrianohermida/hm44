import React from 'react';
import { Calculator, Brain } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function PublicacoesConfigPanel({ 
  calcularPrazos, 
  onCalcularPrazosChange,
  usarIA, 
  onUsarIAChange 
}) {
  return (
    <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <Label className="font-medium">Calcular prazos automaticamente</Label>
        </div>
        <Switch checked={calcularPrazos} onCheckedChange={onCalcularPrazosChange} />
      </div>

      {calcularPrazos && (
        <div className="flex items-center justify-between pl-7">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <Label className="text-sm">Usar IA para cálculo</Label>
          </div>
          <Switch checked={usarIA} onCheckedChange={onUsarIAChange} />
        </div>
      )}
    </div>
  );
}