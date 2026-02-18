import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function MetaTagsGenerator({ formData, setFormData }) {
  const [copied, setCopied] = useState(null);

  const gerarMetaTagsMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise este artigo e gere meta tags SEO PROFISSIONAIS para RANK #1:

TÍTULO: ${formData.titulo}
CONTEÚDO: ${formData.conteudo?.substring(0, 1000)}

GERE:
1. **meta_description** (150-160 chars EXATOS)
   - Persuasiva, não descritiva
   - Palavra-chave nos primeiros 120 chars
   - CTA claro
   - Benefit-driven

2. **keywords** (10-15 palavras-chave)
   - 3 primárias (alto volume)
   - 5 LSI (Latent Semantic Indexing)
   - 4-7 long-tail (baixa concorrência)
   - Incluir variações e sinônimos

3. **og:title** (60-70 chars)
   - Mais emocional que o title normal
   - Otimizado para compartilhamento social

4. **og:description** (120-150 chars)
   - Diferente da meta_description
   - Focado em curiosidade/urgência

5. **twitter_card_title** (70 chars)
   - Formato Twitter-friendly
   - Incluir emoji estratégico

CONTEXTO: Direito do Consumidor, Brasil, tom profissional mas acessível.
OBJETIVO: CTR máximo + Conformidade Google + Rich Snippets.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            meta_description: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            og_title: { type: "string" },
            og_description: { type: "string" },
            twitter_card_title: { type: "string" }
          }
        }
      });
      return response;
    },
    onSuccess: (data) => {
      setFormData({
        ...formData,
        meta_description: data.meta_description,
        keywords: data.keywords,
        og_title: data.og_title,
        og_description: data.og_description,
        twitter_title: data.twitter_card_title
      });
      toast.success("Meta tags + Open Graph geradas!");
    }
  });

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
    toast.success("Copiado!");
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Meta Tags Automáticas
          </h3>
          <p className="text-sm text-gray-600">Otimização SEO com IA</p>
        </div>
        <Button
          onClick={() => gerarMetaTagsMutation.mutate()}
          disabled={!formData.titulo || !formData.conteudo || gerarMetaTagsMutation.isPending}
          variant="outline"
          size="sm"
        >
          {gerarMetaTagsMutation.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" />Gerar com IA</>
          )}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <Label>Meta Description (150-160 chars)</Label>
            <span className={`text-xs ${
              (formData.meta_description?.length || 0) >= 150 && 
              (formData.meta_description?.length || 0) <= 160 
                ? 'text-green-600' 
                : 'text-orange-600'
            }`}>
              {formData.meta_description?.length || 0}/160
            </span>
          </div>
          <div className="relative">
            <Textarea
              placeholder="Descrição otimizada para resultados de busca..."
              value={formData.meta_description || ""}
              onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
              maxLength={160}
              className="pr-10"
            />
            {formData.meta_description && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => copyToClipboard(formData.meta_description, 'meta_desc')}
              >
                {copied === 'meta_desc' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        <div>
          <Label>Keywords (separadas por vírgula)</Label>
          <Input
            placeholder="superendividamento, negociação de dívidas, Lei 14.181..."
            value={formData.keywords?.join(", ") || ""}
            onChange={(e) => setFormData({
              ...formData, 
              keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean)
            })}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.keywords?.length || 0} palavras-chave
          </p>
        </div>

        {formData.keywords?.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg border">
            {formData.keywords.map((keyword, i) => (
              <span key={i} className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}