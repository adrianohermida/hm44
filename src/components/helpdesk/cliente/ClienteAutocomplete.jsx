import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useClienteSearch } from './hooks/useClienteSearch';

export default function ClienteAutocomplete({ value, onChange, onCreate }) {
  const [busca, setBusca] = useState('');
  const { data: clientes = [] } = useClienteSearch(busca);

  return (
    <div className="space-y-2">
      <Input
        placeholder="Nome ou email do cliente..."
        value={value?.nome || busca}
        onChange={(e) => setBusca(e.target.value)}
      />
      
      {busca.length > 2 && (
        <div className="border rounded-lg max-h-48 overflow-y-auto bg-white">
          {clientes.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => onChange(c)}
              className="w-full text-left p-3 hover:bg-gray-50 border-b last:border-0"
            >
              <div className="font-medium text-sm">{c.nome_completo || c.razao_social}</div>
              <div className="text-xs text-gray-500">{c.email_principal}</div>
            </button>
          ))}
          
          {onCreate && (
            <Button variant="ghost" onClick={onCreate} className="w-full justify-start" type="button">
              <Plus className="w-4 h-4 mr-2" />
              Criar novo cliente
            </Button>
          )}
        </div>
      )}
    </div>
  );
}