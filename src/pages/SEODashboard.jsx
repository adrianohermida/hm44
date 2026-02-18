import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SEOKeywordTable from '@/components/seo/SEOKeywordTable';
import SEOMetrics from '@/components/seo/SEOMetrics';
import { Search, TrendingUp } from 'lucide-react';

export default function SEODashboard() {
  const { data: keywords = [] } = useQuery({
    queryKey: ['seo-keywords'],
    queryFn: () => base44.entities.SEOKeyword.filter({ status: 'ativa' }, '-volume_mensal'),
  });

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-[var(--brand-primary)] rounded-xl flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Dashboard SEO</h1>
              <p className="text-[var(--text-secondary)]">Análise de palavras-chave e performance</p>
            </div>
          </div>
        </div>

        <SEOMetrics keywords={keywords} />
        <SEOKeywordTable keywords={keywords} />
      </div>
    </div>
  );
}