import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Star } from 'lucide-react';
import EnderecoItem from './EnderecoItem';

export default function EnderecosList({ enderecos = [], onChange }) {
  const adicionar = () => {
    onChange([...enderecos, { tipo: 'residencial', preferencial_correspondencia: false }]);
  };

  const remover = (index) => {
    onChange(enderecos.filter((_, i) => i !== index));
  };

  const atualizar = (index, dados) => {
    const novos = [...enderecos];
    novos[index] = dados;
    onChange(novos);
  };

  const marcarPreferencial = (index) => {
    onChange(enderecos.map((e, i) => ({
      ...e,
      preferencial_correspondencia: i === index
    })));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Endereços</label>
        <Button type="button" variant="outline" size="sm" onClick={adicionar}>
          <Plus className="w-3 h-3 mr-1" />
          Adicionar
        </Button>
      </div>
      {enderecos.map((end, i) => (
        <EnderecoItem
          key={i}
          endereco={end}
          onChange={(d) => atualizar(i, d)}
          onRemove={() => remover(i)}
          onMarcarPreferencial={() => marcarPreferencial(i)}
        />
      ))}
    </div>
  );
}