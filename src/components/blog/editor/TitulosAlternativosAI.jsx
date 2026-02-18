import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function TitulosAlternativosAI({ tituloAtual, categoria, onAplicar }) {
  const [gerando, setGerando] = useState(false);
  const [sugestoes, setSugestoes] = useState([]);

  const gerarSugestoes = async () => {
    if (!tituloAtual) {
      toast.error('Digite um título primeiro');
      return;
    }

    setGerando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `ANÁLISE DO TÍTULO ATUAL:
"${tituloAtual}"
Categoria: ${categoria}

MISSÃO: Gere 5 títulos ALTERNATIVOS otimizados para SEO e CTR.

ESTRATÉGIAS OBRIGATÓRIAS:
1. NÚMEROS: Use dados concretos (Ex: "7 Direitos", "3 Passos", "Até 90%")
2. EMOÇÃO: Gatilhos emocionais (Proteja, Evite, Garanta, Descubra, Recupere)
3. ESPECIFICIDADE: Seja preciso (não "dívidas", mas "dívidas bancárias acima de R$ 10mil")
4. BENEFÍCIO CLARO: O que o leitor GANHA (economia, segurança, rapidez)
5. URGÊNCIA SUTIL: Quando aplicável (2025, Agora, Hoje, Nova Lei)

FÓRMULAS COMPROVADAS:
• "Como [Ação] + [Benefício] + [Timeframe/Facilidade]"
• "[Número] [Formas/Estratégias/Erros] de [Solução] + [Contexto]"
• "[Problema Específico]? Descubra [Solução] + [Resultado]"
• "Guia Completo: [Tópico] para [Público] + [Situação]"
• "[Ação] Sem [Objeção Comum]: [Método/Sistema]"

REQUISITOS TÉCNICOS:
✓ 50-65 caracteres (ideal para SERP)
✓ Palavra-chave no início ou primeiros 30% do título
✓ Capitalização correta (títulos, não frases)
✓ Linguagem jurídica acessível (evite jargões)
✓ CTR estimado >5% para nicho jurídico

EXEMPLOS REFERÊNCIA:
• "7 Direitos do Superendividado que Bancos Escondem de Você"
• "Renegocie Dívidas Bancárias: Guia Completo 2025 [Passo a Passo]"
• "Como Cancelar Cartão com Dívida Sem Prejudicar o CPF"
• "Negativado? 5 Estratégias Jurídicas para Limpar Seu Nome Rápido"
• "Juros Abusivos: Calcule e Recupere Até 90% do Valor Pago"

Retorne JSON com array de 5 títulos variados usando diferentes fórmulas.`,
        response_json_schema: {
          type: "object",
          properties: {
            titulos: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setSugestoes(resultado.titulos || []);
      toast.success('Sugestões avançadas geradas!');
    } catch (error) {
      console.error('Erro ao gerar sugestões:', error);
      toast.error('Erro ao gerar sugestões');
    } finally {
      setGerando(false);
    }
  };

  return (
    <div>
      <Button
        size="sm"
        variant="outline"
        onClick={gerarSugestoes}
        disabled={gerando || !tituloAtual}
        className="mb-2"
      >
        <Sparkles className={`w-3 h-3 mr-1 ${gerando ? 'animate-pulse' : ''}`} />
        {gerando ? 'Gerando...' : 'Sugerir Títulos Alternativos'}
      </Button>

      {sugestoes.length > 0 && (
        <div className="space-y-2 mt-2">
          {sugestoes.map((titulo, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
              <span className="text-xs text-gray-500 mt-1">{i + 1}.</span>
              <p className="flex-1 text-sm">{titulo}</p>
              <Button size="sm" onClick={() => {
                onAplicar(titulo);
                setSugestoes([]);
                toast.success('Título aplicado!');
              }}>
                Usar
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}