import React from 'react';
import TestimonialCardOptimized from '@/components/ui/TestimonialCardOptimized';

export default function TestimonialsRealData() {
  const testimonials = [
    { 
      name: 'Roberto Murilo', 
      text: 'Consegui reduzir minhas dívidas em 65% e recuperei minha tranquilidade financeira. O atendimento foi excepcional e o resultado superou minhas expectativas.', 
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    { 
      name: 'Maria Silva', 
      text: 'Profissionais altamente competentes que resolveram meu caso de forma rápida e eficiente. Recomendo de olhos fechados!', 
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    { 
      name: 'João Santos', 
      text: 'Após anos de sufoco financeiro, finalmente consegui um acordo justo. Agradeço imensamente pela dedicação e profissionalismo.', 
      rating: 5,
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--brand-primary-50)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Histórias Reais de Sucesso
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Veja como transformamos a vida financeira de nossos clientes com soluções jurídicas eficazes
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCardOptimized key={i} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}