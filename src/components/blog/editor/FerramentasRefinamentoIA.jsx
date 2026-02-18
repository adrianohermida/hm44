import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Sparkles, RefreshCw, Plus, Minus, Shield, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function FerramentasRefinamentoIA({ texto, onTextoRefinado }) {
  const [processando, setProcessando] = useState(false);
  const [acao, setAcao] = useState(null);

  const refinar = async (tipo) => {
    if (!texto || texto.length < 10) {
      toast.error('Texto muito curto');
      return;
    }

    setAcao(tipo);
    setProcessando(true);

    try {
      let prompt = '';

      switch (tipo) {
        case 'reescrever':
          prompt = `Reescreva este trecho mantendo o significado mas com palavras diferentes e estrutura variada:

"${texto}"

Requisitos:
- Manter tom profissional jurídico
- Preservar informações técnicas
- Melhorar clareza
- Evitar clichês`;
          break;

        case 'expandir':
          prompt = `Expanda este trecho adicionando detalhes, exemplos e explicações:

"${texto}"

Adicione:
- Exemplos práticos
- Detalhes técnicos relevantes
- Contexto adicional
- Argumentação mais profunda

Manter tom profissional. Expandir para ~2x o tamanho original.`;
          break;

        case 'resumir':
          prompt = `Resuma este trecho mantendo apenas o essencial:

"${texto}"

Requisitos:
- Manter pontos-chave
- Remover redundâncias
- Linguagem concisa
- ~50% do tamanho original`;
          break;

        case 'plagio':
          prompt = `Analise este texto para riscos de plágio:

"${texto}"

Avalie:
1. Nível originalidade (0-100)
2. Frases muito genéricas/comuns
3. Possíveis clichês jurídicos
4. Recomendações para tornar único

Retorne análise estruturada.`;
          break;
      }

      if (tipo === 'plagio') {
        const analise = await base44.integrations.Core.InvokeLLM({
          prompt,
          response_json_schema: {
            type: "object",
            properties: {
              originalidade: { type: "number" },
              risco: { type: "string" },
              frases_genericas: { type: "array", items: { type: "string" } },
              recomendacoes: { type: "array", items: { type: "string" } }
            }
          }
        });

        // Mostrar análise sem modificar texto
        const msg = `Originalidade: ${analise.originalidade}%\nRisco: ${analise.risco}\n\nFrases genéricas: ${analise.frases_genericas?.length || 0}\n\nRecomendações:\n${analise.recomendacoes?.join('\n') || 'Nenhuma'}`;
        toast.info(msg, { duration: 10000 });
        
        setProcessando(false);
        setAcao(null);
        return;
      }

      const resultado = await base44.integrations.Core.InvokeLLM({ prompt });
      
      onTextoRefinado(resultado.trim());
      toast.success('Texto refinado!');
    } catch (error) {
      toast.error('Erro ao refinar');
    } finally {
      setProcessando(false);
      setAcao(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          size="sm" 
          variant="ghost"
          className="h-7 px-2"
          disabled={processando}
        >
          {processando ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3 text-purple-600" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        <div className="space-y-1">
          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => refinar('reescrever')}
            disabled={processando}
          >
            <RefreshCw className="w-3 h-3 mr-2" />
            {acao === 'reescrever' && processando ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              'Reescrever'
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => refinar('expandir')}
            disabled={processando}
          >
            <Plus className="w-3 h-3 mr-2" />
            {acao === 'expandir' && processando ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              'Expandir'
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => refinar('resumir')}
            disabled={processando}
          >
            <Minus className="w-3 h-3 mr-2" />
            {acao === 'resumir' && processando ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              'Resumir'
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            className="w-full justify-start"
            onClick={() => refinar('plagio')}
            disabled={processando}
          >
            <Shield className="w-3 h-3 mr-2" />
            {acao === 'plagio' && processando ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              'Verificar Plágio'
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}