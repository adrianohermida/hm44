import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function ImageAltGenerator({ imagemUrl, altAtual, onChange }) {
  const [gerando, setGerando] = useState(false);
  const [altText, setAltText] = useState(altAtual || '');

  const gerarAlt = async () => {
    if (!imagemUrl) {
      toast.error('Adicione a URL da imagem primeiro');
      return;
    }

    setGerando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Analise esta imagem e gere um texto ALT otimizado para SEO e acessibilidade.

URL da imagem: ${imagemUrl}

Regras para ALT text perfeito:
- Descreva objetivamente o conteúdo visual
- Máximo 125 caracteres
- Inclua contexto jurídico/negócio se relevante
- Use linguagem natural e clara
- Sem "imagem de" ou "foto de"

Exemplo BOM: "Advogada analisando documentos de renegociação de dívidas em escritório moderno"
Exemplo RUIM: "Foto de uma pessoa trabalhando"

Retorne APENAS o texto ALT, sem aspas.`,
        file_urls: [imagemUrl]
      });

      const alt = resultado.trim().substring(0, 125);
      setAltText(alt);
      onChange(alt);
      toast.success('ALT gerado!');
    } catch (error) {
      console.error('Erro ao gerar ALT:', error);
      toast.error('Erro ao gerar descrição');
    } finally {
      setGerando(false);
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center gap-2 mb-3">
        <ImageIcon className="w-4 h-4 text-purple-600" />
        <Label className="text-purple-900">Descrição da Imagem (ALT)</Label>
      </div>
      
      <Input
        value={altText}
        onChange={(e) => {
          setAltText(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Descrição para acessibilidade e SEO"
        className="mb-2"
      />

      <Button
        size="sm"
        variant="outline"
        onClick={gerarAlt}
        disabled={gerando || !imagemUrl}
        className="w-full border-purple-200 hover:bg-purple-100"
      >
        <Sparkles className={`w-3 h-3 mr-2 ${gerando ? 'animate-pulse' : ''}`} />
        {gerando ? 'Analisando imagem...' : 'Gerar ALT com IA'}
      </Button>

      {altText && (
        <p className="text-xs text-purple-600 mt-2">
          {altText.length}/125 caracteres
        </p>
      )}
    </Card>
  );
}