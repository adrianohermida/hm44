import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import OtimizadorHeader from "./otimizador/OtimizadorHeader";
import OtimizadorProgress from "./otimizador/OtimizadorProgress";
import SugestaoTitulo from "./otimizador/SugestaoTitulo";
import SugestaoTopico from "./otimizador/SugestaoTopico";
import SugestaoImagem from "./otimizador/SugestaoImagem";
import SugestaoLeadMagnet from "./otimizador/SugestaoLeadMagnet";

export default function OtimizadorConteudoAvancado({ artigo, onAplicar }) {
  const [otimizando, setOtimizando] = useState(false);
  const [sugestoes, setSugestoes] = useState(null);
  const [aceites, setAceites] = useState({});

  const { data: leadMagnets } = useQuery({
    queryKey: ['lead-magnets'],
    queryFn: async () => {
      const escritorio = (await base44.entities.Escritorio.list())[0];
      return base44.entities.LeadMagnet.filter({ 
        escritorio_id: escritorio.id,
        ativo: true 
      });
    }
  });

  const otimizarConteudo = async () => {
    setOtimizando(true);
    try {
      const conteudoTexto = artigo.topicos?.map(t => t.texto || t.itens?.join(' ') || '').join('\n') || '';
      
      const analise = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise o artigo e sugira otimizações individuais com prós/contras:

TÍTULO: ${artigo.titulo}
CONTEÚDO: ${conteudoTexto}

Para cada sugestão, analise:
1. Impacto no Score SEO (+/- pontos estimados)
2. Prós da mudança
3. Contras da mudança
4. Risco da alteração (baixo/médio/alto)

Retorne sugestões granulares para aprovação individual.`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: {
              type: "object",
              properties: {
                original: { type: "string" },
                sugestao: { type: "string" },
                pros: { type: "array", items: { type: "string" } },
                contras: { type: "array", items: { type: "string" } },
                impacto_seo: { type: "number" },
                risco: { type: "string" }
              }
            },
            topicos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  indice: { type: "number" },
                  original: { type: "string" },
                  sugestao: { type: "string" },
                  pros: { type: "array", items: { type: "string" } },
                  contras: { type: "array", items: { type: "string" } },
                  impacto_seo: { type: "number" },
                  risco: { type: "string" }
                }
              }
            },
            imagens_sugeridas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  topico_indice: { type: "number" },
                  descricao: { type: "string" },
                  prompt: { type: "string" },
                  justificativa: { type: "string" }
                }
              }
            },
            lead_magnet_sugerido: {
              type: "object",
              properties: {
                tema: { type: "string" },
                justificativa: { type: "string" },
                onde_inserir: { type: "number" }
              }
            }
          }
        }
      });

      setSugestoes(analise);
      toast.success('Sugestões geradas');
    } catch (error) {
      console.error('Erro ao otimizar:', error);
      toast.error('Erro ao gerar sugestões');
    } finally {
      setOtimizando(false);
    }
  };

  const toggleAceite = (tipo, id) => {
    setAceites(prev => ({
      ...prev,
      [`${tipo}-${id}`]: !prev[`${tipo}-${id}`]
    }));
  };

  const aplicarSelecionados = () => {
    const mudancas = {};
    
    if (aceites['titulo-0'] && sugestoes?.titulo) {
      mudancas.titulo = sugestoes.titulo.sugestao;
    }

    const topicosModificados = artigo.topicos.map((t, i) => {
      if (aceites[`topico-${i}`] && sugestoes?.topicos?.[i]) {
        return { ...t, texto: sugestoes.topicos[i].sugestao };
      }
      return t;
    });
    mudancas.topicos = topicosModificados;

    if (Object.keys(mudancas).length > 0) {
      onAplicar(mudancas);
      toast.success(`${Object.keys(aceites).filter(k => aceites[k]).length} alterações aplicadas`);
      setSugestoes(null);
      setAceites({});
    }
  };

  const totalAceites = Object.values(aceites).filter(Boolean).length;

  return (
    <Card className="p-4 sm:p-6">
      <OtimizadorHeader
        otimizando={otimizando}
        onClick={otimizarConteudo}
        disabled={!artigo?.titulo}
      />

      {otimizando && <OtimizadorProgress />}

      {sugestoes && !otimizando && (
        <div className="space-y-4">
          {sugestoes.titulo && (
            <SugestaoTitulo
              sugestao={sugestoes.titulo}
              aceito={aceites['titulo-0']}
              onToggle={() => toggleAceite('titulo', 0)}
            />
          )}

          {sugestoes.topicos?.map((sug, i) => (
            <SugestaoTopico
              key={i}
              sugestao={sug}
              indice={i}
              aceito={aceites[`topico-${i}`]}
              onToggle={() => toggleAceite('topico', i)}
            />
          ))}

          {sugestoes.imagens_sugeridas?.map((img, i) => (
            <SugestaoImagem
              key={i}
              sugestao={img}
              onGerar={async (prompt) => {
                const { url } = await base44.integrations.Core.GenerateImage({ prompt });
                return url;
              }}
            />
          ))}

          {sugestoes.lead_magnet_sugerido && (
            <SugestaoLeadMagnet
              sugestao={sugestoes.lead_magnet_sugerido}
              leadMagnetsExistentes={leadMagnets || []}
            />
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={aplicarSelecionados}
              disabled={totalAceites === 0}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Aplicar {totalAceites} Selecionada(s)
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSugestoes(null);
                setAceites({});
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}