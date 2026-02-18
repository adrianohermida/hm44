import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

export default function BuscaAssincronaForm({ tribunal, onSubmit, loading }) {
  const [tipo, setTipo] = useState('nome');
  const [valor, setValor] = useState('');
  const [estadoOab, setEstadoOab] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ tipo, valor, estadoOab: tipo === 'oab' ? estadoOab : null });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Select value={tipo} onValueChange={setTipo}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="nome">Nome da Parte</SelectItem>
          <SelectItem value="documento">CPF/CNPJ</SelectItem>
          <SelectItem value="oab">OAB</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder={tipo === 'oab' ? 'Número da OAB' : tipo === 'documento' ? 'CPF ou CNPJ' : 'Nome completo'}
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        required
      />
      {tipo === 'oab' && (
        <Input
          placeholder="Estado (ex: SP)"
          value={estadoOab}
          onChange={(e) => setEstadoOab(e.target.value.toUpperCase())}
          maxLength={2}
          required
        />
      )}
      <Button type="submit" className="w-full bg-[var(--brand-primary)]" disabled={loading}>
        <Search className="w-4 h-4 mr-2" />
        Buscar
      </Button>
    </form>
  );
}