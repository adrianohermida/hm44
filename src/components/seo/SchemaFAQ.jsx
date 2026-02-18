import React from 'react';
import { Helmet } from 'react-helmet';

export default function SchemaFAQ() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "O que é superendividamento?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Superendividamento é quando uma pessoa ou família não consegue pagar suas dívidas sem comprometer o mínimo necessário para suas necessidades básicas. A Lei 14.181/2021 protege o consumidor superendividado."
        }
      },
      {
        "@type": "Question",
        "name": "Como funciona a Lei 14.181/2021?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A Lei do Superendividamento permite que o consumidor renegocie todas as suas dívidas de forma unificada, com proteção legal e possibilidade de redução de juros e prazos estendidos."
        }
      },
      {
        "@type": "Question",
        "name": "Quanto custa a consultoria?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oferecemos análise inicial gratuita. Os honorários são definidos após avaliação do caso, com opções de pagamento acessíveis."
        }
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(faqSchema)}
      </script>
    </Helmet>
  );
}