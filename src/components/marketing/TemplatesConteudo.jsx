import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const TEMPLATES = [
  { value: "blog_post", label: "Blog Post", icon: "📝" },
  { value: "landing_page", label: "Landing Page", icon: "🎯" },
  { value: "produto", label: "Página Produto", icon: "🛍️" },
  { value: "faq", label: "FAQ Completo", icon: "❓" },
  { value: "case_study", label: "Case de Sucesso", icon: "🏆" }
];

export default function TemplatesConteudo() {
  const [template, setTemplate] = useState("");
  const [prompt, setPrompt] = useState("");
  const [resultado, setResultado] = useState(null);
  const [copied, setCopied] = useState(false);

  const gerarMutation = useMutation({
    mutationFn: async () => {
      const prompts = {
        blog_post: `BLOG POST PROFISSIONAL - Direito Consumidor Brasil

TÓPICO: ${prompt}

ESTRUTURA OBRIGATÓRIA:
1. Título H1 (55-65 chars, CTR 8%+, keyword início, número)
2. Introdução (120 palavras, hook emocional, estatística real)
3. 4-6 seções H2 com keywords LSI
4. Listas numeradas (featured snippets)
5. Boxes de destaque com dicas práticas
6. FAQ (5 perguntas People Also Ask)
7. CTA forte (agendar consulta)

SEO: Densidade keywords 1-2%, legibilidade 60+, meta description 150-160 chars`,

        landing_page: `LANDING PAGE CONVERSÃO MÁXIMA - Escritório Jurídico

OFERTA: ${prompt}

ESTRUTURA:
1. Hero: Headline + Subheadline + CTA primário + Prova social
2. Problema: 3 dores principais do cliente (ansiedade financeira)
3. Solução: Método exclusivo (3 pilares visuais)
4. Benefícios: 6 benefícios tangíveis com ícones
5. Prova Social: 3 depoimentos + estatísticas
6. Garantia: Risco zero (Lei 14.181, CDC)
7. CTA Final: Urgência + Escassez + Ação clara

Tom: Autoridade + Empatia | Gatilhos: Prova social, Autoridade, Urgência`,

        produto: `PÁGINA DE PRODUTO - Serviço Jurídico

SERVIÇO: ${prompt}

ESTRUTURA:
1. Above fold: Título benefício + Preço + CTA + Badge confiança
2. O que está incluso: Lista completa (checkmarks)
3. Como funciona: 3-5 passos visuais
4. Para quem é: Avatares específicos
5. Resultados esperados: Timeline realista
6. Perguntas frequentes: Top 8 objeções
7. Garantia: 7 dias satisfação garantida
8. CTAs múltiplos: Topo, meio, final

Compliance: OAB, CDC, valores éticos explícitos`,

        faq: `FAQ ESTRATÉGICO SEO - Direito Consumidor

TEMA: ${prompt}

REQUISITOS:
- 12-15 perguntas (mix: informacional + transacional)
- Formato Schema.org (rich snippets)
- Respostas: 50-150 palavras
- Keywords long-tail naturalmente
- Links internos (2-3 por resposta)
- CTAs sutis (30% respostas)

CATEGORIAS:
1. Conceitos básicos (3 perguntas)
2. Processo/Como fazer (4 perguntas)
3. Custos/Prazos (2 perguntas)
4. Casos específicos (3 perguntas)
5. Objeções (2 perguntas)`,

        case_study: `CASE DE SUCESSO - Storytelling Jurídico

CASO: ${prompt}

ESTRUTURA NARRATIVA:
1. Cliente (persona anônima, contexto real)
2. Problema (antes): Situação dramática, números reais
3. Obstáculos: Desafios enfrentados
4. Solução: Estratégia jurídica específica
5. Processo: Timeline ações concretas
6. Resultado (depois): Conquistas mensuráveis
7. Depoimento: Aspas literais cliente
8. Lições aprendidas: Insights práticos
9. CTA: Casos similares aceitos

Tom: Narrativo + Técnico | Foco: Transformação + Prova concreta`
      };

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompts[template],
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            conteudo: { type: "string" },
            meta_title: { type: "string" },
            meta_description: { type: "string" },
            keywords: { type: "array", items: { type: "string" } }
          }
        }
      });
      return response;
    },
    onSuccess: (data) => {
      setResultado(data);
      toast.success("Conteúdo gerado!");
    }
  });

  const copyToClipboard = () => {
    navigator.clipboard.writeText(resultado.conteudo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copiado!");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-lg">Templates de Conteúdo</h3>
      </div>

      <div className="space-y-4 mb-4">
        <Select value={template} onValueChange={setTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de conteúdo" />
          </SelectTrigger>
          <SelectContent>
            {TEMPLATES.map(t => (
              <SelectItem key={t.value} value={t.value}>
                {t.icon} {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Descreva o tópico ou tema do conteúdo..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
        />

        <Button
          onClick={() => gerarMutation.mutate()}
          disabled={!template || !prompt || gerarMutation.isPending}
          className="w-full"
        >
          {gerarMutation.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando...</>
          ) : (
            <><FileText className="w-4 h-4 mr-2" />Gerar Conteúdo</>
          )}
        </Button>
      </div>

      {resultado && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Resultado</h4>
            <Button size="sm" variant="outline" onClick={copyToClipboard}>
              {copied ? <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </Button>
          </div>

          <ScrollArea className="h-96 border rounded-lg p-4 bg-gray-50">
            <pre className="whitespace-pre-wrap text-sm">{resultado.conteudo}</pre>
          </ScrollArea>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-xs font-semibold mb-1">Meta Title:</p>
            <p className="text-sm">{resultado.meta_title}</p>
            <p className="text-xs font-semibold mt-2 mb-1">Meta Description:</p>
            <p className="text-sm">{resultado.meta_description}</p>
          </div>
        </div>
      )}
    </Card>
  );
}