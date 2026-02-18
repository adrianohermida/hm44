import React from 'react';
import { Helmet } from 'react-helmet';

export default function SEOAgendarConsulta() {
  return (
    <Helmet>
      <html lang="pt-BR" />
      <title>Agendar Consulta - Dr. Adriano Hermida Maia | Superendividamento</title>
      <meta name="description" content="Agende sua consulta jurídica com disponibilidade em tempo real. Defesa especializada em superendividamento e Lei 14.181/2021." />
      <meta name="keywords" content="agendar consulta advogado, consulta superendividamento, agendamento online advogado, horários disponíveis advogado" />
      <link rel="canonical" href="https://adrianohermidamaia.com.br/agendar-consulta" />
      <meta property="og:title" content="Agendar Consulta - Dr. Adriano Hermida Maia" />
      <meta property="og:description" content="Veja nossa disponibilidade em tempo real e agende sua consulta" />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}