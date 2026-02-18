import React from 'react';

export default function SchemaLegalService() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Legal",
    "name": "Consultoria em Superendividamento",
    "provider": {
      "@type": "LegalService",
      "name": "Dr. Adriano Hermida Maia"
    },
    "areaServed": "BR",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços Jurídicos",
      "itemListElement": [
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Negociação de Dívidas" }},
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Plano de Pagamento Lei 14.181" }},
        { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Defesa do Consumidor" }}
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}