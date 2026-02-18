import React from 'react';
import { Helmet } from 'react-helmet';

export default function SchemaLawyer() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Attorney",
    "name": "Adriano Menezes Hermida Maia",
    "url": "https://www.hermidamaia.adv.br",
    "image": "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69457177ae7e61f63fb38329/541c30f0c__TLM9795.jpg",
    "telephone": "+55-51-4042-1766",
    "email": "adrianohermida@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida Praia de Belas, 1212/424",
      "addressLocality": "Porto Alegre",
      "addressRegion": "RS",
      "postalCode": "90110-000",
      "addressCountry": "BR"
    },
    "areaServed": ["BR"],
    "knowsLanguage": ["pt-BR", "en", "es"],
    "alumniOf": [
      {
        "@type": "EducationalOrganization",
        "name": "Faculdade Martha Falcão"
      },
      {
        "@type": "EducationalOrganization",
        "name": "UNINTER - Centro Universitário Internacional"
      }
    ],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "Pós-Graduação",
        "educationalLevel": "Especialização",
        "competencyRequired": "Direito Processual Civil"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "MBA",
        "educationalLevel": "Pós-Graduação",
        "competencyRequired": "Contabilidade & Direito Tributário"
      }
    ]
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
}