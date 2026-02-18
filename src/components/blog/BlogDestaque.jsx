import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BlogDestaque({ artigo }) {
  if (!artigo || !artigo.titulo) return null;

  return (
    <article className="mb-8 sm:mb-10 md:mb-12">
      <Link 
        to={artigo.slug ? `${createPageUrl("BlogPost")}?slug=${artigo.slug}` : `${createPageUrl("BlogPost")}?id=${artigo.id}`}
        className="block group"
        aria-label={`Ler artigo em destaque: ${artigo.titulo}`}
      >
        <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-[var(--border-primary)] group-hover:border-[var(--brand-primary)]/30">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="relative aspect-video md:aspect-auto bg-gradient-to-br from-[var(--brand-primary)]/20 to-[var(--brand-primary-600)]/20 flex items-center justify-center overflow-hidden">
              {artigo.imagem_capa ? (
                <img 
                  src={artigo.imagem_capa} 
                  alt="" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <span className="text-5xl sm:text-6xl" aria-hidden="true">📰</span>
              )}
              <span 
                className="absolute top-4 left-4 inline-block px-3 py-1 bg-[var(--brand-primary)] text-white text-xs font-bold rounded-full shadow-lg"
                aria-label="Artigo em destaque"
              >
                DESTAQUE
              </span>
            </div>
            <div className="p-6 sm:p-8 flex flex-col justify-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--text-primary)] mb-3 sm:mb-4 group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                {artigo.titulo}
              </h2>
              <p className="text-[var(--text-secondary)] mb-4 sm:mb-6 line-clamp-3 text-sm sm:text-base">
                {artigo.resumo}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-[var(--text-tertiary)]">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{artigo.autor}</span>
                </div>
                {artigo.data_publicacao && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <time dateTime={artigo.data_publicacao}>
                      {format(new Date(artigo.data_publicacao), "dd 'de' MMM", { locale: ptBR })}
                    </time>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}