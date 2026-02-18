import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Calculator, Brain } from 'lucide-react';

export default function CalculoPrazosActions({ 
  calcularComIA, 
  onCalcularComIAChange,
  vincularTarefas,
  onVincularTarefasChange,
  onCalcular,
  onTreinar,
  calculando,
  treinando,
  selectedCount,
  totalPublicacoes,
  totalAprendizados
}) {
  return (
    <>
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center justify-between">
          <Label>Usar IA para cálculo</Label>
          <Switch checked={calcularComIA} onCheckedChange={onCalcularComIAChange} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Vincular tarefas automaticamente</Label>
          <Switch checked={vincularTarefas} onCheckedChange={onVincularTarefasChange} />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={onCalcular}
          disabled={calculando || totalPublicacoes === 0}
          className="flex-1"
        >
          {calculando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Calculando...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              Calcular {selectedCount > 0 ? `(${selectedCount})` : 'Todas'}
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={onTreinar}
          disabled={treinando || totalAprendizados === 0}
        >
          {treinando ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Brain className="w-4 h-4 mr-2" />
              Treinar IA
            </>
          )}
        </Button>
      </div>
    </>
  );
}