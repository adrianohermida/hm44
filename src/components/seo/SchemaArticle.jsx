import React from 'react';
import { Helmet } from 'react-helmet';

export default function SchemaArticle({ article, artigo }) {
  const post = article || artigo;
  
  if (!post?.titulo) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.titulo,
    "description": post.meta_description || post.resumo || '',
    "image": post.imagem_capa || post.imagem_destaque || '',
    "author": {
      "@type": "Person",
      "name": post.autor || "Dr. Adriano Hermida Maia",
      "url": "https://hermidamaia.com.br/sobre"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Hermida Maia Advocacia",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hermidamaia.com.br/logo.png"
      }
    },
    "datePublished": post.data_publicacao || post.created_date,
    "dateModified": post.updated_date || post.data_publicacao || post.created_date,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": post.url_canonica || `https://hermidamaia.com.br/blog/${post.slug || post.id}`
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}