import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image, PieChart, BarChart3, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function GeradorImagensIA({ titulo, topicos, onImagemGerada }) {
  const [gerando, setGerando] = useState(false);
  const [imagemUrl, setImagemUrl] = useState('');
  const [tipo, setTipo] = useState('capa');

  const gerarImagem = async (tipoImagem) => {
    setGerando(true);
    setTipo(tipoImagem);
    
    try {
      let prompt = '';
      
      if (tipoImagem === 'capa') {
        prompt = `Crie uma imagem de capa profissional para artigo jurídico:
Título: "${titulo}"

Estilo: Moderno, profissional, cores neutras com acento azul/verde
Elementos: Martelo, balança, documentos, pessoa profissional
Composição: Clean, minimalista, alta qualidade
Formato: 1200x630px (Open Graph)
Sem texto na imagem.`;
      } else if (tipoImagem === 'infografico') {
        const conteudoResumo = topicos.slice(0, 3).map(t => t.texto).join('. ');
        prompt = `Crie um infográfico visual sobre:
"${titulo}"

Dados: ${conteudoResumo}

Estilo: Infográfico moderno, hierarquia visual clara
Elementos: Ícones, números, setas, fluxogramas
Cores: Azul, verde, laranja para categorias
Layout: Vertical, fácil leitura
Inclua: Título, dados visuais, conclusão`;
      } else if (tipoImagem === 'grafico') {
        prompt = `Crie um gráfico/diagrama visual para:
"${titulo}"

Tipo: Gráfico de pizza ou barras com dados relevantes
Estilo: Profissional, cores corporativas
Elementos: Legendas claras, percentuais, labels
Formato: Quadrado 800x800px
Alta qualidade, minimalista`;
      } else if (tipoImagem === 'topico') {
        const topicoSelecionado = topicos.find(t => t.tipo === 'h2');
        prompt = `Crie uma ilustração para seção do artigo:
Tópico: "${topicoSelecionado?.texto || titulo}"

Estilo: Ilustração conceitual, profissional
Elementos: Ícones, símbolos jurídicos, metáfora visual
Cores: Suaves, profissionais
Formato: 800x600px
Sem texto, apenas visual`;
      }

      const resultado = await base44.integrations.Core.GenerateImage({
        prompt
      });

      setImagemUrl(resultado.url);
      onImagemGerada(resultado.url, tipo);
      toast.success('Imagem gerada com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao gerar imagem');
    } finally {
      setGerando(false);
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
      <div className="flex items-center gap-2 mb-4">
        <Image className="w-5 h-5 text-indigo-600" />
        <h3 className="font-bold text-indigo-900">Gerador de Imagens IA</h3>
      </div>

      <Tabs defaultValue="capa">
        <TabsList className="w-full">
          <TabsTrigger value="capa" className="flex-1">Capa</TabsTrigger>
          <TabsTrigger value="infografico" className="flex-1">Infográfico</TabsTrigger>
          <TabsTrigger value="grafico" className="flex-1">Gráfico</TabsTrigger>
        </TabsList>

        <TabsContent value="capa" className="space-y-3">
          <p className="text-xs text-gray-600">Imagem de capa otimizada para Open Graph (1200x630px)</p>
          <Button
            onClick={() => gerarImagem('capa')}
            disabled={gerando || !titulo}
            className="w-full"
          >
            <Sparkles className={`w-3 h-3 mr-2 ${gerando && tipo === 'capa' ? 'animate-pulse' : ''}`} />
            {gerando && tipo === 'capa' ? 'Gerando...' : 'Gerar Capa'}
          </Button>
        </TabsContent>

        <TabsContent value="infografico" className="space-y-3">
          <p className="text-xs text-gray-600">Infográfico visual baseado no conteúdo do artigo</p>
          <Button
            onClick={() => gerarImagem('infografico')}
            disabled={gerando || topicos.length === 0}
            className="w-full"
            variant="outline"
          >
            <PieChart className={`w-3 h-3 mr-2 ${gerando && tipo === 'infografico' ? 'animate-pulse' : ''}`} />
            {gerando && tipo === 'infografico' ? 'Gerando...' : 'Gerar Infográfico'}
          </Button>
        </TabsContent>

        <TabsContent value="grafico" className="space-y-3">
          <p className="text-xs text-gray-600">Gráfico de dados ou diagrama conceitual</p>
          <Button
            onClick={() => gerarImagem('grafico')}
            disabled={gerando}
            className="w-full"
            variant="outline"
          >
            <BarChart3 className={`w-3 h-3 mr-2 ${gerando && tipo === 'grafico' ? 'animate-pulse' : ''}`} />
            {gerando && tipo === 'grafico' ? 'Gerando...' : 'Gerar Gráfico'}
          </Button>
        </TabsContent>
      </Tabs>

      {imagemUrl && (
        <div className="mt-3">
          <Badge className="bg-green-600 text-white mb-2">Imagem gerada!</Badge>
          <img src={imagemUrl} alt="Gerada por IA" className="w-full rounded-lg border border-indigo-200" />
        </div>
      )}
    </Card>
  );
}