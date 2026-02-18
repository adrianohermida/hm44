import React from "react";
import { Badge } from "@/components/ui/badge";

export default function ScoreSEOLive({ formData }) {
  const calcularScore = () => {
    let score = 0;
    let total = 0;

    // Título (15 pontos)
    total += 15;
    if (formData.titulo.length >= 40 && formData.titulo.length <= 60) score += 15;
    else if (formData.titulo.length > 0) score += 8;

    // Meta Description (15 pontos)
    total += 15;
    if (formData.meta_description?.length >= 150 && formData.meta_description.length <= 160) score += 15;
    else if (formData.meta_description?.length > 0) score += 8;

    // Slug (15 pontos)
    total += 15;
    if (formData.slug.length >= 3 && formData.slug.length <= 60 && !/[^a-z0-9-]/.test(formData.slug)) score += 15;
    else if (formData.slug.length > 0) score += 8;

    // Palavras-chave (10 pontos)
    total += 10;
    if (formData.keywords?.length >= 3 && formData.keywords.length <= 5) score += 10;
    else if (formData.keywords?.length > 0) score += 5;

    // Imagem de capa (10 pontos)
    total += 10;
    if (formData.imagem_capa) score += 10;

    // Conteúdo (25 pontos)
    total += 25;
    const palavras = formData.topicos.reduce((acc, t) => {
      return acc + (t.texto?.split(' ').length || 0) + (t.itens?.join(' ').split(' ').length || 0);
    }, 0);
    if (palavras >= 800) score += 25;
    else if (palavras >= 500) score += 15;
    else if (palavras >= 300) score += 8;

    // Estrutura (10 pontos)
    total += 10;
    const h2Count = formData.topicos.filter(t => t.tipo === 'h2').length;
    const h3Count = formData.topicos.filter(t => t.tipo === 'h3').length;
    if (h2Count >= 2 && h3Count >= 2) score += 10;
    else if (h2Count >= 1) score += 5;

    const percentual = Math.round((score / total) * 100);
    return percentual;
  };

  const score = calcularScore();
  const cor = score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-600' : 'bg-red-600';

  return (
    <Badge className={`${cor} text-white`}>
      SEO: {score}/100
    </Badge>
  );
}