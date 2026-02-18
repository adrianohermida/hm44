import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function GerarParagrafoIA({ titulo, onParagrafoGerado, categoria }) {
  const [gerando, setGerando] = useState(false);
  const [config, setConfig] = useState({
    min_caracteres: 150,
    max_caracteres: 300,
    tipo_conteudo: 'informativo'
  });

  const gerar = async () => {
    setGerando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `Gere MÚLTIPLOS parágrafos estruturados sobre: "${titulo}"

Contexto: ${categoria}
Caracteres totais: ${config.min_caracteres}-${config.max_caracteres} POR PARÁGRAFO
Tipo: ${config.tipo_conteudo}

ESTRUTURA OBRIGATÓRIA (3-4 parágrafos):
1. INTRODUÇÃO (${config.min_caracteres}-${config.max_caracteres} chars)
   - Apresente o conceito central
   - Contextualize o tema
   
2. DESENVOLVIMENTO (${config.min_caracteres}-${config.max_caracteres} chars cada)
   - Parágrafo 1: Explique aspecto principal
   - Parágrafo 2: Exemplos/dados práticos
   
3. CONCLUSÃO/TRANSIÇÃO (${config.min_caracteres}-${config.max_caracteres} chars)
   - Sintetize pontos-chave
   - Conecte ao próximo tópico

Tom: Profissional, acessível, técnico-jurídico claro
${config.tipo_conteudo === 'educativo' ? 'Didático, com analogias simples' : ''}
${config.tipo_conteudo === 'informativo' ? 'Objetivo, direto, prático' : ''}
${config.tipo_conteudo === 'analitico' ? 'Profundo, argumentado, dados' : ''}
${config.tipo_conteudo === 'critico' ? 'Posicionado, fundamentado' : ''}`,
        response_json_schema: {
          type: "object",
          properties: {
            paragrafos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  texto: { type: "string" },
                  funcao: { type: "string" }
                }
              }
            }
          }
        }
      });

      onParagrafoGerado(resultado.paragrafos);
      toast.success(`${resultado.paragrafos.length} parágrafos gerados!`);
    } catch (error) {
      toast.error('Erro ao gerar parágrafos');
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="space-y-3 p-3 bg-blue-50 rounded border border-blue-200">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-xs">Min. Caracteres</Label>
          <Input
            type="number"
            value={config.min_caracteres}
            onChange={(e) => setConfig(prev => ({ ...prev, min_caracteres: parseInt(e.target.value) }))}
            className="h-8"
          />
        </div>
        <div>
          <Label className="text-xs">Max. Caracteres</Label>
          <Input
            type="number"
            value={config.max_caracteres}
            onChange={(e) => setConfig(prev => ({ ...prev, max_caracteres: parseInt(e.target.value) }))}
            className="h-8"
          />
        </div>
      </div>

      <div>
        <Label className="text-xs">Tipo de Conteúdo</Label>
        <Select value={config.tipo_conteudo} onValueChange={(v) => setConfig(prev => ({ ...prev, tipo_conteudo: v }))}>
          <SelectTrigger className="h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="educativo">Educativo</SelectItem>
            <SelectItem value="informativo">Informativo</SelectItem>
            <SelectItem value="analitico">Analítico</SelectItem>
            <SelectItem value="critico">Crítico</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button onClick={gerar} disabled={gerando} size="sm" className="w-full">
        {gerando ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Sparkles className="w-3 h-3 mr-2" />}
        Gerar Parágrafo
      </Button>
    </div>
  );
}