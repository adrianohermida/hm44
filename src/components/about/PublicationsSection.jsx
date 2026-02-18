import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Sparkles } from "lucide-react";

export default function PublicationsSection() {
  return (
    <section className="py-20 px-6 bg-[var(--bg-elevated)]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Publicações e Contribuições
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Produção Intelectual</h2>
          <p className="text-xl text-[var(--text-secondary)]">
            Compartilhando conhecimento e experiência com a comunidade jurídica
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <a 
              href="https://www.amazon.com.br/Manual-Superendividado-estabilidade-financeira-Endividado-ebook/dp/B0CTHR5KLF?utm_source=copilot.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:scale-105 transition-transform"
            >
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/5d67058a6_manual-superendividado.jpg"
                alt="Manual do Superendividado - Dr. Adriano Hermida Maia"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 md:order-2 space-y-6"
          >
            <div className="bg-gradient-to-br from-[var(--brand-primary-50)] to-[var(--brand-primary-100)] rounded-2xl p-8 shadow-lg border border-[var(--brand-primary-200)]">
              <BookOpen className="w-12 h-12 text-[var(--brand-primary)] mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-black mb-3">Manual do Superendividado</h3>
              <p className="text-gray-700 dark:text-black mb-6">
                Obra de referência sobre a Lei do Superendividamento, com orientações práticas para consumidores 
                e profissionais do direito.
              </p>
              <a 
                href="https://www.amazon.com.br/Manual-Superendividado-estabilidade-financeira-Endividado-ebook/dp/B0CTHR5KLF?utm_source=copilot.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-700)] text-white w-full">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Comprar na Amazon
                </Button>
              </a>
            </div>

            <Card className="hover:shadow-xl transition-all bg-[var(--bg-elevated)] border-[var(--border-primary)]">
              <CardContent className="p-6">
                <Users className="w-10 h-10 text-[var(--brand-primary)] mb-3" />
                <h4 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Docência</h4>
                <p className="text-[var(--text-secondary)] text-sm">
                  Ministra palestras e cursos sobre Superendividamento, Direito do Consumidor e Crimes Digitais.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all bg-[var(--bg-elevated)] border-[var(--border-primary)]">
              <CardContent className="p-6">
                <Award className="w-10 h-10 text-[var(--brand-primary)] mb-3" />
                <h4 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Artigos e Publicações</h4>
                <p className="text-[var(--text-secondary)] text-sm">
                  Contribuições regulares em portais jurídicos especializados sobre temas de Direito do Consumidor.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}