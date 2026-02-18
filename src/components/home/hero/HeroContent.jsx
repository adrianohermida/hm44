import React from 'react';

export default function HeroContent({ title, subtitle }) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
        {title || 'Liberte-se das Dívidas com Segurança Jurídica'}
      </h1>
      <p className="text-xl text-white/90 mb-8">
        {subtitle || 'Especialistas em defesa do consumidor e superendividamento. Reduza suas dívidas em até 70%.'}
      </p>
    </div>
  );
}