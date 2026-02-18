import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Info } from 'lucide-react';

export default function BatchSizeSelector({ value, onChange, totalRecords }) {
  const batchSizes = [
    { value: 50, label: '50 - Conservador', recommended: totalRecords <= 100 },
    { value: 100, label: '100 - Balanceado ⚡', recommended: totalRecords <= 500 },
    { value: 200, label: '200 - Performance', recommended: totalRecords > 500 },
    { value: 500, label: '500 - Máximo', recommended: totalRecords > 1000 }
  ];

  const recommended = batchSizes.find(b => b.recommended);

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        Tamanho do lote
        <div className="group relative">
          <Info className="w-4 h-4 text-[var(--text-tertiary)] cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            Quantidade de processos processados por vez. Lotes maiores = mais rápido, mas mais memória.
          </div>
        </div>
      </Label>
      <Select value={value.toString()} onValueChange={(v) => onChange(parseInt(v))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {batchSizes.map(({ value: size, label, recommended: isRec }) => (
            <SelectItem key={size} value={size.toString()}>
              {label} {isRec && <span className="text-green-600">✓ Recomendado</span>}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {recommended && (
        <p className="text-xs text-[var(--text-tertiary)]">
          Recomendado: {recommended.label} para {totalRecords} registros
        </p>
      )}
    </div>
  );
}