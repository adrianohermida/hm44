import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function PodcastSection() {
  return (
    <section className="py-20 bg-[var(--bg-secondary)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="max-w-sm mx-auto">
              <div className="bg-[var(--bg-elevated)] rounded-3xl p-1 shadow-2xl border-4 border-[var(--brand-primary)]">
                <img 
                  src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/c98e71855_podcast_adriano.jpg"
                  alt="Dr. Adriano Hermida Maia - Podcast Defesa do Superendividado"
                  className="w-full rounded-2xl object-cover"
                />
              </div>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full text-sm font-semibold mb-2">
                  <span className="text-lg">🎙️</span>
                  Conteúdo Exclusivo
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-2">
                  Disponível no Spotify
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <p className="text-[var(--brand-primary)] font-bold text-lg mb-2">🎙️ Conteúdo Exclusivo</p>
              <h2 className="text-4xl font-bold mb-4 text-[var(--text-primary)]">Podcast: Defesa do Superendividado</h2>
            </div>
            
            <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
              O podcast apresentado pelo Dr. Adriano Hermida Maia traz reflexões, orientações jurídicas e histórias reais 
              sobre a aplicação da Lei do Superendividamento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a href="https://open.spotify.com/show/6MxexpcWjzfpufwUmKKhzk" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button size="lg" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] w-full">
                  🎧 Ouça no Spotify
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}