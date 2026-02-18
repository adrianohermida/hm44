import React from 'react';
import { Helmet } from 'react-helmet';

export default function SEOTemplates() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Modelos Jurídicos - Documentos para Defesa do Devedor",
    "description": "Modelos de documentos jurídicos para defesa do devedor, petições, contestações e recursos relacionados à Lei 14.181/2021.",
    "url": "https://www.hermidamaia.adv.br/templates"
  };

  return (
    <Helmet>
      <title>Modelos Jurídicos | Dr. Adriano Hermida Maia - Documentos Prontos</title>
      <meta name="description" content="Acesse modelos de documentos jurídicos para defesa do devedor, petições sobre superendividamento e recursos baseados na Lei 14.181/2021." />
      <meta name="keywords" content="modelos jurídicos, petição superendividamento, documentos defesa devedor, Lei 14.181/2021, templates advocacia" />
      <link rel="canonical" href="https://www.hermidamaia.adv.br/templates" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}