import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

const templates = {
  meta_tags: {
    homepage: "Meta tags SEO otimizadas para homepage",
    blog: "Meta tags SEO otimizadas para blog post",
    produto: "Meta tags SEO otimizadas para página de produto"
  },
  social: {
    instagram: "Legenda engajante para Instagram",
    twitter: "Thread viral para Twitter/X",
    linkedin: "Post profissional para LinkedIn",
    quora: "Resposta detalhada para Quora"
  },
  ads: {
    google: "Anúncio otimizado para Google Ads",
    facebook: "Copy persuasivo para Facebook Ads",
    linkedin: "Anúncio B2B para LinkedIn Ads"
  }
};

export default function RedatorIA2() {
  const [palavraChave, setPalavraChave] = useState("");
  const [categoria, setCategoria] = useState("meta_tags");
  const [template, setTemplate] = useState("homepage");
  const [quantidade, setQuantidade] = useState(1);
  const [resultado, setResultado] = useState(null);

  const gerarMutation = useMutation({
    mutationFn: async (config) => {
      const prompt = construirPrompt(config);
      const response = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true
      });
      return response;
    },
    onSuccess: (data) => {
      setResultado(data);
      toast.success("Conteúdo gerado!");
    }
  });

  const construirPrompt = (config) => {
    const { palavraChave, categoria, template, quantidade } = config;
    
    const prompts = {
      meta_tags: {
        homepage: `Crie ${quantidade} conjunto(s) de meta tags SEO otimizadas para uma homepage de escritório de advocacia especializado em "${palavraChave}". 
Inclua: title (60 chars), meta description (155 chars), keywords (10 palavras), og:title, og:description.
Foco em CTR alto e conformidade Google.`,
        
        blog: `Crie ${quantidade} conjunto(s) de meta tags SEO para um artigo de blog sobre "${palavraChave}".
Inclua: title otimizado (60 chars), meta description persuasiva (155 chars), keywords LSI (10 palavras).`,
        
        produto: `Crie ${quantidade} conjunto(s) de meta tags SEO para uma página de serviço jurídico sobre "${palavraChave}".
Inclua: title comercial (60 chars), meta description com CTA (155 chars), keywords transacionais.`
      },
      
      social: {
        instagram: `Crie ${quantidade} legenda(s) para Instagram sobre "${palavraChave}" para escritório de advocacia.
Tom: profissional mas acessível. Inclua: texto engajante, call-to-action, 5 hashtags relevantes.`,
        
        twitter: `Crie ${quantidade} thread(s) para Twitter/X sobre "${palavraChave}" (direito).
Formato: 5-7 tweets conectados, tom educativo, incluir estatísticas se possível.`,
        
        linkedin: `Crie ${quantidade} post(s) para LinkedIn sobre "${palavraChave}" para advogados.
Tom: profissional, insights valiosos, formato storytelling, 800-1200 caracteres.`,
        
        quora: `Crie ${quantidade} resposta(s) detalhada(s) para Quora sobre "${palavraChave}" (direito).
Tom: educativo e autoridade, 500-800 palavras, incluir exemplos práticos.`
      },
      
      ads: {
        google: `Crie ${quantidade} anúncio(s) para Google Ads sobre "${palavraChave}" (serviços jurídicos).
Formato: Título 1 (30 chars), Título 2 (30 chars), Título 3 (30 chars), Descrição 1 (90 chars), Descrição 2 (90 chars).
Foco: alta conversão, USPs claros.`,
        
        facebook: `Crie ${quantidade} copy(s) para Facebook Ads sobre "${palavraChave}" (advocacia).
Formato: Headline (40 chars), Primary text (125 chars), CTA claro.
Tom: persuasivo mas profissional.`,
        
        linkedin: `Crie ${quantidade} anúncio(s) B2B para LinkedIn Ads sobre "${palavraChave}" (serviços jurídicos).
Formato: Headline (70 chars), Description (150 chars), foco em ROI e autoridade.`
      }
    };

    return prompts[categoria][template];
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-6 h-6 text-[var(--brand-primary)]" />
          <h2 className="text-2xl font-bold">Redator IA 2.0</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Palavra-chave ou Tema</Label>
            <Input
              placeholder="Ex: superendividamento, direito do consumidor"
              value={palavraChave}
              onChange={(e) => setPalavraChave(e.target.value)}
            />
          </div>

          <Tabs value={categoria} onValueChange={setCategoria}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="meta_tags">Meta Tags SEO</TabsTrigger>
              <TabsTrigger value="social">Mídias Sociais</TabsTrigger>
              <TabsTrigger value="ads">Anúncios Pagos</TabsTrigger>
            </TabsList>

            <TabsContent value="meta_tags" className="space-y-3">
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(templates.meta_tags).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>

            <TabsContent value="social" className="space-y-3">
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(templates.social).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>

            <TabsContent value="ads" className="space-y-3">
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(templates.ads).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TabsContent>
          </Tabs>

          <div>
            <Label>Quantidade de variações</Label>
            <Input
              type="number"
              min="1"
              max="5"
              value={quantidade}
              onChange={(e) => setQuantidade(parseInt(e.target.value))}
            />
          </div>

          <Button
            onClick={() => gerarMutation.mutate({ palavraChave, categoria, template, quantidade })}
            disabled={!palavraChave || gerarMutation.isPending}
            className="w-full bg-[var(--brand-primary)]"
          >
            {gerarMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" />Gerar Conteúdo</>
            )}
          </Button>
        </div>
      </Card>

      {resultado && (
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Resultado Gerado</h3>
          <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap">
            {resultado}
          </div>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              navigator.clipboard.writeText(resultado);
              toast.success("Copiado!");
            }}
          >
            Copiar para Área de Transferência
          </Button>
        </Card>
      )}
    </div>
  );
}