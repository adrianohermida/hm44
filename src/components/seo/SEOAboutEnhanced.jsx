import React from "react";
import { Helmet } from "react-helmet";

export default function SEOAboutEnhanced() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Dr. Adriano Hermida Maia",
    "jobTitle": "Advogado Especialista em Superendividamento",
    "description": "Advogado com mais de 15 anos de experiência em defesa do consumidor superendividado e Lei 14.181/2021.",
    "knowsAbout": ["Direito do Consumidor", "Superendividamento", "Lei 14.181/2021", "Renegociação de Dívidas", "Defesa do Devedor"],
    "url": "https://adrianohermidamaia.com/about"
  };

  return (
    <Helmet>
      <title>Sobre Dr. Adriano Hermida Maia | Especialista em Superendividamento</title>
      <meta name="description" content="Conheça a trajetória do Dr. Adriano Hermida Maia, advogado especialista em Lei do Superendividamento 14.181/2021 e defesa do devedor. Mais de 15 anos protegendo consumidores." />
      <meta name="keywords" content="advogado superendividamento, dr adriano hermida maia, lei 14181 advogado, especialista defesa devedor, advogado consumidor rio janeiro" />
      <link rel="canonical" href="https://adrianohermidamaia.com/about" />
      <meta property="og:title" content="Sobre Dr. Adriano Hermida Maia" />
      <meta property="og:description" content="Especialista em Lei 14.181/2021 com mais de 15 anos defendendo consumidores superendividados" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}