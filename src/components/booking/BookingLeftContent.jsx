import React from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Shield, Globe } from "lucide-react";
import BookingBenefitCard from "./BookingBenefitCard";

const benefits = [
  {
    icon: Clock,
    title: 'Rápido e Prático',
    description: 'Agende em menos de 2 minutos sem precisar ligar.',
  },
  {
    icon: Shield,
    title: 'Sigilo Absoluto',
    description: 'Seus dados estão protegidos pela LGPD e pelo sigilo profissional.',
  },
  {
    icon: Globe,
    title: 'Atendimento Nacional',
    description: 'Consultas realizadas via videoconferência para todo o Brasil.',
  },
];

export default function BookingLeftContent({ theme }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="inline-flex items-center gap-2 bg-[#0d9c6e]/10 border border-[#0d9c6e]/20 rounded-full px-4 py-2">
        <Calendar size={16} className="text-[#0d9c6e]" />
        <span className="text-[#0d9c6e] text-xs font-bold uppercase tracking-widest">
          Agendamento Online
        </span>
      </div>

      <h1 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Reserve sua Consulta com um{' '}
        <span className="text-[#0d9c6e]">Especialista</span>
      </h1>
      <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
        Dê o primeiro passo para recuperar sua tranquilidade financeira. 
        Escolha o melhor horário para conversarmos sobre seu caso.
      </p>

      <div className="space-y-6">
        {benefits.map((benefit, index) => (
          <BookingBenefitCard 
            key={benefit.title}
            benefit={benefit}
            index={index}
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  );
}