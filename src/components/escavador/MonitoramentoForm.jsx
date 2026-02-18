import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MonitoramentoForm({ onSubmit, loading }) {
  const [tipo, setTipo] = useState('PROCESSO');
  const [termo, setTermo] = useState('');
  const [variacoes, setVariacoes] = useState([]);
  const [novaVariacao, setNovaVariacao] = useState('');

  const handleAddVariacao = () => {
    if (novaVariacao && variacoes.length < 3) {
      setVariacoes([...variacoes, novaVariacao]);
      setNovaVariacao('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ tipo, termo, variacoes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select value={tipo} onValueChange={setTipo}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PROCESSO">Processo</SelectItem>
          <SelectItem value="TERMO">Termo</SelectItem>
          <SelectItem value="OAB">OAB</SelectItem>
          <SelectItem value="DOCUMENTO">Documento</SelectItem>
        </SelectContent>
      </Select>
      <Input
        placeholder={tipo === 'PROCESSO' ? 'Número do processo' : 'Termo a monitorar'}
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        required
      />
      {tipo === 'TERMO' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Adicionar variação (máx 3)"
              value={novaVariacao}
              onChange={(e) => setNovaVariacao(e.target.value)}
              disabled={variacoes.length >= 3}
            />
            <Button type="button" onClick={handleAddVariacao} disabled={!novaVariacao || variacoes.length >= 3}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          {variacoes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {variacoes.map((v, i) => (
                <Badge key={i} variant="secondary" className="flex items-center gap-1">
                  {v}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setVariacoes(variacoes.filter((_, idx) => idx !== i))} />
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
      <Button type="submit" className="w-full bg-[var(--brand-primary)]" disabled={loading}>
        Criar Monitoramento
      </Button>
    </form>
  );
}