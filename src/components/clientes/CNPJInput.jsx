import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

export default function CNPJInput({ value, onChange, onConsultar, loading }) {
  const formatarCNPJ = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  };

  const handleChange = (e) => {
    const formatted = formatarCNPJ(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="00.000.000/0000-00"
        maxLength={18}
        className="flex-1"
      />
      <Button
        type="button"
        onClick={onConsultar}
        disabled={loading || value.replace(/\D/g, '').length !== 14}
        size="icon"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
      </Button>
    </div>
  );
}