import React from 'react';
import { Helmet } from 'react-helmet';

export default function SEOAbout() {
  const title = "Sobre Dr. Adriano Hermida Maia | Especialista em Superendividamento";
  const description = "Conheça Dr. Adriano Hermida Maia, advogado especialista em defesa do devedor e superendividamento. Mais de 12 anos de experiência, 2.000+ planos homologados pela Lei 14.181/2021. Atuação em SP, RS, DF e AM.";
  const keywords = "Adriano Hermida Maia, advogado superendividamento, defesa do devedor, Lei 14.181/2021, renegociação de dívidas, advogado consumidor, OAB SP, OAB RS, Porto Alegre";
  const canonical = "https://www.hermidamaia.adv.br/about";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="profile" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/541c30f0c__TLM9795.jpg" />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/541c30f0c__TLM9795.jpg" />
      
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "mainEntity": {
            "@type": "Person",
            "@id": "https://www.hermidamaia.adv.br/about",
            "name": "Adriano Menezes Hermida Maia",
            "jobTitle": "Advogado Especialista em Superendividamento",
            "url": "https://www.hermidamaia.adv.br",
            "sameAs": [
              "http://lattes.cnpq.br/0876441700206296",
              "https://www.linkedin.com/in/adrianohermida"
            ]
          }
        })}
      </script>
    </Helmet>
  );
}