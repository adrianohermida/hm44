import React from 'react';
import { Helmet } from 'react-helmet';

export default function SEOContact() {
  const title = "Fale Conosco - Dr. Adriano Hermida Maia | Consulta Jurídica Especializada";
  const description = "Entre em contato com Dr. Adriano Hermida Maia para consultoria especializada em superendividamento e defesa do devedor. Atendimento em SP, RS, DF e AM. Lei 14.181/2021.";
  const keywords = "contato advogado, consulta jurídica, superendividamento, defesa devedor, renegociação dívidas, Lei 14.181/2021, advogado Porto Alegre";
  const canonical = "https://www.hermidamaia.adv.br/contact";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}