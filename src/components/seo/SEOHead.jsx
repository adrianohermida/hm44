import React from 'react';
import { Helmet } from 'react-helmet';

export default function SEOHead({ 
  title = "Dr. Adriano Hermida Maia - Advogado Especialista em Superendividamento",
  description = "Especialista em Lei do Superendividamento (14.181/21). Renegociação de dívidas, plano de pagamento e defesa do consumidor. Atendimento personalizado.",
  image = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200",
  url = "https://www.adrianohermidamaia.com.br",
  type = "website"
}) {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Dr. Adriano Hermida Maia - Advogado" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
}