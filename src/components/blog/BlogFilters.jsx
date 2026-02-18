import React from 'react';
import ContentCategoryTabs from '@/components/conteudo/ContentCategoryTabs';

const categorias = [
  { value: "todos", label: "Todos" },
  { value: "direito_consumidor", label: "Direito do Consumidor" },
  { value: "superendividamento", label: "Superendividamento" },
  { value: "negociacao_dividas", label: "Negociação de Dívidas" },
  { value: "direito_bancario", label: "Direito Bancário" },
  { value: "educacao_financeira", label: "Educação Financeira" },
  { value: "casos_sucesso", label: "Casos de Sucesso" }
];

export default function BlogFilters({ categoriaFiltro, setCategoriaFiltro }) {
  return (
    <section 
      className="sticky top-0 z-40 py-4 sm:py-5 md:py-6 border-b border-[var(--border-primary)] bg-[var(--bg-primary)]/95 backdrop-blur-lg"
      aria-label="Filtros de categoria"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <ContentCategoryTabs
          categories={categorias}
          active={categoriaFiltro}
          onChange={setCategoriaFiltro}
        />
      </div>
    </section>
  );
}