import React from 'react';
import { Award } from 'lucide-react';
import MediaStatsGrid from './media/MediaStatsGrid';
import MediaOutletsGrid from './media/MediaOutletsGrid';
import MediaHighlight from '../media/MediaHighlight';

export default function MediaSectionOptimized() {
  return (
    <section className="py-20 bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Award className="w-4 h-4" />
            Autoridade Jurídica Reconhecida
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Produtor de Conteúdo Jurídico
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Educando e informando sobre direitos do consumidor superendividado
          </p>
        </div>

        <MediaStatsGrid />
        <MediaHighlight />
        <MediaOutletsGrid />
      </div>
    </section>
  );
}