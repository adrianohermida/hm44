import { BookOpen, Newspaper, Podcast } from 'lucide-react';

export const MEDIA_STATS = [
  { icon: BookOpen, value: 'Autor', label: 'Manual do Superendividamento', color: 'text-[var(--brand-primary)]' },
  { icon: Newspaper, value: 'Colunista', label: 'JusBrasil & Blog Jurídico', color: 'text-[var(--brand-info)]' },
  { icon: Podcast, value: 'Host', label: 'Podcast Expert em Superendividamento', color: 'text-[var(--brand-success)]' },
];

export const MEDIA_OUTLETS = [
  {
    outlet: "JusBrasil",
    logo: "https://static.jusbrasil.com.br/logo/jusbrasil-logo.svg",
    quote: "Artigos especializados sobre penhora de salário, execução fiscal e direitos do devedor",
    reach: "Portal Jurídico Nacional",
    url: "https://www.jusbrasil.com.br/artigos/busca?q=adriano+hermida+maia"
  },
  {
    outlet: "Blog da Gadelha",
    logo: "https://blogdagadelha.com.br/wp-content/uploads/2024/01/logo.png",
    quote: "Manual para Superendividados - obra pioneira no Brasil para recuperação financeira",
    reach: "Portal de Notícias Jurídicas",
    url: "https://blogdagadelha.com.br/advogado-lanca-manual-para-superendividados/"
  },
  {
    outlet: "Expert em Superendividamento",
    logo: null,
    quote: "Podcast com reflexões, orientações jurídicas e histórias reais sobre a Lei do Superendividamento",
    reach: "Podcast Jurídico Especializado",
    url: "https://expertemsuperendividamento.com.br/"
  }
];