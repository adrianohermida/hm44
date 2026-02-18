import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

const VALIDATORS = {
  cpf: (v) => /^\d{11}$/.test(v?.replace(/\D/g, '')),
  cnpj: (v) => /^\d{14}$/.test(v?.replace(/\D/g, '')),
  cnj: (v) => /^\d{20}$/.test(v?.replace(/\D/g, '')),
  oab: (v) => /^[A-Z]{2}\d{3,6}$/.test(v?.toUpperCase()),
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  telefone: (v) => /^\d{10,11}$/.test(v?.replace(/\D/g, '')),
};

export default function ParametroInput({ param, value, onChange, error }) {
  const normalize = (val) => {
    if (['cpf', 'cnpj', 'cnj', 'telefone'].includes(param.tipo)) {
      return val?.replace(/\D/g, '');
    }
    return val;
  };

  const validate = (val) => {
    if (!val && param.obrigatorio) return 'Campo obrigatório';
    if (val && VALIDATORS[param.tipo] && !VALIDATORS[param.tipo](val)) {
      return `${param.tipo.toUpperCase()} inválido`;
    }
    return null;
  };

  const handleChange = (e) => {
    const normalized = normalize(e.target.value);
    onChange(normalized);
  };

  return (
    <div>
      <Label className="text-sm flex items-center gap-2">
        {param.nome}
        {param.obrigatorio && <Badge variant="outline" className="text-xs">obrigatório</Badge>}
      </Label>
      <Input
        value={value || ''}
        onChange={handleChange}
        placeholder={param.exemplo || param.descricao}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error}
        </p>
      )}
    </div>
  );
}