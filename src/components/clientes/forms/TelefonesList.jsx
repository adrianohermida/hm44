import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TelefoneItem from './TelefoneItem';

export default function TelefonesList({ telefones = [], onChange }) {
  const adicionar = () => {
    onChange([...telefones, { tipo: 'celular', whatsapp: false, principal: false }]);
  };

  const remover = (index) => {
    onChange(telefones.filter((_, i) => i !== index));
  };

  const atualizar = (index, dados) => {
    const novos = [...telefones];
    novos[index] = dados;
    onChange(novos);
  };

  const marcarPrincipal = (index) => {
    onChange(telefones.map((t, i) => ({
      ...t,
      principal: i === index
    })));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">Telefones</label>
        <Button type="button" variant="outline" size="sm" onClick={adicionar}>
          <Plus className="w-3 h-3 mr-1" />
          Adicionar
        </Button>
      </div>
      {telefones.map((tel, i) => (
        <TelefoneItem
          key={i}
          telefone={tel}
          onChange={(d) => atualizar(i, d)}
          onRemove={() => remover(i)}
          onMarcarPrincipal={() => marcarPrincipal(i)}
        />
      ))}
    </div>
  );
}