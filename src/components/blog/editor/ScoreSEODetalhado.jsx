import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import ScoreHeader from "./score/ScoreHeader";
import ScoreDisplay from "./score/ScoreDisplay";
import ScoreBreakdown from "./score/ScoreBreakdown";
import ScoreComparison from "./score/ScoreComparison";

export default function ScoreSEODetalhado({ formData, mediaTop3 }) {
  const [calculando, setCalculando] = useState(false);

  const calcularScore = () => {
    setCalculando(true);
    setTimeout(() => setCalculando(false), 500);
  };

  const analisarConteudo = () => {
    const texto = (formData.topicos || [])
      .map(t => t.tipo === 'lista' ? t.itens?.join(' ') : t.texto)
      .join(' ');
    
    const palavras = texto.split(/\s+/).filter(p => p.length > 3);
    const h2Count = (formData.topicos || []).filter(t => t.tipo === 'h2').length;
    const h3Count = (formData.topicos || []).filter(t => t.tipo === 'h3').length;
    
    return { totalPalavras: palavras.length, h2Count, h3Count };
  };

  const { totalPalavras, h2Count, h3Count } = analisarConteudo();

  const calcularBreakdown = () => {
    let titulo = formData.titulo?.length >= 50 && formData.titulo?.length <= 70 ? 20 : 
                 formData.titulo?.length > 0 ? 10 : 0;

    let meta_description = formData.meta_description?.length >= 150 && formData.meta_description?.length <= 160 ? 20 :
                          formData.meta_description?.length >= 130 ? 15 : 0;

    let tamanho = totalPalavras >= 1000 ? 20 : totalPalavras >= 600 ? 15 : 0;
    let estrutura = h2Count >= 3 && h3Count >= 2 ? 20 : h2Count >= 2 ? 12 : 0;
    let keywords = (formData.keywords || []).length >= 5 ? 10 : (formData.keywords || []).length >= 3 ? 6 : 0;
    let imagem = formData.imagem_capa ? 10 : 0;

    return { 
      titulo, meta_description, tamanho, estrutura, keywords, imagem,
      total: titulo + meta_description + tamanho + estrutura + keywords + imagem 
    };
  };

  const breakdown = calcularBreakdown();

  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <ScoreHeader calculando={calculando} onCalcular={calcularScore} />
      <ScoreDisplay total={breakdown.total} />
      <ScoreBreakdown breakdown={breakdown} />
      {mediaTop3 && <div className="mt-3"><ScoreComparison scoreAtual={breakdown.total} mediaTop3={mediaTop3} /></div>}
      <div className="mt-3 text-xs text-center text-gray-600">
        💡 Score atualiza automaticamente conforme você edita
      </div>
    </Card>
  );
}