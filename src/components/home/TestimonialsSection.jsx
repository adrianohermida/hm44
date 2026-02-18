import React from 'react';
import { Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    { name: 'Maria Silva', text: 'Reduzi minhas dívidas em 65%! Excelente atendimento.', rating: 5 },
    { name: 'João Santos', text: 'Profissionais competentes, resolveram meu caso rapidamente.', rating: 5 },
    { name: 'Ana Costa', text: 'Finalmente consegui sair do sufoco financeiro. Recomendo!', rating: 5 }
  ];

  return (
    <section className="py-20 bg-[var(--brand-bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[var(--brand-text-primary)] mb-4">Histórias Reais de Sucesso</h2>
        <p className="text-center text-[var(--brand-text-secondary)] mb-12">O que nossos clientes satisfeitos dizem sobre nós</p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-[var(--brand-warning)] text-[var(--brand-warning)]" />
                ))}
              </div>
              <p className="text-[var(--brand-text-secondary)] mb-4 italic">"{t.text}"</p>
              <p className="font-bold text-[var(--brand-text-primary)]">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}