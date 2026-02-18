import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function SlugGeneratorAI({ titulo, slugAtual, palavraChave, onChange }) {
  const [gerando, setGerando] = useState(false);
  const [score, setScore] = useState(0);

  const gerarSlug = async () => {
    if (!titulo) {
      toast.error('Digite um título primeiro');
      return;
    }

    setGerando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Gere um slug SEO-otimizado para o artigo com título: "${titulo}"
        
Palavra-chave principal: ${palavraChave || 'não definida'}

Regras:
- Apenas letras minúsculas, números e hífens
- 3-6 palavras (máximo 60 caracteres)
- Incluir palavra-chave no início se possível
- Remover stopwords (o, a, de, para, com, etc)
- Descritivo e claro

Retorne APENAS o slug, sem explicações.`,
      });

      const novoSlug = resultado.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      const baseUrl = 'https://hermidamaia.adv.br';
      const urlCanonica = `${baseUrl}/blog/${novoSlug}`;
      
      onChange(novoSlug, urlCanonica);
      
      const novoScore = calcularScore(novoSlug, palavraChave);
      setScore(novoScore);
      
      toast.success(`✨ Slug gerado! Score: ${novoScore}/100`);
    } catch (error) {
      console.error('Erro ao gerar slug:', error);
      toast.error('Erro ao gerar slug');
    } finally {
      setGerando(false);
    }
  };

  const calcularScore = (slug, keyword) => {
    if (!slug) return 0;
    let points = 0;
    if (slug.length >= 3 && slug.length <= 60) points += 30;
    if (keyword && slug.includes(keyword.toLowerCase().replace(/\s+/g, '-'))) points += 40;
    if (!/[^a-z0-9-]/.test(slug)) points += 20;
    if (slug.split('-').length >= 3 && slug.split('-').length <= 6) points += 10;
    return points;
  };

  React.useEffect(() => {
    setScore(calcularScore(slugAtual, palavraChave));
  }, [slugAtual, palavraChave]);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <Label>Slug SEO</Label>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {score}/100
          </span>
          <Button size="sm" variant="outline" onClick={gerarSlug} disabled={gerando || !titulo}>
            <RefreshCw className={`w-3 h-3 mr-1 ${gerando ? 'animate-spin' : ''}`} />
            {gerando ? 'Gerando...' : 'Gerar'}
          </Button>
        </div>
      </div>
      <Input
        value={slugAtual}
        onChange={(e) => {
          const slug = e.target.value;
          const baseUrl = 'https://hermidamaia.adv.br';
          const urlCanonica = `${baseUrl}/blog/${slug}`;
          onChange(slug, urlCanonica);
        }}
        placeholder="url-amigavel-seo"
      />
      <div className="mt-2 space-y-1 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          {slugAtual.length >= 3 && slugAtual.length <= 60 ? <Check className="w-3 h-3 text-green-600" /> : <span className="w-3 h-3 text-red-600">✗</span>}
          Tamanho ideal (3-60 caracteres)
        </div>
        <div className="flex items-center gap-2">
          {palavraChave && slugAtual.includes(palavraChave.toLowerCase().replace(/\s+/g, '-')) ? <Check className="w-3 h-3 text-green-600" /> : <span className="w-3 h-3 text-yellow-600">⚠</span>}
          Contém palavra-chave
        </div>
        <div className="flex items-center gap-2">
          {!/[^a-z0-9-]/.test(slugAtual) ? <Check className="w-3 h-3 text-green-600" /> : <span className="w-3 h-3 text-red-600">✗</span>}
          Apenas letras, números e hífens
        </div>
      </div>
    </Card>
  );
}