import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, AlertCircle, CheckCircle, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function LegibilidadeOtimizador({ topicos, onAplicarOtimizacao }) {
  const [otimizando, setOtimizando] = useState(false);
  const [sugestoesAplicaveis, setSugestoesAplicaveis] = useState(null);

  const calcularLegibilidade = () => {
    const texto = topicos.map(t => t.texto || t.itens?.join(' ') || '').join(' ');
    const palavras = texto.split(/\s+/).filter(p => p.length > 0);
    const frases = texto.split(/[.!?]+/).filter(f => f.trim().length > 0);
    const silabas = palavras.reduce((acc, palavra) => acc + contarSilabas(palavra), 0);

    if (palavras.length === 0 || frases.length === 0) {
      return { score: 0, nivel: 'Sem conteúdo', cor: 'bg-gray-400' };
    }

    const mediaPalavrasPorFrase = palavras.length / frases.length;
    const mediaSilabasPorPalavra = silabas / palavras.length;
    
    const fleschScore = 248.835 - (1.015 * mediaPalavrasPorFrase) - (84.6 * mediaSilabasPorPalavra);
    const score = Math.max(0, Math.min(100, Math.round(fleschScore)));

    let nivel, cor;
    if (score >= 80) { nivel = 'Muito Fácil'; cor = 'bg-green-600'; }
    else if (score >= 60) { nivel = 'Fácil'; cor = 'bg-green-500'; }
    else if (score >= 50) { nivel = 'Médio'; cor = 'bg-yellow-500'; }
    else if (score >= 30) { nivel = 'Difícil'; cor = 'bg-orange-500'; }
    else { nivel = 'Muito Difícil'; cor = 'bg-red-600'; }

    return { score, nivel, cor, mediaPalavrasPorFrase: mediaPalavrasPorFrase.toFixed(1) };
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

  const otimizarLegibilidade = async () => {
    setOtimizando(true);
    try {
      const conteudo = topicos.map((t, i) => `[${i}] ${t.tipo}: ${t.texto || t.itens?.join('; ')}`).join('\n');
      
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Otimize a legibilidade deste conteúdo jurídico mantendo precisão técnica:

CONTEÚDO ATUAL:
${conteudo}

PROBLEMAS DETECTADOS:
- Frases muito longas (>20 palavras)
- Termos técnicos sem explicação
- Parágrafos densos
- Estrutura complexa

OTIMIZAÇÕES APLICÁVEIS:
1. Divida frases longas em 2-3 frases menores
2. Adicione explicações simples após termos técnicos
3. Converta parágrafos longos em listas/bullets
4. Insira conectivos e transições
5. Simplifique voz passiva para ativa

Para CADA tópico que precisa otimização, retorne:
- índice do tópico [número]
- versão otimizada (legível, mas juridicamente precisa)
- explicação da melhoria

Retorne JSON estruturado com otimizações aplicáveis.`,
        response_json_schema: {
          type: "object",
          properties: {
            topicos_otimizados: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  indice: { type: "number" },
                  texto_otimizado: { type: "string" },
                  explicacao_melhoria: { type: "string" }
                }
              }
            },
            score_estimado_pos: { type: "number" }
          }
        }
      });

      setSugestoesAplicaveis(resultado);
      toast.success(`${resultado.topicos_otimizados?.length || 0} tópicos otimizados!`);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao otimizar legibilidade');
    } finally {
      setOtimizando(false);
    }
  };

  const aplicarOtimizacoes = () => {
    if (!sugestoesAplicaveis?.topicos_otimizados || sugestoesAplicaveis.topicos_otimizados.length === 0) {
      toast.error('Nenhuma otimização disponível');
      return;
    }

    const topicosAtualizados = topicos.map((t, idx) => {
      const otimizacao = sugestoesAplicaveis.topicos_otimizados.find(o => o.indice === idx);
      if (otimizacao && otimizacao.texto_otimizado) {
        return {
          ...t,
          texto: otimizacao.texto_otimizado
        };
      }
      return { ...t };
    });

    onAplicarOtimizacao(topicosAtualizados);
    setSugestoesAplicaveis(null);
    toast.success(`${sugestoesAplicaveis.topicos_otimizados.length} otimizações aplicadas!`);
  };

  const { score, nivel, cor, mediaPalavrasPorFrase } = calcularLegibilidade();

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
          <span>Média palavras/frase:</span>
          <span className="font-medium">{mediaPalavrasPorFrase}</span>
          {parseFloat(mediaPalavrasPorFrase) > 20 && <AlertCircle className="w-3 h-3 text-orange-500" />}
          {parseFloat(mediaPalavrasPorFrase) <= 20 && <CheckCircle className="w-3 h-3 text-green-500" />}
        </div>

        {score < 60 && (
          <Button
            size="sm"
            onClick={otimizarLegibilidade}
            disabled={otimizando}
            className="w-full mt-2"
            variant="outline"
          >
            <Sparkles className={`w-3 h-3 mr-1 ${otimizando ? 'animate-pulse' : ''}`} />
            {otimizando ? 'Otimizando...' : 'Otimizar Legibilidade com IA'}
          </Button>
        )}

        {sugestoesAplicaveis && (
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between p-2 bg-green-50 rounded">
              <p className="text-xs font-medium text-green-900">
                Score estimado após otimização: {sugestoesAplicaveis.score_estimado_pos}/100
              </p>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {sugestoesAplicaveis.topicos_otimizados?.map((otim, i) => (
                <div key={i} className="p-2 bg-blue-50 rounded border border-blue-200 text-xs">
                  <p className="font-medium text-blue-900 mb-1">Tópico {otim.indice + 1}:</p>
                  <p className="text-gray-700 mb-1">{otim.texto_otimizado}</p>
                  <p className="text-blue-600 text-xs italic">{otim.explicacao_melhoria}</p>
                </div>
              ))}
            </div>

            <Button
              size="sm"
              onClick={aplicarOtimizacoes}
              className="w-full"
            >
              Aplicar Todas Otimizações ({sugestoesAplicaveis.topicos_otimizados?.length})
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}