import React from "react";
import { Helmet } from "react-helmet-async";

export default function SchemaMarkup({ type, data }) {
  const schemas = {
    blogPosting: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": data.titulo,
      "description": data.resumo,
      "image": data.imagem_capa,
      "author": {
        "@type": "Person",
        "name": data.autor,
        "jobTitle": data.autor_cargo
      },
      "publisher": {
        "@type": "Organization",
        "name": "Dr. Adriano Hermida Maia",
        "logo": {
          "@type": "ImageObject",
          "url": "https://seu-dominio.com/logo.png"
        }
      },
      "datePublished": data.data_publicacao,
      "dateModified": data.updated_date,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://seu-dominio.com/blog/${data.id}`
      }
    },
    breadcrumbList: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": data.items?.map((item, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": item.label,
        "item": item.url
      }))
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schemas[type])}
      </script>
    </Helmet>
  );
}