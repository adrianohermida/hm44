import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';

export default function CPFInput({ value, onChange, onConsultar, loading }) {
  const formatarCPF = (valor) => {
    const numeros = valor.replace(/\D/g, '');
    return numeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const handleChange = (e) => {
    const formatted = formatarCPF(e.target.value);
    onChange(formatted);
  };

  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={handleChange}
        placeholder="000.000.000-00"
        maxLength={14}
        className="flex-1"
      />
      <Button
        type="button"
        onClick={onConsultar}
        disabled={loading || value.replace(/\D/g, '').length !== 11}
        size="icon"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
      </Button>
    </div>
  );
}