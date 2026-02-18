import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function TestParametersConfig({ parameters, onChange }) {
  const addParameter = () => {
    onChange([...parameters, { nome: '', valor: '', descricao: '' }]);
  };

  const updateParameter = (index, field, value) => {
    const updated = [...parameters];
    updated[index][field] = value;
    onChange(updated);
  };

  const removeParameter = (index) => {
    onChange(parameters.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Parâmetros de Teste</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {parameters.map((param, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Nome</Label>
              <Input
                value={param.nome}
                onChange={(e) => updateParameter(index, 'nome', e.target.value)}
                placeholder="cpf"
                className="h-8"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label className="text-xs">Valor</Label>
              <Input
                value={param.valor}
                onChange={(e) => updateParameter(index, 'valor', e.target.value)}
                placeholder="12345678900"
                className="h-8"
              />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeParameter(index)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addParameter} variant="outline" size="sm" className="w-full">
          Adicionar Parâmetro
        </Button>
      </CardContent>
    </Card>
  );
}