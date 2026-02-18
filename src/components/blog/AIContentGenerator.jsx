import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function AIContentGenerator({ onGenerate }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Você é um advogado especialista em direito do consumidor e superendividamento. 
        Gere um artigo de blog profissional, educativo e otimizado para SEO sobre: ${prompt}.
        
        O artigo deve:
        - Ter entre 800-1200 palavras
        - Incluir introdução, desenvolvimento e conclusão
        - Citar legislações relevantes (CDC, Lei do Superendividamento)
        - Ser escrito em tom acessível mas profissional
        - Incluir dicas práticas
        - Terminar com CTA para consulta jurídica`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            meta_description: { type: "string" },
            keywords: { type: "array", items: { type: "string" } },
            conteudo: { type: "string" },
            categoria: { type: "string" }
          }
        }
      });
      onGenerate(result);
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Descreva o tema do artigo (ex: Como funciona a Lei do Superendividamento)"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[100px]"
      />
      <Button onClick={handleGenerate} disabled={loading || !prompt}>
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4 mr-2" />
        )}
        {loading ? 'Gerando...' : 'Gerar com IA'}
      </Button>
    </div>
  );
}