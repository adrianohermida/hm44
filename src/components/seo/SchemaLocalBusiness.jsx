import React from 'react';

export default function SchemaLocalBusiness() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Dr. Adriano Hermida Maia - Advocacia",
    "image": "https://hermidamaia.adv.br/logo.png",
    "description": "Especialista em Direito do Consumidor e Lei do Superendividamento. Autor do Manual do Superendividamento.",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressRegion": "SP",
      "addressLocality": "São Paulo"
    },
    "telephone": "+55-11-99999-9999",
    "priceRange": "$$",
    "url": "https://hermidamaia.adv.br",
    "areaServed": "BR",
    "founder": {
      "@type": "Person",
      "name": "Adriano Hermida Maia",
      "jobTitle": "Advogado Especialista"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}