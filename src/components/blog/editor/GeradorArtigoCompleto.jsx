import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Wand2, Plus, Replace } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import AIToolCard from './AIToolCard';

export default function GeradorArtigoCompleto({ onAplicarArtigo, onProcessingStart, onProcessingError, artigoAtual = {} }) {
  const [gerando, setGerando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const [titulo, setTitulo] = useState('');
  const [keywords, setKeywords] = useState('');
  const [modo, setModo] = useState('substituir');

  const gerar = async () => {
    if (!titulo.trim()) {
      toast.error('❌ Insira um título');
      return;
    }

    setGerando(true);
    setSucesso(false);
    setErro('');
    onProcessingStart?.();
    
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Gere um artigo COMPLETO sobre: "${titulo}"
Keywords: ${keywords || 'N/A'}

Estruture com:
- Introdução engajadora (2-3 parágrafos)
- 5-7 seções H2 com conteúdo denso (3-4 parágrafos cada)
- Conclusão com CTA
- FAQ com 5 perguntas relevantes

Retorne JSON:
{
  "titulo": "título otimizado SEO",
  "resumo": "150-160 chars",
  "topicos": [
    {"tipo": "h2", "texto": "Introdução"},
    {"tipo": "paragrafo", "texto": "..."},
    ...
  ],
  "meta_description": "meta 150-160 chars",
  "keywords": ["palavra1", "palavra2", ...]
}`,
        response_json_schema: {
          type: "object",
          properties: {
            titulo: { type: "string" },
            resumo: { type: "string" },
            topicos: { type: "array", items: { type: "object" } },
            meta_description: { type: "string" },
            keywords: { type: "array", items: { type: "string" } }
          }
        }
      });

      const topicosComIds = resultado.topicos.map((t, i) => ({
        ...t,
        id: Date.now() + i
      }));

      let topicosFinais = topicosComIds;
      
      // Aplicar modo de inserção
      if (modo === 'adicionar' && artigoAtual?.topicos?.length > 0) {
        topicosFinais = [...artigoAtual.topicos, ...topicosComIds];
      } else if (modo === 'mesclar' && artigoAtual?.topicos?.length > 0) {
        // Preserva introdução existente, adiciona novo conteúdo, preserva conclusão
        const existentes = artigoAtual.topicos;
        const intro = existentes.slice(0, 2);
        const conclusao = existentes.slice(-1);
        topicosFinais = [...intro, ...topicosComIds, ...conclusao];
      }

      onAplicarArtigo({
        titulo: modo === 'substituir' ? resultado.titulo : artigoAtual.titulo || resultado.titulo,
        resumo: resultado.resumo,
        topicos: topicosFinais,
        meta_description: resultado.meta_description,
        keywords: resultado.keywords
      });

      setSucesso(true);
      setTimeout(() => setSucesso(false), 2000);
      setTitulo('');
      setKeywords('');
    } catch (error) {
      setErro(error.message);
      onProcessingError?.();
      toast.error(`❌ ${error.message}`);
    } finally {
      setGerando(false);
    }
  };

  const temConteudoExistente = artigoAtual?.topicos?.length > 0;

  return (
    <AIToolCard
      title="Gerar Artigo Completo"
      description="Crie um artigo do zero com IA ou adicione ao conteúdo existente"
      icon={Wand2}
      isLoading={gerando}
      isSuccess={sucesso}
      isError={!!erro}
      errorMessage={erro}
      action={gerar}
      actionLabel="Gerar Artigo"
      actionIcon={Wand2}
      disabled={!titulo.trim()}
    >
      <div className="space-y-4">
        <div>
          <Label className="text-xs font-medium">Título/Tema</Label>
          <Input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Como negociar dívidas com bancos"
            className="text-sm mt-1"
          />
        </div>
        
        <div>
          <Label className="text-xs font-medium">Keywords (opcional)</Label>
          <Input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="superendividamento, CDC, bancos"
            className="text-sm mt-1"
          />
        </div>

        {temConteudoExistente && (
          <div className="border-t pt-3">
            <Label className="text-xs font-medium mb-2 block">Modo de Aplicação</Label>
            <RadioGroup value={modo} onValueChange={setModo} className="space-y-2">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="substituir" id="substituir" className="mt-0.5" />
                <Label htmlFor="substituir" className="text-xs cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Replace className="w-3 h-3" />
                    <span className="font-medium">Substituir tudo</span>
                  </div>
                  <p className="text-gray-500">Remove conteúdo existente e aplica novo artigo</p>
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="adicionar" id="adicionar" className="mt-0.5" />
                <Label htmlFor="adicionar" className="text-xs cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Plus className="w-3 h-3" />
                    <span className="font-medium">Adicionar ao final</span>
                  </div>
                  <p className="text-gray-500">Mantém conteúdo existente e adiciona novo no final</p>
                </Label>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="mesclar" id="mesclar" className="mt-0.5" />
                <Label htmlFor="mesclar" className="text-xs cursor-pointer">
                  <div className="flex items-center gap-1">
                    <Wand2 className="w-3 h-3" />
                    <span className="font-medium">Mesclar inteligente</span>
                  </div>
                  <p className="text-gray-500">Preserva introdução/conclusão, adiciona conteúdo no meio</p>
                </Label>
              </div>
            </RadioGroup>
          </div>
        )}
      </div>
    </AIToolCard>
  );
}