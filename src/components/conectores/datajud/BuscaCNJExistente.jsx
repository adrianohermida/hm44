import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CNJCopyButton from '@/components/common/CNJCopyButton';

export default function BuscaCNJExistente({ onSelect, escritorioId }) {
  const [busca, setBusca] = useState('');

  const { data: processos = [] } = useQuery({
    queryKey: ['processos-cnj', escritorioId, busca],
    queryFn: () => base44.entities.Processo.filter({
      escritorio_id: escritorioId,
      numero_cnj: { $regex: busca, $options: 'i' }
    }, '-created_date', 20),
    enabled: !!escritorioId && busca.length >= 5
  });

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          placeholder="Buscar CNJ existente..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="font-mono text-xs"
        />
        <Search className="w-5 h-5 text-gray-400 mt-2" />
      </div>

      {processos.length > 0 && (
        <ScrollArea className="h-48 border rounded-lg">
          <div className="p-2 space-y-1">
            {processos.map((proc) => (
              <button
                key={proc.id}
                onClick={() => onSelect(proc.numero_cnj)}
                className="w-full text-left p-2 hover:bg-gray-100 rounded flex items-center justify-between group"
              >
                <div>
                  <p className="font-mono text-xs font-semibold">{proc.numero_cnj}</p>
                  <p className="text-xs text-gray-600 truncate">{proc.titulo}</p>
                </div>
                <CNJCopyButton cnj={proc.numero_cnj} />
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}