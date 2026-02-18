import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';

export default function TestDataFields({ value = {}, onChange }) {
  const handleChange = (field, val) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <Card className="p-4 space-y-3">
      <h3 className="font-semibold text-sm">Dados Padrão para Testes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label className="text-xs">CPF</Label>
          <Input
            value={value.cpf || ''}
            onChange={(e) => handleChange('cpf', e.target.value)}
            placeholder="000.000.000-00"
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">CNPJ</Label>
          <Input
            value={value.cnpj || ''}
            onChange={(e) => handleChange('cnpj', e.target.value)}
            placeholder="00.000.000/0000-00"
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">OAB Número</Label>
          <Input
            value={value.oab_numero || ''}
            onChange={(e) => handleChange('oab_numero', e.target.value)}
            placeholder="123456"
            className="text-sm"
          />
        </div>
        <div>
          <Label className="text-xs">OAB UF</Label>
          <Input
            value={value.oab_uf || ''}
            onChange={(e) => handleChange('oab_uf', e.target.value.toUpperCase())}
            placeholder="SP"
            maxLength={2}
            className="text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Nome Completo</Label>
          <Input
            value={value.nome_completo || ''}
            onChange={(e) => handleChange('nome_completo', e.target.value)}
            placeholder="Nome Completo"
            className="text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <Label className="text-xs">Número CNJ</Label>
          <Input
            value={value.numero_cnj || ''}
            onChange={(e) => handleChange('numero_cnj', e.target.value)}
            placeholder="0000000-00.0000.0.00.0000"
            className="text-sm"
          />
        </div>
      </div>
    </Card>
  );
}