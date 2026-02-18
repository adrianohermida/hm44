import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, X, User } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import ConjugeBuscaModal from './ConjugeBuscaModal';

export default function ConjugeSelector({ value, regimeBens, onChange, onRegimeChange, escritorioId }) {
  const [modalAberto, setModalAberto] = useState(false);
  const [conjuge, setConjuge] = useState(null);

  React.useEffect(() => {
    if (value) {
      base44.entities.Cliente.filter({ id: value }).then(c => setConjuge(c[0]));
    }
  }, [value]);

  const handleSelecionar = (cliente) => {
    setConjuge(cliente);
    onChange(cliente.id);
    setModalAberto(false);
  };

  const regimeMap = {
    comunhao_parcial: 'Comunhão Parcial de Bens',
    comunhao_universal: 'Comunhão Universal de Bens',
    separacao_total: 'Separação Total de Bens',
    participacao_final_aquestos: 'Participação Final nos Aquestos'
  };

  if (conjuge) {
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Cônjuge</Label>
          <div className="flex gap-2 p-2 border rounded">
            <User className="w-4 h-4" />
            <span className="text-sm flex-1">{conjuge.nome_completo}</span>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setConjuge(null); onChange(null); }}>
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Regime de Bens</Label>
          <Select value={regimeBens} onValueChange={onRegimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o regime" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(regimeMap).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        <Label>Cônjuge</Label>
        <Button type="button" variant="outline" className="w-full" onClick={() => setModalAberto(true)}>
          <Search className="w-4 h-4 mr-2" />
          Buscar Cônjuge
        </Button>
      </div>
      <ConjugeBuscaModal 
        open={modalAberto} 
        onClose={() => setModalAberto(false)}
        onSelect={handleSelecionar}
        escritorioId={escritorioId}
      />
    </>
  );
}