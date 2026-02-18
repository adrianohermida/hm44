import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Briefcase, Award } from "lucide-react";

export default function BiographySection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-12"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-6">Trajetória e Especialização</h2>
            <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto">
              Advogado e Docente no Ensino Superior, com formação sólida e dedicação à defesa dos consumidores superendividados
            </p>
            <a 
              href="http://lattes.cnpq.br/0876441700206296" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[var(--brand-primary)] hover:text-[var(--brand-primary-700)] font-semibold mt-4"
            >
              📄 Ver Currículo Lattes Completo
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-xl transition-all bg-[var(--bg-elevated)] border-[var(--border-primary)]">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Formação Acadêmica</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Docente no Ensino Superior, Pós-Graduado em Direito Processo Civil, Direito do Trabalho e Processo do Trabalho, MBA em Contabilidade & Direito Tributário e especialista em Crimes Digitais
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all bg-[var(--bg-elevated)] border-[var(--border-primary)]">
              <CardContent className="p-6 text-center">
                <Briefcase className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Atuação Profissional</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Hermida Maia Sociedade Individual de Advocacia, Porto Alegre/RS. 
                  Inscrito na OAB/SP 476.963, OAB/RS 107.048, OAB/DF 75.394 e OAB/AM 8.894
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all bg-[var(--bg-elevated)] border-[var(--border-primary)]">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-[var(--brand-primary)] mx-auto mb-4" />
                <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Reconhecimento</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Autor do livro "Manual do Superendividado: como sair do vermelho e recuperar sua estabilidade financeira" (2024)
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}