import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, HelpCircle, Plus } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GeradorFAQ({ titulo, topicos, onAdicionarFAQ }) {
  const [gerando, setGerando] = useState(false);

  const gerar = async () => {
    if (!titulo || topicos.length === 0) {
      toast.error('Artigo precisa ter título e conteúdo');
      return;
    }

    setGerando(true);
    try {
      const conteudo = topicos.map(t => t.texto || '').join('\n\n').substring(0, 3000);

      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Baseado neste artigo: "${titulo}"

Conteúdo: ${conteudo}

Gere 5-7 FAQs altamente relevantes que:
1. Respondam dúvidas comuns dos leitores
2. Usem keywords do artigo
3. Tenham respostas objetivas (2-3 frases)

Retorne JSON:
{
  "faqs": [
    {"pergunta": "...", "resposta": "..."},
    ...
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            faqs: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  pergunta: { type: "string" },
                  resposta: { type: "string" }
                }
              }
            }
          }
        }
      });

      const faqTopicos = [
        { id: Date.now(), tipo: 'h2', texto: 'Perguntas Frequentes (FAQ)' },
        ...resultado.faqs.flatMap((faq, i) => [
          { id: Date.now() + i * 2 + 1, tipo: 'h3', texto: faq.pergunta },
          { id: Date.now() + i * 2 + 2, tipo: 'paragrafo', texto: faq.resposta }
        ])
      ];

      onAdicionarFAQ(faqTopicos);
      toast.success(`✅ ${resultado.faqs.length} FAQs adicionados ao final do artigo`);
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setGerando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-green-600" />
          Gerar FAQ Automático
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-600 mb-3">
          Cria automaticamente perguntas e respostas baseadas no conteúdo do artigo.
        </p>
        <Button onClick={gerar} disabled={gerando} size="sm" className="w-full">
          {gerando ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Plus className="w-3 h-3 mr-2" />}
          Gerar FAQs
        </Button>
      </CardContent>
    </Card>
  );
}