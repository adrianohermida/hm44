import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

const LIBRARY = {
  cpf: ['12345678900', '98765432100', '11122233344'],
  cnpj: ['12345678000195', '98765432000196'],
  oab: ['SP123456', 'RJ654321', 'MG999888'],
  cnj: ['0000001-02.2023.8.26.0001', '0000002-03.2023.8.19.0001'],
  email: ['teste@exemplo.com', 'contato@teste.com'],
  telefone: ['11987654321', '21912345678']
};

export default function TestDataLibrary({ onSelect }) {
  const copy = (value) => {
    navigator.clipboard.writeText(value);
    toast.success('Copiado');
    onSelect?.(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Biblioteca de Dados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Object.entries(LIBRARY).map(([tipo, valores]) => (
          <div key={tipo}>
            <p className="text-xs font-medium text-[var(--text-secondary)] mb-1 uppercase">{tipo}</p>
            <div className="flex flex-wrap gap-1">
              {valores.map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  size="sm"
                  onClick={() => copy(val)}
                  className="h-7 text-xs"
                >
                  {val}
                  <Copy className="w-3 h-3 ml-1" />
                </Button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}