import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Info } from "lucide-react";

export default function SugestoesTempoReal({ titulo, metaDescription, topicos, keywords }) {
  const sugestoes = [];

  // Título
  const tituloLen = titulo?.length || 0;
  if (tituloLen < 50) {
    sugestoes.push({ tipo: 'alerta', campo: 'Título', msg: `Muito curto (${tituloLen}/50-60 caracteres)` });
  } else if (tituloLen > 60) {
    sugestoes.push({ tipo: 'alerta', campo: 'Título', msg: `Muito longo (${tituloLen}/50-60 caracteres)` });
  } else {
    sugestoes.push({ tipo: 'ok', campo: 'Título', msg: `Comprimento ideal (${tituloLen} caracteres)` });
  }

  // Meta Description
  const metaLen = metaDescription?.length || 0;
  if (metaLen < 120) {
    sugestoes.push({ tipo: 'alerta', campo: 'Meta Description', msg: `Muito curta (${metaLen}/120-160 caracteres)` });
  } else if (metaLen > 160) {
    sugestoes.push({ tipo: 'alerta', campo: 'Meta Description', msg: `Muito longa (${metaLen}/120-160 caracteres)` });
  } else {
    sugestoes.push({ tipo: 'ok', campo: 'Meta Description', msg: `Comprimento ideal (${metaLen} caracteres)` });
  }

  // Word Count
  const wordCount = topicos?.reduce((acc, t) => {
    const texto = t.texto || (t.itens || []).join(' ');
    return acc + texto.split(/\s+/).length;
  }, 0) || 0;
  if (wordCount < 800) {
    sugestoes.push({ tipo: 'alerta', campo: 'Conteúdo', msg: `${wordCount} palavras (mín. 800 recomendado)` });
  } else {
    sugestoes.push({ tipo: 'ok', campo: 'Conteúdo', msg: `${wordCount} palavras (ótimo!)` });
  }

  // Estrutura H2/H3
  const h2Count = topicos?.filter(t => t.tipo === 'h2').length || 0;
  const h3Count = topicos?.filter(t => t.tipo === 'h3').length || 0;
  if (h2Count === 0) {
    sugestoes.push({ tipo: 'alerta', campo: 'Estrutura', msg: 'Adicione H2 para melhor estrutura' });
  } else {
    sugestoes.push({ tipo: 'ok', campo: 'Estrutura', msg: `${h2Count} H2 + ${h3Count} H3 encontrados` });
  }

  // Keywords
  const kwCount = keywords?.length || 0;
  if (kwCount < 3) {
    sugestoes.push({ tipo: 'info', campo: 'Keywords', msg: 'Adicione ao menos 3 palavras-chave' });
  } else {
    sugestoes.push({ tipo: 'ok', campo: 'Keywords', msg: `${kwCount} palavras-chave definidas` });
  }

  return (
    <Card className="p-4 border-blue-200 bg-blue-50">
      <h4 className="font-bold text-sm mb-3">📊 Sugestões em Tempo Real</h4>
      <div className="space-y-2">
        {sugestoes.map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            {s.tipo === 'ok' && <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />}
            {s.tipo === 'alerta' && <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />}
            {s.tipo === 'info' && <Info className="w-4 h-4 text-blue-600 mt-0.5" />}
            <div>
              <span className="font-semibold">{s.campo}:</span> {s.msg}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}