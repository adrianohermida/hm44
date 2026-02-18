import React from 'react';
import { Award, TrendingUp, Users } from 'lucide-react';

export default function AuthoritySectionClean() {
  const stats = [
    { icon: Award, value: '15+', label: 'Anos de Experiência' },
    { icon: TrendingUp, value: 'R$ 35M+', label: 'Renegociados' },
    { icon: Users, value: '98%', label: 'Taxa de Sucesso' },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Por que Escolher Dr. Adriano Hermida Maia?
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto px-4">
            Especialista em Superendividamento e Defesa do Consumidor
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[var(--brand-primary-100)] mx-auto mb-4 flex items-center justify-center">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--brand-primary)]" />
                </div>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-gray-300">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6945334e2e139c6041c8708f/0464f27cd_PerfilAdriano.jpg"
              alt="Dr. Adriano Hermida Maia"
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-xl"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Dr. Adriano Hermida Maia
              </h3>
              <p className="text-[var(--brand-primary)] text-sm sm:text-base font-semibold mb-3">
                OAB/SP 476.963 • Especialista em Superendividamento
              </p>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Autor do livro <span className="text-white font-semibold">"Manual do Superendividado"</span>, 
                com pós-graduação em Processo Civil e MBA em Direito Tributário.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}