import React from "react";
import { Helmet } from "react-helmet";

export default function SEOHome() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Dr. Adriano Hermida Maia - Advocacia",
    "description": "Especialista em Lei do Superendividamento 14.181/2021. Defesa do devedor, renegociação de dívidas e proteção ao consumidor superendividado.",
    "url": "https://adrianohermidamaia.com",
    "telephone": "+55-21-99999-9999",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BR",
      "addressLocality": "Rio de Janeiro"
    },
    "priceRange": "Consulta gratuita",
    "areaServed": "BR"
  };

  return (
    <Helmet>
      <html lang="pt-BR" />
      <title>Dr. Adriano Hermida Maia | Especialista em Superendividamento Lei 14.181/2021</title>
      <meta name="description" content="Advogado especialista em Lei do Superendividamento 14.181/2021. Defesa do devedor, renegociação de dívidas, plano de pagamento e proteção ao consumidor superendividado. Consulta gratuita." />
      <meta name="keywords" content="superendividamento, lei 14.181/2021, defesa do devedor, renegociação de dívidas, advogado consumidor, plano de pagamento, dívidas bancárias, proteção consumidor" />
      <link rel="canonical" href="https://adrianohermidamaia.com" />
      <meta property="og:title" content="Dr. Adriano Hermida Maia | Especialista em Superendividamento" />
      <meta property="og:description" content="Especialista em Lei 14.181/2021. Defesa do devedor e renegociação de dívidas." />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}