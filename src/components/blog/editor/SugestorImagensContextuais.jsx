import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function SugestorImagensContextuais({ titulo, topicos, onInserirImagem }) {
  const [analisando, setAnalisando] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);
  const [gerando, setGerando] = useState(null);

  const analisar = async () => {
    if (topicos.length === 0) {
      toast.error('Adicione conteúdo ao artigo primeiro');
      return;
    }

    setAnalisando(true);
    try {
      const h2s = topicos.filter(t => t.tipo === 'h2').slice(0, 5);
      
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Artigo: "${titulo}"

Seções H2:
${h2s.map((t, i) => `${i+1}. ${t.texto}`).join('\n')}

Sugira imagens contextuais para 3-4 seções mais relevantes.

Retorne JSON:
{
  "sugestoes": [
    {
      "topicoId": ${h2s[0]?.id || 0},
      "secao": "título H2",
      "prompt": "prompt detalhado para gerar imagem contextual",
      "justificativa": "por que essa imagem é relevante"
    }
  ]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            sugestoes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  topicoId: { type: "number" },
                  secao: { type: "string" },
                  prompt: { type: "string" },
                  justificativa: { type: "string" }
                }
              }
            }
          }
        }
      });

      setSugestoes(resultado.sugestoes);
      toast.success(`✅ ${resultado.sugestoes.length} imagens sugeridas`);
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setAnalisando(false);
    }
  };

  const gerarImagem = async (sugestao) => {
    setGerando(sugestao.topicoId);
    try {
      const { url } = await base44.integrations.Core.GenerateImage({
        prompt: sugestao.prompt
      });

      onInserirImagem(sugestao.topicoId, url, sugestao.secao);
      toast.success('✅ Imagem gerada e inserida!');
      setSugestoes(prev => prev.filter(s => s.topicoId !== sugestao.topicoId));
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setGerando(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-orange-600" />
          Imagens Contextuais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={analisar} disabled={analisando} size="sm" className="w-full">
          {analisando ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <ImageIcon className="w-3 h-3 mr-2" />}
          Sugerir Imagens
        </Button>

        {sugestoes.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sugestoes.map((sug) => (
              <div key={sug.topicoId} className="p-3 bg-gray-50 rounded border">
                <Badge className="mb-2 text-xs">{sug.secao}</Badge>
                <p className="text-xs text-gray-600 mb-2">{sug.justificativa}</p>
                <Button
                  size="sm"
                  onClick={() => gerarImagem(sug)}
                  disabled={gerando !== null}
                  className="w-full"
                >
                  {gerando === sug.topicoId ? (
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3 mr-2" />
                  )}
                  Gerar e Inserir
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}