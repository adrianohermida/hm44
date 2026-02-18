import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PerformanceFilters({ filtros, onChange }) {
  return (
    <div className="flex gap-4 flex-wrap">
      <Select value={filtros.periodo} onValueChange={(v) => onChange({ ...filtros, periodo: v })}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Últimos 7 dias</SelectItem>
          <SelectItem value="30d">Últimos 30 dias</SelectItem>
          <SelectItem value="90d">Últimos 90 dias</SelectItem>
          <SelectItem value="1y">Último ano</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filtros.categoria} onValueChange={(v) => onChange({ ...filtros, categoria: v })}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todas">Todas</SelectItem>
          <SelectItem value="direito_consumidor">Direito do Consumidor</SelectItem>
          <SelectItem value="superendividamento">Superendividamento</SelectItem>
          <SelectItem value="negociacao_dividas">Negociação de Dívidas</SelectItem>
          <SelectItem value="direito_bancario">Direito Bancário</SelectItem>
          <SelectItem value="educacao_financeira">Educação Financeira</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}