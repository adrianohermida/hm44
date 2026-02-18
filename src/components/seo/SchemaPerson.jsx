import React from 'react';

export default function SchemaPerson() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Adriano Hermida Maia",
    "jobTitle": "Advogado Especialista em Direito do Consumidor",
    "url": "https://hermidamaia.adv.br",
    "sameAs": [
      "https://instagram.com/dr.adrianohermidamaia",
      "https://www.jusbrasil.com.br/artigos/busca?q=adriano+hermida+maia"
    ],
    "alumniOf": "OAB/SP",
    "knowsAbout": ["Superendividamento", "Direito do Consumidor", "Lei 14.181/2021"],
    "hasCredential": "OAB/SP"
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}