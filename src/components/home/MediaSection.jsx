import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const mediaLogosFallback = [
  { 
    name: "Portal do Bitcoin", 
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/31210be4d_portal-do-bitcoin.jpg", 
    link: "#",
    description: "Artigos sobre criptomoedas e blockchain"
  },
  { 
    name: "Edição do Brasil", 
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/cee846a13_edicao-do-brasil1.jpg", 
    link: "#",
    description: "Análises jurídicas e direito do consumidor"
  },
  { 
    name: "Migalhas", 
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/5b2bd7a0b_migalhas.jpg", 
    link: "https://www.migalhas.com.br/autor/adriano-hermida-maia",
    description: "Portal jurídico de referência nacional"
  },
  { 
    name: "LiveCoins", 
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/3c671d8cf_livecoins.jpg", 
    link: "https://livecoins.com.br/author/hermida/",
    description: "Conteúdo especializado em criptoativos"
  }
];

export default function MediaSection() {
  const { data: portais = [] } = useQuery({
    queryKey: ['portais-home'],
    queryFn: () => base44.entities.PortalMidia.filter({ 
      exibir_home: true, 
      ativo: true 
    }, 'ordem_exibicao'),
    staleTime: 5 * 60 * 1000
  });

  const mediaLogos = portais.length > 0 
    ? portais.map(p => ({
        name: p.nome,
        url: p.logo_url,
        link: p.url_perfil || p.url_portal,
        description: p.descricao || ''
      }))
    : mediaLogosFallback;
  return (
    <section className="py-20 bg-[var(--bg-secondary)] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Reconhecimento e Autoridade
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Na Mídia</h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Entrevistas, podcasts e aparições em canais de televisão e portais especializados
          </p>
        </motion.div>

        {/* Desktop: Carrossel com movimento automático */}
        <div className="hidden md:block relative">
          <div className="flex gap-6 animate-scroll">
            {[...mediaLogos, ...mediaLogos].map((media, idx) => (
              <motion.a
                key={`${media.name}-${idx}`}
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (idx % mediaLogos.length) * 0.1 }}
                className="flex-shrink-0 w-96 bg-[var(--bg-elevated)] backdrop-blur-sm rounded-2xl border border-[var(--border-primary)] hover:border-[var(--brand-primary)]/50 transition-all duration-300 hover:scale-105 overflow-hidden group"
              >
                <div className="relative w-full h-56 overflow-hidden">
                  <img 
                    src={media.url} 
                    alt={media.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/95 via-[var(--bg-primary)]/60 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">{media.name}</h3>
                  {media.description && (
                    <p className="text-sm text-[var(--text-tertiary)]">{media.description}</p>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Mobile: Scroll horizontal sem barra visível */}
        <div className="md:hidden">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 -mx-6 px-6">
            {mediaLogos.map((media, idx) => (
              <motion.a
                key={media.name}
                href={media.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-80 bg-[var(--bg-elevated)] backdrop-blur-sm rounded-2xl border border-[var(--border-primary)] snap-center overflow-hidden"
              >
                <div className="relative w-full h-48 overflow-hidden">
                  <img 
                    src={media.url} 
                    alt={media.name} 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/95 via-[var(--bg-primary)]/60 to-transparent" />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">{media.name}</h3>
                  {media.description && (
                    <p className="text-sm text-[var(--text-tertiary)]">{media.description}</p>
                  )}
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 30s linear infinite;
          }
          .animate-scroll:hover {
            animation-play-state: paused;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </section>
  );
}