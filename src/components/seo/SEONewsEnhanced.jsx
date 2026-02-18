import React from "react";
import { Helmet } from "react-helmet";

export default function SEONewsEnhanced() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Notícias e Tendências em Superendividamento",
    "description": "Últimas notícias sobre Lei 14.181/2021, superendividamento, defesa do consumidor e direitos do devedor no Brasil.",
    "url": "https://adrianohermidamaia.com/news"
  };

  return (
    <Helmet>
      <title>Notícias Superendividamento | Lei 14.181/2021 e Defesa do Devedor</title>
      <meta name="description" content="Fique atualizado sobre Lei do Superendividamento 14.181/2021, mudanças na legislação, direitos do consumidor e tendências em defesa do devedor." />
      <meta name="keywords" content="notícias superendividamento, lei 14181 atualizações, direitos consumidor notícias, defesa devedor brasil, legislação dívidas" />
      <link rel="canonical" href="https://adrianohermidamaia.com/news" />
      <meta property="og:title" content="Notícias e Tendências em Superendividamento" />
      <meta property="og:description" content="Atualizações sobre Lei 14.181/2021 e defesa do consumidor superendividado" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}