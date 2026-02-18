import React from 'react';
import { ExternalLink, TrendingUp } from 'lucide-react';

export default function MediaCarousel() {
  const media = [
    {
      outlet: "Estadão",
      logo: "https://www.estadao.com.br/static-assets/themes/estadao/images/logo-estadao.svg",
      quote: "Especialista aponta que Lei do Superendividamento pode beneficiar milhões de brasileiros",
      reach: "15M+ leitores",
      url: "https://google.com/search?q=adriano+hermida+maia+estadao"
    },
    {
      outlet: "Gaúcha ZH",
      logo: "https://gauchazh.clicrbs.com.br/static/logo-gauchazh-dark.svg",
      quote: "Advogado gaúcho pioneiro na defesa de consumidores superendividados",
      reach: "8M+ leitores",
      url: "https://gauchazh.clicrbs.com.br/autores/adriano-hermida-maia/"
    },
    {
      outlet: "Conjur",
      logo: "https://www.conjur.com.br/static/img/logo-conjur.svg",
      quote: "Dr. Adriano publica artigos sobre direitos do consumidor e superendividamento",
      reach: "5M+ leitores",
      url: "https://www.conjur.com.br/autor/adriano-hermida-maia"
    }
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {media.map((item, i) => (
        <a
          key={i}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[var(--bg-elevated)] border border-[var(--border-primary)] rounded-xl p-6 hover:border-[var(--brand-primary)] transition-all hover:shadow-lg group"
        >
          <div className="flex items-center justify-between mb-4">
            <img src={item.logo} alt={item.outlet} className="h-8 object-contain" />
            <ExternalLink className="w-4 h-4 text-[var(--text-tertiary)] group-hover:text-[var(--brand-primary)] transition-colors" />
          </div>
          <p className="text-sm text-[var(--text-secondary)] italic mb-4 line-clamp-3">"{item.quote}"</p>
          <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
            <TrendingUp className="w-4 h-4 text-[var(--brand-primary)]" />
            <span>{item.reach}</span>
          </div>
        </a>
      ))}
    </div>
  );
}