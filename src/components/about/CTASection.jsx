import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, Award, TrendingUp } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-[var(--brand-primary)] via-[var(--brand-primary-600)] to-[var(--brand-primary-700)] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white">
            Pronto Para Recuperar Sua Liberdade Financeira?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Com mais de 12 anos de experiência e 2.000+ planos homologados, o Dr. Adriano está pronto para te ajudar.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to={createPageUrl("Home")} aria-label="Acessar calculadora de dívidas para análise gratuita">
              <Button 
                size="lg" 
                className="bg-white hover:bg-white/90 text-[var(--brand-primary-700)] px-8 py-6 text-lg rounded-full shadow-2xl font-semibold transition-all hover:scale-105"
                aria-label="Usar calculadora de dívidas"
              >
                <Target className="w-5 h-5 mr-2" aria-hidden="true" />
                Usar Calculadora de Dívidas
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")} aria-label="Ir para página de contato para agendar consulta jurídica">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white bg-white/10 text-white hover:bg-white hover:text-[var(--brand-primary-700)] px-8 py-6 text-lg rounded-full font-semibold transition-all hover:scale-105"
                aria-label="Agendar consulta jurídica"
              >
                Agendar Consulta
                <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}