import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';

export default function MetaTags({ 
  title, 
  description, 
  keywords, 
  type = 'website',
  author,
  publishedTime,
  schema 
}) {
  const fullTitle = title ? `${title} | Dr. Adriano Hermida Maia` : 'Dr. Adriano Hermida Maia - Defesa do Superendividado';
  const defaultDescription = description || 'Especialista em direito do consumidor e superendividamento. Recupere seu equilíbrio financeiro com suporte jurídico especializado.';

  if (!title && !description) return null;

  return (
    <HelmetProvider>
      <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={defaultDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={defaultDescription} />
      <meta property="og:type" content={type} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={defaultDescription} />
      
      {author && <meta name="author" content={author} />}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
      </Helmet>
    </HelmetProvider>
  );
}