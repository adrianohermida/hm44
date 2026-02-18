import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { TestTube, Sparkles, TrendingUp, Target } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function ABTestingAvancado({ artigo }) {
  const [tituloB, setTituloB] = useState(artigo?.titulo_variacao_b || '');
  const [gerandoVariacoes, setGerandoVariacoes] = useState(false);
  const [variacoesSugeridas, setVariacoesSugeridas] = useState([]);
  const queryClient = useQueryClient();

  const atualizarMutation = useMutation({
    mutationFn: (data) => base44.entities.Blog.update(artigo.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-artigo']);
      toast.success('A/B Test atualizado');
    }
  });

  const toggleTeste = (ativo) => {
    if (ativo && !tituloB) {
      toast.error('Defina o Título B primeiro');
      return;
    }
    atualizarMutation.mutate({
      ab_test_ativo: ativo,
      titulo_variacao_b: tituloB
    });
  };

  const gerarVariacoesIA = async () => {
    setGerandoVariacoes(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Gere 3 variações do título otimizadas para A/B testing:

TÍTULO ORIGINAL: "${artigo.titulo}"
CATEGORIA: ${artigo.categoria}
KEYWORDS: ${artigo.keywords?.join(', ')}

Para cada variação, teste diferentes estratégias:
1. Variação com NÚMERO (ex: "7 Dicas")
2. Variação com PERGUNTA (ex: "Como X?")
3. Variação com BENEFÍCIO DIRETO (ex: "Economize até 90%")

Regras:
- 50-65 caracteres
- CTR potencial >5%
- Cada variação DIFERENTE na abordagem
- Palavra-chave mantida

Retorne títulos otimizados para teste.`,
        response_json_schema: {
          type: "object",
          properties: {
            variacoes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  estrategia: { type: "string" },
                  ctr_estimado: { type: "number" }
                }
              }
            }
          }
        }
      });

      setVariacoesSugeridas(resultado.variacoes || []);
      toast.success('Variações geradas!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao gerar variações');
    } finally {
      setGerandoVariacoes(false);
    }
  };

  const calcularCTR = (cliques, visualizacoes) => {
    if (!visualizacoes || visualizacoes === 0) return 0;
    return ((cliques / visualizacoes) * 100).toFixed(2);
  };

  const determinarVencedor = () => {
    const ctrA = parseFloat(calcularCTR(artigo?.ab_cliques_a, artigo?.visualizacoes));
    const ctrB = parseFloat(calcularCTR(artigo?.ab_cliques_b, artigo?.visualizacoes));
    
    if (ctrA === 0 && ctrB === 0) return null;
    if (ctrA > ctrB) return 'A';
    if (ctrB > ctrA) return 'B';
    return 'empate';
  };

  const vencedor = determinarVencedor();

  return (
    <Card className="p-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TestTube className="w-4 h-4 text-purple-600" />
          <Label className="text-purple-900 font-bold">A/B Testing de Títulos</Label>
        </div>
        <Switch
          checked={artigo?.ab_test_ativo || false}
          onCheckedChange={toggleTeste}
        />
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs flex items-center gap-1">
            Título A (Original)
            {vencedor === 'A' && <Badge className="bg-green-600 text-white text-xs ml-2">Vencedor</Badge>}
          </Label>
          <Input value={artigo?.titulo} disabled className="bg-white" />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <Label className="text-xs flex items-center gap-1">
              Título B (Variação)
              {vencedor === 'B' && <Badge className="bg-green-600 text-white text-xs ml-2">Vencedor</Badge>}
            </Label>
            <Button
              size="sm"
              variant="ghost"
              onClick={gerarVariacoesIA}
              disabled={gerandoVariacoes}
              className="h-6 text-xs"
            >
              <Sparkles className={`w-3 h-3 mr-1 ${gerandoVariacoes ? 'animate-pulse' : ''}`} />
              {gerandoVariacoes ? 'Gerando...' : 'Gerar com IA'}
            </Button>
          </div>
          <Input
            value={tituloB}
            onChange={(e) => setTituloB(e.target.value)}
            placeholder="Digite ou gere variação com IA"
            className="bg-white"
          />
          <Button
            size="sm"
            onClick={() => atualizarMutation.mutate({ titulo_variacao_b: tituloB })}
            disabled={!tituloB}
            className="mt-2 w-full"
            variant="outline"
          >
            Salvar Variação B
          </Button>
        </div>

        {variacoesSugeridas.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-purple-900">Variações Sugeridas:</p>
            {variacoesSugeridas.map((variacao, i) => (
              <div key={i} className="p-2 bg-white rounded border border-purple-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{variacao.titulo}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">{variacao.estrategia}</Badge>
                      <span className="text-xs text-gray-600">
                        <Target className="w-3 h-3 inline mr-1" />
                        CTR ~{variacao.ctr_estimado}%
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      setTituloB(variacao.titulo);
                      setVariacoesSugeridas([]);
                    }}
                  >
                    Usar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {artigo?.ab_test_ativo && (
          <div className="pt-3 border-t border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium">Resultados em Tempo Real:</p>
              <TrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className={`bg-white p-3 rounded border-2 ${vencedor === 'A' ? 'border-green-500' : 'border-gray-200'}`}>
                <p className="text-xs text-gray-600 mb-1">Título A</p>
                <p className="text-2xl font-bold">{artigo?.ab_cliques_a || 0}</p>
                <Badge className={`mt-1 ${parseFloat(calcularCTR(artigo?.ab_cliques_a, artigo?.visualizacoes)) > 3 ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                  {calcularCTR(artigo?.ab_cliques_a, artigo?.visualizacoes)}% CTR
                </Badge>
              </div>
              <div className={`bg-white p-3 rounded border-2 ${vencedor === 'B' ? 'border-green-500' : 'border-gray-200'}`}>
                <p className="text-xs text-gray-600 mb-1">Título B</p>
                <p className="text-2xl font-bold">{artigo?.ab_cliques_b || 0}</p>
                <Badge className={`mt-1 ${parseFloat(calcularCTR(artigo?.ab_cliques_b, artigo?.visualizacoes)) > 3 ? 'bg-green-600' : 'bg-gray-600'} text-white`}>
                  {calcularCTR(artigo?.ab_cliques_b, artigo?.visualizacoes)}% CTR
                </Badge>
              </div>
            </div>
            
            {vencedor && vencedor !== 'empate' && (
              <div className="mt-3 p-2 bg-green-50 rounded border border-green-200">
                <p className="text-xs font-medium text-green-900">
                  🏆 Título {vencedor} está performando melhor! 
                  {vencedor === 'B' && ' Considere torná-lo o título principal.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}