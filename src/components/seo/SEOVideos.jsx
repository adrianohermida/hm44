import React from "react";
import { Helmet } from "react-helmet";

export default function SEOVideos() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "VideoGallery",
    "name": "Vídeos Educativos - Superendividamento e Lei 14.181/2021",
    "description": "Conteúdo audiovisual educativo sobre Lei do Superendividamento, direitos do consumidor e defesa do devedor.",
    "url": "https://adrianohermidamaia.com/videos"
  };

  return (
    <Helmet>
      <html lang="pt-BR" />
      <title>Vídeos Educativos - Superendividamento Lei 14.181/2021 | Dr. Adriano Hermida</title>
      <meta name="description" content="Assista vídeos educativos sobre Lei do Superendividamento 14.181/2021, direitos do consumidor, renegociação de dívidas e defesa do devedor. Conteúdo gratuito e acessível." />
      <meta name="keywords" content="vídeos superendividamento, lei 14181 vídeos, youtube advogado consumidor, shorts jurídicos, educação financeira vídeos" />
      <link rel="canonical" href="https://adrianohermidamaia.com/videos" />
      <meta property="og:title" content="Vídeos Educativos - Superendividamento" />
      <meta property="og:description" content="Aprenda sobre seus direitos com vídeos educativos sobre Lei 14.181/2021" />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content="pt_BR" />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}