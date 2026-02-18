import React from "react";
import { motion } from "framer-motion";
import { FileText, Target, TrendingUp, Award } from "lucide-react";

const stats = [
  { icon: FileText, value: "2.000+", label: "Planos Homologados" },
  { icon: Target, value: "98%", label: "Taxa de Sucesso" },
  { icon: TrendingUp, value: "R$ 35M+", label: "Dívidas Renegociadas" },
  { icon: Award, value: "10+", label: "Anos de Experiência" }
];

export default function HeroSection() {
  return (
    <section className="py-20 px-6 bg-[var(--navy-900)] relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-12 items-center mb-16"
        >
          <div>
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/541c30f0c__TLM9795.jpg"
              alt="Foto profissional do Dr. Adriano Hermida Maia, advogado especialista em superendividamento e defesa do devedor"
              className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
              loading="eager"
              width="500"
              height="600"
            />
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[var(--brand-primary)] font-bold text-lg mb-2" role="doc-subtitle">
                Referência em Defesa do Devedor
              </p>
              <h1 className="text-5xl font-bold mb-4 text-white">
                Dr. Adriano Hermida Maia
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                Advogado, Docente e Especialista em Superendividamento
              </p>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                Advogado e sócio do escritório <strong className="text-white">Hermida Maia Sociedade Individual de Advocacia</strong> 
                (<a href="https://www.hermidamaia.adv.br" target="_blank" rel="noopener noreferrer" className="text-[var(--brand-primary)] hover:underline">www.hermidamaia.adv.br</a>), 
                Porto Alegre/RS.
              </p>
              <p>
                Docente no Ensino Superior, Pós-Graduado em Direito Processo Civil, Direito do Trabalho, 
                MBA em Contabilidade & Direito Tributário e especialista em <strong className="text-white">Crimes Digitais</strong>.
              </p>
              <p>
                Inscrito na OAB/SP 476.963, OAB/RS 107.048, OAB/DF 75.394 e OAB/AM 8.894.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}