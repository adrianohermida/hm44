import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GeradorTopicosIA({ onAplicarEstrutura }) {
  const [gerando, setGerando] = useState(false);
  const [topico, setTopico] = useState('');
  const [keywords, setKeywords] = useState('');
  const [estrutura, setEstrutura] = useState(null);
  const [erro, setErro] = useState(null);

  const gerar = async () => {
    if (!topico.trim()) {
      toast.error('Insira um tópico');
      return;
    }

    setGerando(true);
    setErro(null);
    setEstrutura(null);
    
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um especialista em SEO e conteúdo jurídico.

TEMA: "${topico}"
${keywords ? `KEYWORDS: ${keywords}` : ''}

MISSÃO: Gere uma estrutura COMPLETA e otimizada para SEO com ANÁLISE DE SCORE.

RETORNE JSON com:
- titulo: string (H1, 50-60 caracteres, otimizado para CTR)
- secoes: array de 5-8 seções, cada uma com:
  - h2: string (título otimizado com keywords)
  - descricao: string (resumo do que abordar)
  - subsecoes: array de 2-3 itens:
    - h3: string (subtítulo)
    - descricao: string (contexto)
- score_seo: number (0-100, baseado em: comprimento título, densidade keywords, estrutura H2/H3, potencial featured snippet)
- justificativa_score: string (análise detalhada do score)

CRITÉRIOS DE AVALIAÇÃO SEO:
- Título 50-60 chars: +20 pontos
- 5+ H2s com keywords: +25 pontos
- 2-3 H3s por H2: +20 pontos
- Estrutura lógica (problema→solução): +20 pontos
- Potencial featured snippet: +15 pontos

EXEMPLO:
{
  "titulo": "Como Negociar Dívidas Bancárias em 2024",
  "secoes": [
    {
      "h2": "O que é Superendividamento",
      "descricao": "Conceito legal e impactos",
      "subsecoes": [
        {"h3": "Definição Legal do CDC", "descricao": "Art. 54-A"},
        {"h3": "Causas Principais", "descricao": "Desemprego, juros"}
      ]
    }
  ],
  "score_seo": 85,
  "justificativa_score": "Título otimizado (56 chars), 6 H2s com keywords, estrutura lógica..."
}`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            secoes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  h2: { type: "string" },
                  descricao: { type: "string" },
                  subsecoes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        h3: { type: "string" },
                        descricao: { type: "string" }
                      }
                    }
                  }
                }
              }
            },
            score_seo: { type: "number" },
            justificativa_score: { type: "string" }
          },
          required: ["titulo", "secoes", "score_seo"]
        }
      });

      if (!resultado || typeof resultado !== 'object') {
        throw new Error('Resposta inválida da IA');
      }

      if (!resultado.titulo || !Array.isArray(resultado.secoes) || resultado.secoes.length === 0) {
        throw new Error('Estrutura incompleta');
      }

      const secoesValidas = resultado.secoes.filter(s => 
        s && s.h2 && typeof s.h2 === 'string' && s.h2.trim()
      );

      if (secoesValidas.length === 0) {
        throw new Error('Nenhuma seção válida');
      }

      const estruturaFinal = {
        titulo: resultado.titulo,
        secoes: secoesValidas,
        score_seo: resultado.score_seo || 0,
        justificativa_score: resultado.justificativa_score || 'Score não calculado'
      };
      
      setEstrutura(estruturaFinal);
      setErro(null);
      toast.success(`✅ Estrutura gerada! Score SEO: ${estruturaFinal.score_seo}/100`);
      
    } catch (error) {
      console.error('[GeradorTopicos] ❌ ERRO:', error);
      setErro(error.message);
      toast.error(`Erro: ${error.message}`);
    } finally {
      setGerando(false);
    }
  };

  const aplicar = () => {
    if (!estrutura || !estrutura.secoes || estrutura.secoes.length === 0) {
      toast.error('Nenhuma estrutura para aplicar');
      return;
    }

    const topicos = [];
    let h2Count = 0;
    let h3Count = 0;
    
    estrutura.secoes.forEach((secao, index) => {
      if (secao?.h2) {
        topicos.push({ 
          id: Date.now() + Math.random() * 10000 + index, 
          tipo: 'h2', 
          texto: secao.h2.trim() 
        });
        h2Count++;
      }
      
      if (secao?.subsecoes && Array.isArray(secao.subsecoes)) {
        secao.subsecoes.forEach((sub, subIndex) => {
          if (sub?.h3) {
            topicos.push({ 
              id: Date.now() + Math.random() * 10000 + index + subIndex + 1000, 
              tipo: 'h3', 
              texto: sub.h3.trim() 
            });
            h3Count++;
          }
        });
      }
    });

    if (topicos.length === 0) {
      toast.error('Nenhum tópico válido gerado');
      return;
    }

    onAplicarEstrutura({
      titulo: estrutura.titulo?.trim() || '',
      topicos
    });
      
    toast.success(`✅ ${h2Count} H2 e ${h3Count} H3 aplicados! Score SEO: ${estrutura.score_seo}/100`);
    setEstrutura(null);
    setTopico('');
    setKeywords('');
    setErro(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Gerador de Estrutura
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs">Tópico Principal</Label>
          <Input
            value={topico}
            onChange={(e) => setTopico(e.target.value)}
            placeholder="Ex: Negociação de dívidas bancárias"
            className="text-sm"
          />
        </div>
        
        <div>
          <Label className="text-xs">Keywords (opcional)</Label>
          <Input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="superendividamento, CDC, bancos"
            className="text-sm"
          />
        </div>

        <Button onClick={gerar} disabled={gerando} size="sm" className="w-full">
          {gerando ? (
            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3 mr-2" />
          )}
          Gerar Estrutura
        </Button>

        {erro && (
          <div className="p-3 bg-red-50 border border-red-200 rounded">
            <p className="text-xs font-semibold text-red-800 mb-1">❌ Erro:</p>
            <p className="text-xs text-red-700">{erro}</p>
          </div>
        )}

        {estrutura && (
          <div className="space-y-3 mt-4 border-2 border-green-500 rounded-lg p-3 bg-gradient-to-r from-green-50 to-blue-50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-bold text-green-800">✅ Estrutura Gerada!</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className="bg-green-600 text-white text-xs">
                    Score SEO: {estrutura.score_seo || 0}/100
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {estrutura.secoes?.length || 0} seções
                  </Badge>
                </div>
              </div>
            </div>

            {estrutura.justificativa_score && (
              <div className="p-2 bg-white/70 rounded border border-blue-200">
                <p className="text-xs font-semibold text-blue-900 mb-1">📊 Análise SEO:</p>
                <p className="text-xs text-gray-700">{estrutura.justificativa_score}</p>
              </div>
            )}

            <div className="p-3 bg-white rounded border">
              <p className="text-xs font-semibold text-gray-600 mb-1">H1 - Título:</p>
              <p className="text-sm font-bold text-gray-900">{estrutura.titulo}</p>
              <p className="text-xs text-gray-500 mt-1">{estrutura.titulo.length} caracteres</p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2">
              {estrutura.secoes.map((secao, i) => (
                <div key={i} className="p-2 bg-white rounded border">
                  <div className="flex items-start gap-2">
                    <Badge className="bg-blue-600 text-white text-xs">H2</Badge>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{secao.h2}</p>
                      {secao.descricao && <p className="text-xs text-gray-600 mt-0.5">{secao.descricao}</p>}
                    </div>
                  </div>
                  
                  {secao.subsecoes && secao.subsecoes.length > 0 && (
                    <div className="ml-6 mt-2 space-y-1.5">
                      {secao.subsecoes.map((sub, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs">H3</Badge>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-800">{sub.h3}</p>
                            {sub.descricao && <p className="text-xs text-gray-500">{sub.descricao}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <Button onClick={aplicar} size="sm" className="w-full bg-green-600 hover:bg-green-700">
              <Plus className="w-3 h-3 mr-2" />
              Aplicar no Editor Agora
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}