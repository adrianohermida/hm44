import React from "react";
import AuthorityImage from './authority/AuthorityImage';
import AuthorityContent from './authority/AuthorityContent';
import AuthorityTags from './authority/AuthorityTags';

export default function AuthoritySection() {
  return (
    <section className="py-16 bg-gradient-to-br from-[var(--navy-900)] to-[var(--navy-800)] px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Por que o Hermida Maia é a Melhor Escolha?
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto">
            Nossa expertise e dedicação são traduzidas em resultados concretos, ajudando milhares de pessoas a recuperarem o controle de suas finanças.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <AuthorityImage 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6945334e2e139c6041c8708f/0464f27cd_PerfilAdriano.jpg"
            alt="Dr. Adriano Hermida Maia"
          />
          <div className="order-1 lg:order-2 space-y-6">
            <AuthorityContent />
            <AuthorityTags />
          </div>
        </div>
      </div>
    </section>
  );
}