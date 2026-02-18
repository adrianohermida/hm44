import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Target, Lightbulb, Megaphone } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function AssistenteIAAvancado({ artigo, onAplicar }) {
  const [modo, setModo] = useState('tom');
  const [processando, setProcessando] = useState(false);
  const [sugestoes, setSugestoes] = useState(null);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: personas = [] } = useQuery({
    queryKey: ['personas', escritorio?.id],
    queryFn: () => base44.entities.PersonaBlog.filter({ escritorio_id: escritorio.id, ativo: true }),
    enabled: !!escritorio
  });

  const processar = async () => {
    setProcessando(true);
    try {
      if (modo === 'tom') {
        await processarTomVoz();
      } else if (modo === 'titulos') {
        await gerarTitulosCTR();
      } else if (modo === 'topicos') {
        await sugerirTopicos();
      }
    } catch (error) {
      toast.error('Erro ao processar');
    } finally {
      setProcessando(false);
    }
  };

  const processarTomVoz = async () => {
    const personasTexto = personas.length > 0
      ? personas.map(p => `${p.nome}:\n- Nível: ${p.nivel_conhecimento}\n- Tom: ${p.tom_voz}\n- Descrição: ${p.descricao}`).join('\n\n')
      : `Consumidor Leigo:\n- Nível: leigo\n- Tom: empático, didático\n- Descrição: Pessoa sem conhecimento jurídico`;

    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Adapte o tom de voz para personas definidas:

ARTIGO: "${artigo.titulo}"
CONTEÚDO: ${artigo.topicos.slice(0, 3).map(t => t.texto).join('\n')}

PERSONAS CONFIGURADAS:
${personasTexto}

Para CADA persona:
- Adapte título (50-60 chars)
- Adapte 1º parágrafo (150-200 palavras)
- Ajuste linguagem ao nível conhecimento
- Aplique tom de voz específico
- Justifique adaptações`,
      response_json_schema: {
        type: "object",
        properties: {
          adaptacoes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                persona: { type: "string" },
                titulo_adaptado: { type: "string" },
                paragrafo_exemplo: { type: "string" },
                justificativa: { type: "string" }
              }
            }
          }
        }
      }
    });
    setSugestoes(resultado.adaptacoes);
  };

  const gerarTitulosCTR = async () => {
    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Gere títulos otimizados para CTR máximo:

TÍTULO ATUAL: "${artigo.titulo}"
KEYWORDS: ${artigo.keywords?.join(', ')}

ESTRATÉGIAS:
1. Números/Listas (ex: "7 Formas de...")
2. Urgência (ex: "Ainda Dá Tempo...")
3. Curiosidade (ex: "O Que Ninguém Te Conta...")
4. Benefício Claro (ex: "Como Reduzir 80%...")
5. Gatilho Emocional (ex: "Pare de Sofrer Com...")

Para CADA estratégia:
- Título otimizado (50-60 chars)
- CTR estimado
- Justificativa psicológica`,
      response_json_schema: {
        type: "object",
        properties: {
          titulos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                estrategia: { type: "string" },
                titulo: { type: "string" },
                ctr_estimado: { type: "string" },
                justificativa: { type: "string" }
              }
            }
          }
        }
      }
    });
    setSugestoes(resultado.titulos);
  };

  const sugerirTopicos = async () => {
    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Sugira tópicos adicionais relevantes:

ARTIGO: "${artigo.titulo}"
KEYWORDS: ${artigo.keywords?.join(', ')}
H2 EXISTENTES: ${artigo.topicos.filter(t => t.tipo === 'h2').map(t => t.texto).join(', ')}

ANÁLISE:
- Lacunas de conteúdo não cobertas
- Perguntas frequentes relacionadas
- Aspectos complementares importantes
- Subtópicos de alto volume de busca

Para CADA tópico sugerido:
- Título H2
- Justificativa SEO
- Volume de busca estimado
- Posição sugerida no artigo`,
      response_json_schema: {
        type: "object",
        properties: {
          topicos_sugeridos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                titulo_h2: { type: "string" },
                justificativa: { type: "string" },
                volume_busca: { type: "string" },
                posicao_sugerida: { type: "number" }
              }
            }
          }
        }
      }
    });
    setSugestoes(resultado.topicos_sugeridos);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Assistente IA Avançado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Select value={modo} onValueChange={setModo}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tom">
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3" />
                Adaptar Tom/Persona
              </div>
            </SelectItem>
            <SelectItem value="titulos">
              <div className="flex items-center gap-2">
                <Megaphone className="w-3 h-3" />
                Títulos Alto CTR
              </div>
            </SelectItem>
            <SelectItem value="topicos">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-3 h-3" />
                Sugerir Tópicos
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={processar} disabled={processando} className="w-full" size="sm">
          {processando ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2" />}
          Processar com IA
        </Button>

        {sugestoes && (
          <div className="space-y-2 mt-3 max-h-96 overflow-y-auto">
            {modo === 'tom' && sugestoes.map((s, i) => (
              <div key={i} className="bg-white p-3 rounded border">
                <Badge className="mb-2">{s.persona}</Badge>
                <p className="text-sm font-semibold mb-1">{s.titulo_adaptado}</p>
                <p className="text-xs text-gray-600 mb-2">{s.paragrafo_exemplo.substring(0, 150)}...</p>
                <Button size="sm" variant="outline" onClick={() => onAplicar({ titulo: s.titulo_adaptado })}>
                  Aplicar
                </Button>
              </div>
            ))}

            {modo === 'titulos' && sugestoes.map((s, i) => (
              <div key={i} className="bg-white p-3 rounded border">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{s.estrategia}</Badge>
                  <span className="text-xs text-green-600 font-semibold">CTR: {s.ctr_estimado}</span>
                </div>
                <p className="text-sm font-semibold mb-1">{s.titulo}</p>
                <p className="text-xs text-gray-600 italic mb-2">{s.justificativa}</p>
                <Button size="sm" variant="outline" onClick={() => onAplicar({ titulo: s.titulo })}>
                  Aplicar Título
                </Button>
              </div>
            ))}

            {modo === 'topicos' && sugestoes.map((s, i) => (
              <div key={i} className="bg-white p-3 rounded border">
                <p className="text-sm font-semibold mb-1">{s.titulo_h2}</p>
                <p className="text-xs text-gray-600 mb-2">{s.justificativa}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-blue-600">Volume: {s.volume_busca}</span>
                  <Button size="sm" variant="outline" onClick={() => {
                    const novoTopico = { id: Date.now(), tipo: 'h2', texto: s.titulo_h2 };
                    onAplicar({ novoTopico, posicao: s.posicao_sugerida });
                  }}>
                    Adicionar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}