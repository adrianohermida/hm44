import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Image, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GerarImagemTopicoIA({ topico, titulo, categoria, onImagemGerada }) {
  const [gerando, setGerando] = useState(false);

  const gerar = async () => {
    setGerando(true);
    try {
      const prompt = `Imagem ilustrativa profissional para artigo jurídico:
"${titulo}"

Contexto: ${categoria}
Estilo: Profissional, clean, moderno
Elementos: Símbolos jurídicos sutis, cores sóbrias
Formato: Paisagem 16:9, alta qualidade`;

      const { url } = await base44.integrations.Core.GenerateImage({
        prompt
      });

      const altResult = await base44.integrations.Core.InvokeLLM({
        prompt: `Gere texto ALT acessível (WCAG) para imagem sobre: "${titulo}"
        
Requisitos:
- Descrever conteúdo visual objetivamente
- 80-120 caracteres
- Incluir contexto jurídico
- Acessível para leitores de tela`,
        response_json_schema: {
          type: "object",
          properties: {
            alt: { type: "string" },
            descricao: { type: "string" }
          }
        }
      });

      // Disparar evento para adicionar imagem após o tópico
      const event = new CustomEvent('adicionarImagemAposTopico', {
        detail: {
          topicoId: topico.id,
          imagemUrl: url,
          altText: altResult.alt
        }
      });
      window.dispatchEvent(event);

      onImagemGerada({
        url,
        alt: altResult.alt,
        descricao: altResult.descricao
      });

      toast.success('Imagem gerada e inserida!');
    } catch (error) {
      toast.error('Erro ao gerar imagem');
    } finally {
      setGerando(false);
    }
  };

  return (
    <Button onClick={gerar} disabled={gerando} size="sm" variant="outline">
      {gerando ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Image className="w-3 h-3 mr-2" />}
      Gerar Imagem
    </Button>
  );
}