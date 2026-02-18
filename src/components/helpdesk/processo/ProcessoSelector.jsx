import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export default function ProcessoSelector({ clienteId, onSelect, onSkip }) {
  const { data: processos = [], isLoading } = useQuery({
    queryKey: ['processos-cliente', clienteId],
    queryFn: () => base44.entities.Processo.filter({ 
      cliente_vinculado_id: clienteId,
      status: 'ativo'
    }),
    enabled: !!clienteId
  });

  if (!clienteId) return null;

  return (
    <div className="space-y-2">
      <Label>Vincular a processo (opcional)</Label>
      
      {isLoading ? (
        <div className="h-24 bg-gray-100 rounded animate-pulse" />
      ) : processos.length === 0 ? (
        <p className="text-sm text-gray-500 py-2">Cliente sem processos ativos</p>
      ) : (
        <div className="border rounded-lg max-h-48 overflow-y-auto">
          {processos.map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-0 flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-gray-400" />
              <div>
                <div className="font-medium text-sm">{p.numero_cnj}</div>
                <div className="text-xs text-gray-500">{p.titulo}</div>
              </div>
            </button>
          ))}
        </div>
      )}
      
      {onSkip && <Button variant="ghost" onClick={onSkip} className="w-full" type="button">Continuar sem vincular</Button>}
    </div>
  );
}