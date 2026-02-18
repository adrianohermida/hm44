import React from "react";
import { Helmet } from "react-helmet";

export default function SEOTemplatesEnhanced() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Modelos Jurídicos - Superendividamento e Defesa do Consumidor",
    "description": "Modelos de petições, contratos e documentos jurídicos para aplicação da Lei 14.181/2021 e defesa do consumidor superendividado.",
    "url": "https://adrianohermidamaia.com/templates"
  };

  return (
    <Helmet>
      <title>Modelos Jurídicos Superendividamento | Lei 14.181/2021 Templates</title>
      <meta name="description" content="Modelos de documentos jurídicos para Lei do Superendividamento 14.181/2021. Petições, contratos e formulários para defesa do devedor e renegociação de dívidas." />
      <meta name="keywords" content="modelos jurídicos superendividamento, template lei 14181, petição defesa devedor, modelo renegociação dívidas, formulário superendividamento" />
      <link rel="canonical" href="https://adrianohermidamaia.com/templates" />
      <meta property="og:title" content="Modelos Jurídicos - Superendividamento" />
      <meta property="og:description" content="Templates e modelos para aplicação da Lei 14.181/2021" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}