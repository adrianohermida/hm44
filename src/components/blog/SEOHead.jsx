import React from 'react';
import { Helmet } from 'react-helmet';

export default function SEOHead({ post, isArticle = false }) {
  const baseUrl = window.location.origin;
  const canonicalUrl = `${baseUrl}${window.location.pathname}`;

  const schema = isArticle ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.titulo,
    "description": post.meta_description,
    "image": post.imagem_destaque,
    "author": {
      "@type": "Person",
      "name": post.autor || "Dr. Adriano Hermida Maia"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Dr. Adriano Hermida Maia",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "datePublished": post.data_publicacao,
    "dateModified": post.updated_date,
    "mainEntityOfPage": canonicalUrl
  } : null;

  return (
    <Helmet>
      <title>{post.titulo} | Dr. Adriano Hermida Maia</title>
      <meta name="description" content={post.meta_description} />
      <meta name="keywords" content={post.meta_keywords?.join(', ')} />
      <link rel="canonical" href={canonicalUrl} />
      
      <meta property="og:type" content={isArticle ? "article" : "website"} />
      <meta property="og:title" content={post.titulo} />
      <meta property="og:description" content={post.meta_description} />
      <meta property="og:image" content={post.imagem_destaque} />
      <meta property="og:url" content={canonicalUrl} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.titulo} />
      <meta name="twitter:description" content={post.meta_description} />
      <meta name="twitter:image" content={post.imagem_destaque} />
      
      {schema && <script type="application/ld+json">{JSON.stringify(schema)}</script>}
    </Helmet>
  );
}