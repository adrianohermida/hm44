import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, AlertCircle, CheckCircle } from "lucide-react";

export default function LegibilidadeAnalyzer({ topicos }) {
  const calcularLegibilidade = () => {
    const texto = topicos.map(t => t.texto || t.itens?.join(' ') || '').join(' ');
    const palavras = texto.split(/\s+/).filter(p => p.length > 0);
    const frases = texto.split(/[.!?]+/).filter(f => f.trim().length > 0);
    const silabas = palavras.reduce((acc, palavra) => acc + contarSilabas(palavra), 0);

    if (palavras.length === 0 || frases.length === 0) {
      return { score: 0, nivel: 'Sem conteúdo', cor: 'bg-gray-400', sugestoes: [] };
    }

    // Flesch Reading Ease adaptado para português
    const mediaPalavrasPorFrase = palavras.length / frases.length;
    const mediaSilabasPorPalavra = silabas / palavras.length;
    
    const fleschScore = 248.835 - (1.015 * mediaPalavrasPorFrase) - (84.6 * mediaSilabasPorPalavra);
    const score = Math.max(0, Math.min(100, Math.round(fleschScore)));

    let nivel, cor, sugestoes = [];
    
    if (score >= 80) {
      nivel = 'Muito Fácil';
      cor = 'bg-green-600';
      sugestoes.push('Ótimo! Texto fácil de ler para o público geral.');
    } else if (score >= 60) {
      nivel = 'Fácil';
      cor = 'bg-green-500';
      sugestoes.push('Bom! Adequado para maioria dos leitores.');
    } else if (score >= 50) {
      nivel = 'Médio';
      cor = 'bg-yellow-500';
      sugestoes.push('Use frases mais curtas (máx 15-20 palavras).');
      sugestoes.push('Simplifique palavras complexas quando possível.');
    } else if (score >= 30) {
      nivel = 'Difícil';
      cor = 'bg-orange-500';
      sugestoes.push('Divida frases longas em duas ou mais.');
      sugestoes.push('Substitua termos técnicos por explicações simples.');
      sugestoes.push('Use mais conectivos e transições entre ideias.');
    } else {
      nivel = 'Muito Difícil';
      cor = 'bg-red-600';
      sugestoes.push('Reescreva frases complexas em linguagem mais simples.');
      sugestoes.push('Adicione exemplos práticos para ilustrar conceitos.');
      sugestoes.push('Use bullet points para organizar informações.');
    }

    return { score, nivel, cor, sugestoes, mediaPalavrasPorFrase: mediaPalavrasPorFrase.toFixed(1) };
  };

  const contarSilabas = (palavra) => {
    palavra = palavra.toLowerCase().replace(/[^a-záàâãéèêíïóôõöúçñ]/g, '');
    const vogais = 'aáàâãeéèêiíïoóôõöuú';
    let count = 0;
    let prevVogal = false;

    for (let char of palavra) {
      const isVogal = vogais.includes(char);
      if (isVogal && !prevVogal) count++;
      prevVogal = isVogal;
    }

    return Math.max(1, count);
  };

  const { score, nivel, cor, sugestoes, mediaPalavrasPorFrase } = calcularLegibilidade();

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-sm">Legibilidade (Flesch)</span>
        </div>
        <Badge className={`${cor} text-white`}>
          {score}/100 - {nivel}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-600">
          <span>Média de palavras por frase:</span>
          <span className="font-medium">{mediaPalavrasPorFrase}</span>
          {parseFloat(mediaPalavrasPorFrase) > 20 && (
            <AlertCircle className="w-3 h-3 text-orange-500" />
          )}
          {parseFloat(mediaPalavrasPorFrase) <= 20 && (
            <CheckCircle className="w-3 h-3 text-green-500" />
          )}
        </div>

        {sugestoes.length > 0 && (
          <div className="mt-3 space-y-1 text-xs">
            <span className="font-medium text-gray-700">Sugestões:</span>
            {sugestoes.map((s, i) => (
              <div key={i} className="flex items-start gap-2 text-gray-600">
                <span className="text-[var(--brand-primary)]">•</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}