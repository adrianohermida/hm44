import React from 'react';
import ContentSearchBar from '@/components/conteudo/ContentSearchBar';
import { BookOpen } from 'lucide-react';

export default function BlogHero({ busca, setBusca }) {
  return (
    <section
      className="relative pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16 bg-gradient-to-br from-[var(--navy-950)] via-[var(--navy-900)] to-[var(--navy-800)] overflow-hidden"
      aria-labelledby="blog-hero-title">

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--brand-primary)] rounded-full blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--brand-primary-400)] rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-[var(--brand-primary)]/10 backdrop-blur-sm mb-4 sm:mb-5 md:mb-6">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[var(--brand-primary)]" aria-hidden="true" />
          </div>
          
          <h1
            id="blog-hero-title" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6 text-white">Blog Jurídico



          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 px-4">
            Conteúdo estratégico sobre direito do consumidor, superendividamento e negociação de dívidas
          </p>
          
          <div className="max-w-xl sm:max-w-2xl mx-auto px-4">
            <ContentSearchBar
              value={busca}
              onChange={setBusca}
              placeholder="Pesquisar artigos..."
              aria-label="Buscar artigos no blog" />

          </div>
        </div>
      </div>
    </section>);

}