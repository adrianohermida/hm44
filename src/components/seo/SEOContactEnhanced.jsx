import React from "react";
import { Helmet } from "react-helmet";

export default function SEOContactEnhanced() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contato - Dr. Adriano Hermida Maia",
    "description": "Entre em contato para consulta sobre superendividamento, Lei 14.181/2021 e defesa do devedor. Atendimento humanizado e consulta gratuita.",
    "url": "https://adrianohermidamaia.com/contact"
  };

  return (
    <Helmet>
      <title>Contato | Dr. Adriano Hermida Maia - Superendividamento Lei 14.181</title>
      <meta name="description" content="Fale com especialista em Lei do Superendividamento 14.181/2021. Consulta gratuita para análise de dívidas e defesa do devedor. WhatsApp e formulário disponíveis." />
      <meta name="keywords" content="contato advogado superendividamento, consulta gratuita dívidas, advogado lei 14181 contato, whatsapp advogado consumidor" />
      <link rel="canonical" href="https://adrianohermidamaia.com/contact" />
      <meta property="og:title" content="Contato - Especialista em Superendividamento" />
      <meta property="og:description" content="Consulta gratuita para análise de dívidas e aplicação da Lei 14.181/2021" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}