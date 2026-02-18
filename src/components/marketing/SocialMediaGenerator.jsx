import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Instagram, Twitter, Linkedin, MessageSquare, Facebook, Loader2, Copy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const PLATAFORMAS = [
  { id: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-600" },
  { id: "twitter", label: "Twitter/X", icon: Twitter, color: "text-blue-500" },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, color: "text-blue-700" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-600" },
  { id: "quora", label: "Quora", icon: MessageSquare, color: "text-red-600" }
];

export default function SocialMediaGenerator() {
  const [topico, setTopico] = useState("");
  const [posts, setPosts] = useState(null);

  const gerarMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `SOCIAL MEDIA CONTENT - Multicanal

TÓPICO: ${topico}
NICHO: Direito Consumidor + Superendividamento Brasil
OBJETIVO: Engajamento + Educação + Conversão

Gerar 5 posts otimizados:

1. INSTAGRAM
   - Caption: 150-200 chars (hook forte)
   - Hashtags: 10-15 (mix popular + nicho)
   - CTA: Comentário/DM/Link bio
   - Sugestão visual: Tipo de imagem/carrossel

2. TWITTER/X
   - Thread: 3-5 tweets (280 chars cada)
   - Hook tweet 1: Curiosidade/estatística
   - Tweets 2-4: Value bombs
   - Tweet final: CTA + Link
   - Hashtags: 2-3 relevantes

3. LINKEDIN
   - Post: 300-500 palavras
   - Tom: Profissional + Storytelling
   - Estrutura: Hook > Contexto > Insights > CTA
   - Primeira linha: CRÍTICA (80 chars)
   - Emojis estratégicos (3-5 no máximo)

4. FACEBOOK
   - Post: 200-300 palavras
   - Tom: Conversacional + Emocional
   - Hook: Pergunta/afirmação polêmica
   - Parágrafos curtos (2-3 linhas)
   - CTA: Comentar experiência

5. QUORA
   - Resposta: 400-600 palavras
   - Tom: Autoridade + Didático
   - Estrutura: Resposta direta > Explicação > Exemplo prático
   - Links internos: 2-3 subtis
   - CTA: Consulta gratuita

Gatilhos: Prova social, Urgência, Curiosidade, Autoridade`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            instagram: { 
              type: "object", 
              properties: {
                caption: { type: "string" },
                hashtags: { type: "array", items: { type: "string" } },
                cta: { type: "string" },
                visual: { type: "string" }
              }
            },
            twitter: {
              type: "object",
              properties: {
                thread: { type: "array", items: { type: "string" } },
                hashtags: { type: "array", items: { type: "string" } }
              }
            },
            linkedin: {
              type: "object",
              properties: {
                post: { type: "string" },
                primeira_linha: { type: "string" }
              }
            },
            facebook: {
              type: "object",
              properties: {
                post: { type: "string" }
              }
            },
            quora: {
              type: "object",
              properties: {
                resposta: { type: "string" }
              }
            }
          }
        }
      });
      return response;
    },
    onSuccess: (data) => {
      setPosts(data);
      toast.success("Posts gerados para 5 plataformas!");
    }
  });

  const copyPost = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Copiado!");
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Instagram className="w-5 h-5 text-pink-600" />
        <h3 className="font-bold text-lg">Social Media Content</h3>
      </div>

      <div className="space-y-4 mb-4">
        <Textarea
          placeholder="Tópico ou notícia para transformar em posts..."
          value={topico}
          onChange={(e) => setTopico(e.target.value)}
          rows={3}
        />

        <Button
          onClick={() => gerarMutation.mutate()}
          disabled={!topico || gerarMutation.isPending}
          className="w-full"
        >
          {gerarMutation.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando 5 Posts...</>
          ) : (
            <>Gerar Posts Multicanal</>
          )}
        </Button>
      </div>

      {posts && (
        <Tabs defaultValue="instagram">
          <TabsList className="grid grid-cols-5 w-full">
            {PLATAFORMAS.map(p => (
              <TabsTrigger key={p.id} value={p.id}>
                <p.icon className={`w-4 h-4 ${p.color}`} />
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="instagram" className="space-y-3">
            <div className="p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
              <p className="text-sm mb-2">{posts.instagram.caption}</p>
              <div className="flex flex-wrap gap-1 mb-2">
                {posts.instagram.hashtags.map((h, i) => (
                  <Badge key={i} variant="outline" className="text-xs">#{h}</Badge>
                ))}
              </div>
              <p className="text-xs text-gray-600"><strong>CTA:</strong> {posts.instagram.cta}</p>
              <p className="text-xs text-gray-600"><strong>Visual:</strong> {posts.instagram.visual}</p>
              <Button size="sm" variant="outline" className="mt-2" onClick={() => copyPost(posts.instagram.caption)}>
                <Copy className="w-3 h-3 mr-2" />Copiar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="twitter" className="space-y-2">
            {posts.twitter.thread.map((tweet, i) => (
              <div key={i} className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm mb-2">{i + 1}/{posts.twitter.thread.length} {tweet}</p>
                <Button size="sm" variant="outline" onClick={() => copyPost(tweet)}>
                  <Copy className="w-3 h-3 mr-2" />Copiar Tweet
                </Button>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="linkedin">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-600 mb-2"><strong>Primeira linha (crítica):</strong></p>
              <p className="text-sm font-medium mb-3">{posts.linkedin.primeira_linha}</p>
              <p className="text-sm whitespace-pre-wrap">{posts.linkedin.post}</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => copyPost(posts.linkedin.post)}>
                <Copy className="w-3 h-3 mr-2" />Copiar Post
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="facebook">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{posts.facebook.post}</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => copyPost(posts.facebook.post)}>
                <Copy className="w-3 h-3 mr-2" />Copiar Post
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="quora">
            <div className="p-4 bg-red-50 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{posts.quora.resposta}</p>
              <Button size="sm" variant="outline" className="mt-3" onClick={() => copyPost(posts.quora.resposta)}>
                <Copy className="w-3 h-3 mr-2" />Copiar Resposta
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </Card>
  );
}