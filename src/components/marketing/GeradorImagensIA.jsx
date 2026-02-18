import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Image, Loader2, Download, Copy } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const ESTILOS_PRESET = {
  blog_juridico: "Imagem profissional, fotografia editorial, ambiente de escritório moderno, tons de azul e cinza, iluminação natural suave, ultra realista, 8K",
  social_media: "Design gráfico moderno, minimalista, cores vibrantes, composição balanceada, tipografia clean, estilo corporativo premium",
  infografico: "Infográfico vetorial, flat design, ícones minimalistas, hierarquia visual clara, paleta corporativa",
  ilustracao: "Ilustração digital profissional, estilo editorial, cores sólidas, composição dinâmica"
};

export default function GeradorImagensIA({ onImageGenerated }) {
  const [descricao, setDescricao] = useState("");
  const [estilo, setEstilo] = useState("blog_juridico");
  const [imagemGerada, setImagemGerada] = useState(null);

  const gerarMutation = useMutation({
    mutationFn: async () => {
      const promptCompleto = `${descricao}. 
      
Estilo: ${ESTILOS_PRESET[estilo]}

CONTEXTO: Direito do Consumidor, escritório de advocacia brasileiro, profissionalismo, confiança, autoridade jurídica.

OBRIGATÓRIO:
- Sem texto visível na imagem
- Composição profissional
- Adequado para publicação corporativa
- Resolução alta (1920x1080 mínimo)`;

      const response = await base44.integrations.Core.GenerateImage({
        prompt: promptCompleto
      });

      return response.url;
    },
    onSuccess: (url) => {
      setImagemGerada(url);
      if (onImageGenerated) onImageGenerated(url);
      toast.success("Imagem gerada!");
    }
  });

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-5 h-5 text-purple-600" />
        <h3 className="font-bold text-lg">Gerador de Imagens IA</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label>Descrição da Imagem</Label>
          <Textarea
            placeholder="Ex: advogado consultando cliente em escritório moderno, balança da justiça sobre mesa de madeira..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows={4}
          />
        </div>

        <div>
          <Label>Estilo Pré-definido</Label>
          <Select value={estilo} onValueChange={setEstilo}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="blog_juridico">Blog Jurídico (Fotografia Real)</SelectItem>
              <SelectItem value="social_media">Redes Sociais (Design Gráfico)</SelectItem>
              <SelectItem value="infografico">Infográfico (Flat Design)</SelectItem>
              <SelectItem value="ilustracao">Ilustração Editorial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={() => gerarMutation.mutate()}
          disabled={!descricao || gerarMutation.isPending}
          className="w-full bg-purple-600"
        >
          {gerarMutation.isPending ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Gerando (5-10s)...</>
          ) : (
            <><Image className="w-4 h-4 mr-2" />Gerar Imagem</>
          )}
        </Button>

        {imagemGerada && (
          <div className="space-y-3">
            <img 
              src={imagemGerada} 
              alt="Imagem gerada" 
              className="w-full rounded-lg border"
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(imagemGerada);
                  toast.success("URL copiada!");
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar URL
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(imagemGerada, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}