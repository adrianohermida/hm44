import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

export default function CEPInput({ value, onChange, onConsultar, loading }) {
  const formatarCEP = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
  };

  const handleChange = (e) => {
    const formatted = formatarCEP(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="00000-000"
        maxLength={9}
        className="flex-1"
      />
      <Button
        type="button"
        onClick={onConsultar}
        disabled={loading || value.replace(/\D/g, '').length !== 8}
        size="icon"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
      </Button>
    </div>
  );
}