import React from "react";
import { motion } from "framer-motion";

const mediaLogos = [
{ name: "LiveCoins", url: "https://hermidamaia.adv.br/hs-fs/hubfs/midia-4.jpeg?width=147&height=44", link: "https://livecoins.com.br/author/hermida/" }];


export default function MediaSection() {
  return (
    <section className="py-20 bg-[var(--bg-elevated)]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">

          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Reconhecimento e Autoridade
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Na Mídia</h2>
          <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
            Entrevistas, podcasts e aparições em canais de televisão e portais especializados
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.a
            href={mediaLogos[0].link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grayscale hover:grayscale-0 transition-all duration-200 opacity-70 hover:opacity-100"
          >
            <img 
              src={mediaLogos[0].url} 
              alt={`Logo ${mediaLogos[0].name}`} 
              className="h-11 w-auto object-contain"
              loading="lazy"
            />
          </motion.a>
        </div>
      </div>
    </section>);

}