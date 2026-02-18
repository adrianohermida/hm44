import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import EndpointCard from '../EndpointCard';

export default function EndpointSelector({ endpoints, provedores, selectedId, onSelect }) {
  const [busca, setBusca] = useState('');
  const [provedorFiltro, setProvedorFiltro] = useState('todos');

  const filtered = useMemo(() => {
    return endpoints.filter(e => {
      const matchBusca = e.nome?.toLowerCase().includes(busca.toLowerCase()) || 
                         e.path?.toLowerCase().includes(busca.toLowerCase());
      const matchProvedor = provedorFiltro === 'todos' || e.provedor_id === provedorFiltro;
      return matchBusca && matchProvedor;
    });
  }, [endpoints, busca, provedorFiltro]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Endpoints ({filtered.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <Input
            placeholder="Buscar endpoint..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={provedorFiltro} onValueChange={setProvedorFiltro}>
          <SelectTrigger>
            <SelectValue placeholder="Provedor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Provedores</SelectItem>
            {provedores.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {filtered.map(e => (
            <EndpointCard
              key={e.id}
              endpoint={e}
              selected={e.id === selectedId}
              onClick={() => onSelect(e.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}