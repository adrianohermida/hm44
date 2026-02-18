import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Target, Loader2, Copy, DollarSign } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AdCopyGenerator() {
  const [oferta, setOferta] = useState("");
  const [publicoAlvo, setPublicoAlvo] = useState("");
  const [orcamento, setOrcamento] = useState("");
  const [anuncios, setAnuncios] = useState(null);

  const gerarMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `AD COPY PROFISSIONAL - Campanha Multicanal

OFERTA: ${oferta}
PÚBLICO: ${publicoAlvo}
ORÇAMENTO: R$ ${orcamento}/mês

Criar anúncios otimizados para:

1. GOOGLE ADS (Search)
   - 3 Títulos (30 chars cada)
   - 2 Descrições (90 chars cada)
   - Keywords: 10-15 (broad + phrase + exact)
   - Extensions: Sitelinks (4), Callouts (4)
   - CPC estimado: R$ X,XX
   - Quality Score esperado: 8-10

2. GOOGLE ADS (Display/YouTube)
   - Headline: 25 chars (impacto visual)
   - Long headline: 90 chars
   - Description: 90 chars
   - Sugestão visual: Tipo imagem/vídeo
   - CTA: Texto botão

3. FACEBOOK/INSTAGRAM ADS
   - Headline primário: 40 chars
   - Texto primário: 125 chars (hook forte)
   - Descrição: 30 chars
   - CTA: Tipo botão
   - Targeting: Interesses (10)
   - Placement: Feed/Stories/Reels

4. LINKEDIN ADS
   - Headline: 70 chars (profissional)
   - Intro text: 150 chars
   - CTA: Ação específica
   - Targeting: Job titles, indústrias

OTIMIZAÇÕES:
- Keywords negativas (5-10)
- Gatilhos mentais: Urgência, Prova social, Autoridade
- Compliance: OAB, CDC, ética publicitária
- A/B Test: 2 variações de headline

NICHO: Direito Consumidor Brasil
CONVERSÃO META: 3-5%`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            google_search: {
              type: "object",
              properties: {
                titulos: { type: "array", items: { type: "string" } },
                descricoes: { type: "array", items: { type: "string" } },
                keywords: { type: "array", items: { type: "string" } },
                sitelinks: { type: "array", items: { type: "string" } },
                cpc_estimado: { type: "number" }
              }
            },
            google_display: {
              type: "object",
              properties: {
                headline: { type: "string" },
                long_headline: { type: "string" },
                description: { type: "string" },
                visual: { type: "string" },
                cta: { type: "string" }
              }
            },
            facebook: {
              type: "object",
              properties: {
                headline: { type: "string" },
                texto_primario: { type: "string" },
                descricao: { type: "string" },
                cta: { type: "string" },
                targeting: { type: "array", items: { type: "string" } }
              }
            },
            linkedin: {
              type: "object",
              properties: {
                headline: { type: "string" },
                intro_text: { type: "string" },
                cta: { type: "string" },
                targeting: { type: "array", items: { type: "string" } }
              }
            },
            keywords_negativas: { type: "array", items: { type: "string" } }
          }
        }
      });
      return response;
    },
    onSuccess: (data) => {
      setAnuncios(data);
      toast.success("Anúncios gerados para 4 plataformas!");
    }
  });

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-green-600" />
        <h3 className="font-bold text-lg">Ad Copy Generator</h3>
      </div>

      <div className="space-y-4 mb-4">
        <Input
          placeholder="Oferta (ex: Consulta Gratuita Superendividamento)"
          value={oferta}
          onChange={(e) => setOferta(e.target.value)}
        />
        <Input
          placeholder="Público-alvo (ex: Endividados 35-55 anos, classe C)"
          value={publicoAlvo}
          onChange={(e) => setPublicoAlvo(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Orçamento mensal (R$)"
          value={orcamento}
          onChange={(e) => setOrcamento(e.target.value)}
        />

        <Button
          onClick={() => gerarMutation.mutate()}
          disabled={!oferta || !publicoAlvo || gerarMutation.isPending}
          className="w-full bg-green-600"
        >
          {gerarMutation.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando Campanha...</>
          ) : (
            <><Target className="w-4 h-4 mr-2" />Gerar Anúncios</>
          )}
        </Button>
      </div>

      {anuncios && (
        <div className="space-y-6">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-bold mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Google Ads - Search
            </h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold mb-1">Títulos:</p>
                {anuncios.google_search.titulos.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white rounded mb-1">
                    <span className="text-sm">{t}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyText(t)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">Descrições:</p>
                {anuncios.google_search.descricoes.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-white rounded mb-1">
                    <span className="text-sm">{d}</span>
                    <Button size="sm" variant="ghost" onClick={() => copyText(d)}>
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">CPC Estimado: R$ {anuncios.google_search.cpc_estimado.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
            <h4 className="font-bold mb-3">Facebook/Instagram Ads</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Headline:</strong> {anuncios.facebook.headline}</p>
              <p><strong>Texto:</strong> {anuncios.facebook.texto_primario}</p>
              <p><strong>CTA:</strong> {anuncios.facebook.cta}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {anuncios.facebook.targeting.map((t, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{t}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-bold mb-3">LinkedIn Ads</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Headline:</strong> {anuncios.linkedin.headline}</p>
              <p><strong>Intro:</strong> {anuncios.linkedin.intro_text}</p>
              <p><strong>CTA:</strong> {anuncios.linkedin.cta}</p>
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="font-bold mb-2 text-red-800">Keywords Negativas</h4>
            <div className="flex flex-wrap gap-1">
              {anuncios.keywords_negativas.map((kw, i) => (
                <Badge key={i} variant="destructive" className="text-xs">-{kw}</Badge>
              ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}