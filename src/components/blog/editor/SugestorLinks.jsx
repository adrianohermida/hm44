import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Loader2, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import LinkSection from "./links/LinkSection";

export default function SugestorLinks({ titulo, topicos, onLinkInserido }) {
  const [buscando, setBuscando] = useState(false);
  const [links, setLinks] = useState(null);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: artigosExistentes = [] } = useQuery({
    queryKey: ['artigos-linkagem', escritorio?.id],
    queryFn: () => base44.entities.Blog.filter({ 
      escritorio_id: escritorio.id,
      publicado: true 
    }),
    enabled: !!escritorio
  });

  const buscarLinks = async () => {
    setBuscando(true);
    try {
      const conteudo = (topicos || [])
        .map(t => t.tipo === 'lista' ? t.itens?.join(' ') : t.texto || '')
        .join(' ')
        .substring(0, 1500);
      
      const artigosDisponiveis = artigosExistentes
        .filter(a => a.titulo !== titulo)
        .map(a => ({ titulo: a.titulo, categoria: a.categoria }))
        .slice(0, 10);

      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um especialista em SEO e linkagem interna/externa para conteúdo jurídico.

ARTIGO A ANALISAR:
Título: ${titulo}
Conteúdo: ${conteudo}

ARTIGOS DISPONÍVEIS NO BLOG (para linkagem interna):
${JSON.stringify(artigosDisponiveis, null, 2)}

TAREFA: Gere links estratégicos que aumentem a autoridade e relevância do artigo.

RETORNE JSON ESTRUTURADO:
{
  "links_internos": [
    {
      "texto_ancora": "texto exato que existe no conteúdo",
      "sugestao_url": "/blog/slug-artigo-existente",
      "titulo_artigo": "título do artigo da lista disponível",
      "motivo": "por que este link é relevante para SEO e experiência do usuário"
    }
  ],
  "links_externos": [
    {
      "texto_ancora": "texto exato que existe no conteúdo",
      "url": "https://dominio-oficial.gov.br/...",
      "fonte": "STF | STJ | TST | Planalto | Portal.gov.br",
      "autoridade": "alta",
      "tipo": "jurisprudencia|legislacao|portal_oficial"
    }
  ]
}

REGRAS CRÍTICAS:
1. Links Internos:
   - Use SOMENTE artigos da lista "ARTIGOS DISPONÍVEIS"
   - Máximo 3 links internos
   - Priorize artigos da mesma categoria
   - Texto âncora deve ser natural e contextual

2. Links Externos:
   - APENAS domínios oficiais: stf.jus.br, stj.jus.br, tst.jus.br, planalto.gov.br, gov.br
   - Máximo 5 links externos
   - Priorize: legislação > jurisprudência > portais informativos
   - URLs devem ser específicas (não homepage)
   - Autoridade sempre "alta" para fontes oficiais

3. Texto Âncora:
   - Deve aparecer LITERALMENTE no conteúdo
   - Entre 2-5 palavras
   - Evite "clique aqui", "saiba mais"
   - Use termos técnicos jurídicos quando possível

4. SEO Strategy:
   - Distribua links ao longo do conteúdo
   - Priorize parágrafos iniciais (primeiros 300 palavras)
   - Balance links internos e externos (ratio 1:2)

Se não houver artigos disponíveis para linkagem interna, retorne array vazio em links_internos.`,
        response_json_schema: {
          type: "object",
          properties: {
            links_internos: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  texto_ancora: { type: "string" },
                  sugestao_url: { type: "string" },
                  titulo_artigo: { type: "string" },
                  motivo: { type: "string" }
                }
              } 
            },
            links_externos: { 
              type: "array", 
              items: { 
                type: "object",
                properties: {
                  texto_ancora: { type: "string" },
                  url: { type: "string" },
                  fonte: { type: "string" },
                  autoridade: { type: "string" }
                }
              } 
            }
          }
        }
      });

      setLinks(resultado);
      const totalLinks = (resultado.links_internos?.length || 0) + (resultado.links_externos?.length || 0);
      toast.success(`${totalLinks} links sugeridos com sucesso`);
    } catch (error) {
      console.error('Erro ao buscar links:', error);
      toast.error('Erro ao gerar sugestões de links');
    } finally {
      setBuscando(false);
    }
  };

  const aplicarLink = (link, tipo) => {
    const url = tipo === 'interno' ? link.sugestao_url : link.url;
    const texto = tipo === 'interno' ? link.titulo_artigo : link.fonte;
    onLinkInserido(link.texto_ancora, url);
    toast.success(`Link adicionado: ${texto}`);
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold text-sm flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-purple-600" />
            Sugestão de Links IA
          </h4>
          <p className="text-xs text-gray-600 mt-0.5">
            Links internos e externos de autoridade
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={buscarLinks} 
          disabled={buscando || !titulo || !conteudo}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {buscando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Sugerir
            </>
          )}
        </Button>
      </div>

      {buscando && (
        <div className="bg-white p-3 rounded-lg text-center text-sm text-gray-600">
          <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
          Analisando conteúdo e buscando links relevantes...
        </div>
      )}

      {links && !buscando && (
        <div className="space-y-4">
          <LinkSection 
            title="🔗 Links Internos (Blog)"
            links={links.links_internos}
            tipo="interno"
            onAplicar={aplicarLink}
          />
          <LinkSection 
            title="🌐 Links Externos (Autoridade)"
            links={links.links_externos}
            tipo="externo"
            onAplicar={aplicarLink}
          />
          
          {!links.links_internos?.length && !links.links_externos?.length && (
            <p className="text-xs text-center text-gray-500 py-2">
              Nenhum link sugerido para este conteúdo
            </p>
          )}
        </div>
      )}

      {!links && !buscando && (
        <p className="text-xs text-center text-gray-500 py-2">
          Clique em "Sugerir" para analisar o conteúdo
        </p>
      )}
    </Card>
  );
}