import React from 'react';
import { Helmet } from 'react-helmet';

export default function SEONews() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Notícias e Tendências - Superendividamento e Defesa do Devedor",
    "description": "Atualizações sobre Lei 14.181/2021, superendividamento, defesa do devedor e direitos do consumidor no Brasil.",
    "url": "https://www.hermidamaia.adv.br/news"
  };

  return (
    <Helmet>
      <title>Notícias e Tendências | Dr. Adriano Hermida Maia - Superendividamento</title>
      <meta name="description" content="Fique por dentro das últimas notícias sobre superendividamento, Lei 14.181/2021, defesa do devedor e direitos do consumidor." />
      <meta name="keywords" content="notícias jurídicas, superendividamento, Lei 14.181/2021, defesa devedor, direitos consumidor, atualização legal" />
      <link rel="canonical" href="https://www.hermidamaia.adv.br/news" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}