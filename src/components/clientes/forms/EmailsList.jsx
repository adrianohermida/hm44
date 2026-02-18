import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import EmailItem from './EmailItem';

export default function EmailsList({ emails = [], onChange }) {
  const adicionar = () => {
    onChange([...emails, { tipo: 'pessoal', principal: false }]);
  };

  const remover = (index) => {
    onChange(emails.filter((_, i) => i !== index));
  };

  const atualizar = (index, dados) => {
    const novos = [...emails];
    novos[index] = dados;
    onChange(novos);
  };

  const marcarPrincipal = (index) => {
    onChange(emails.map((e, i) => ({
      ...e,
      principal: i === index
    })));
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">E-mails</label>
        <Button type="button" variant="outline" size="sm" onClick={adicionar}>
          <Plus className="w-3 h-3 mr-1" />
          Adicionar
        </Button>
      </div>
      {emails.map((email, i) => (
        <EmailItem
          key={i}
          email={email}
          onChange={(d) => atualizar(i, d)}
          onRemove={() => remover(i)}
          onMarcarPrincipal={() => marcarPrincipal(i)}
        />
      ))}
    </div>
  );
}