import React, { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, AlertCircle, XCircle, TrendingUp } from "lucide-react";

export default function SEOSuggestions({ titulo = '', resumo = '', conteudo = '', metaDescription = '' }) {
  const analysis = useMemo(() => {
    const texto = conteudo || "";
    const palavras = texto.split(/\s+/).filter(Boolean);
    const palavraCount = palavras.length;
    
    // Densidade de palavras-chave
    const palavrasChave = [];
    let densidadeTotal = 0;
    palavrasChave.forEach(keyword => {
      const regex = new RegExp(keyword, 'gi');
      const matches = (texto.match(regex) || []).length;
      densidadeTotal += (matches / palavraCount) * 100;
    });
    
    // Legibilidade (Flesch Reading Ease simplificado)
    const sentencas = texto.split(/[.!?]+/).filter(Boolean).length || 1;
    const palavrasPorSentenca = palavraCount / sentencas;
    const legibilidadeScore = Math.max(0, Math.min(100, 
      206.835 - (1.015 * palavrasPorSentenca) - (84.6 * 1.5)
    ));

    // Checks SEO
    const checks = [
      {
        label: "Título SEO (50-70 chars)",
        value: titulo?.length || 0,
        min: 50,
        max: 70,
        score: (titulo?.length >= 50 && titulo?.length <= 70) ? 20 : 0
      },
      {
        label: "Meta Description (150-160 chars)",
        value: metaDescription?.length || 0,
        min: 150,
        max: 160,
        score: (metaDescription?.length >= 150 && metaDescription?.length <= 160) ? 20 : 0
      },
      {
        label: "Conteúdo (mín. 800 palavras)",
        value: palavraCount,
        min: 800,
        max: 2000,
        score: palavraCount >= 800 ? 20 : (palavraCount / 800) * 20
      },
      {
        label: "Keywords definidas (5-15)",
        value: palavrasChave.length,
        min: 5,
        max: 15,
        score: (palavrasChave.length >= 5 && palavrasChave.length <= 15) ? 15 : 0
      },
      {
        label: "Densidade de keywords (1-3%)",
        value: densidadeTotal.toFixed(2),
        min: 1,
        max: 3,
        score: (densidadeTotal >= 1 && densidadeTotal <= 3) ? 15 : 0
      },
      {
        label: "Legibilidade",
        value: legibilidadeScore.toFixed(0),
        min: 60,
        max: 100,
        score: legibilidadeScore >= 60 ? 10 : (legibilidadeScore / 60) * 10
      }
    ];

    const scoreTotal = Math.round(checks.reduce((sum, c) => sum + c.score, 0));

    return { checks, scoreTotal, legibilidadeScore, densidadeTotal };
  }, [titulo, resumo, conteudo, metaDescription]);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getStatusIcon = (check) => {
    const isValid = check.value >= check.min && check.value <= check.max;
    if (isValid) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (check.value === 0) return <XCircle className="w-4 h-4 text-gray-400" />;
    return <AlertCircle className="w-4 h-4 text-yellow-600" />;
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          SEO Score em Tempo Real
        </h3>
        <div className={`text-3xl font-bold ${getScoreColor(analysis.scoreTotal)}`}>
          {analysis.scoreTotal}/100
        </div>
      </div>

      <Progress 
        value={analysis.scoreTotal} 
        className="mb-6 h-3"
        indicatorClassName={getScoreBg(analysis.scoreTotal)}
      />

      <div className="space-y-3">
        {analysis.checks.map((check, i) => (
          <div key={i} className="flex items-start gap-2 p-2 bg-white rounded-lg">
            {getStatusIcon(check)}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{check.label}</span>
                <span className="text-xs text-gray-500">
                  {check.value} {check.min && `/ ${check.min}-${check.max}`}
                </span>
              </div>
              <Progress 
                value={(check.score / (check.label.includes('Keywords') ? 15 : 20)) * 100} 
                className="h-1"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Legibilidade</p>
            <p className={`font-bold ${
              analysis.legibilidadeScore >= 60 ? 'text-green-600' : 'text-yellow-600'
            }`}>
              {analysis.legibilidadeScore.toFixed(0)}/100
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Densidade Keywords</p>
            <p className={`font-bold ${
              analysis.densidadeTotal >= 1 && analysis.densidadeTotal <= 3 
                ? 'text-green-600' 
                : 'text-yellow-600'
            }`}>
              {analysis.densidadeTotal.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}