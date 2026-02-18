import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';

const categorias = [
  { value: "direito_consumidor", label: "Direito do Consumidor" },
  { value: "superendividamento", label: "Superendividamento" },
  { value: "negociacao_dividas", label: "Negociação de Dívidas" },
  { value: "direito_bancario", label: "Direito Bancário" },
  { value: "educacao_financeira", label: "Educação Financeira" },
  { value: "casos_sucesso", label: "Casos de Sucesso" }
];

export default function BlogGrid({ artigos }) {
  if (!artigos || artigos.length === 0) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {artigos.filter(artigo => artigo && artigo.titulo).map(artigo => (
        <article key={artigo.id} className="group">
          <Link 
            to={artigo.slug ? `${createPageUrl("BlogPost")}?slug=${artigo.slug}` : `${createPageUrl("BlogPost")}?id=${artigo.id}`}
            className="block h-full"
            aria-label={`Ler artigo: ${artigo.titulo}`}
          >
            <div className="bg-[var(--bg-elevated)] rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-[var(--border-primary)] group-hover:border-[var(--brand-primary)]/30">
              <div className="relative aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[var(--navy-800)] dark:to-[var(--navy-700)] flex items-center justify-center overflow-hidden">
                {artigo.imagem_capa ? (
                  <img 
                    src={artigo.imagem_capa} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl" aria-hidden="true">📄</span>
                )}
              </div>
              <div className="p-4 sm:p-6 flex flex-col flex-grow">
                <span className="inline-block px-2 py-1 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] dark:bg-[var(--brand-primary-900)]/30 dark:text-[var(--brand-primary-300)] text-xs font-semibold rounded mb-2 self-start">
                  {categorias.find(c => c.value === artigo.categoria)?.label || artigo.categoria}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                  {artigo.titulo}
                </h3>
                <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-2 flex-grow">
                  {artigo.resumo}
                </p>
                <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] pt-3 border-t border-[var(--border-primary)]">
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <User className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">{artigo.autor}</span>
                  </div>
                  {artigo.data_publicacao && (
                    <time 
                      dateTime={artigo.data_publicacao}
                      className="flex-shrink-0 ml-2"
                    >
                      {format(new Date(artigo.data_publicacao), "dd/MM/yyyy")}
                    </time>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}