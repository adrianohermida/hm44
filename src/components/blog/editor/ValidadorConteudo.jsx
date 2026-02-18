import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function ValidadorConteudo({ titulo, topicos = [], onValidado }) {
  const [validando, setValidando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const validar = async () => {
    const conteudo = (topicos || []).map(t => t.texto || (t.itens || []).join(' ')).join(' ');
    
    if (!conteudo || conteudo.length < 100) {
      toast.error('Conteúdo muito curto para validar');
      return;
    }

    setValidando(true);
    try {
      // Buscar fontes confiáveis para validação
      const escritorios = await base44.entities.Escritorio.list();
      const fontes = await base44.entities.FonteConfiavel.filter({
        escritorio_id: escritorios[0]?.id,
        ativo: true,
        usar_em_ia: true
      });

      const contextoFontes = fontes.length > 0 
        ? `\n\nFONTES CONFIÁVEIS PARA VALIDAÇÃO:\n${fontes.map(f => `- ${f.nome} (${f.tipo}): ${f.url_base}`).join('\n')}`
        : '';

      const validacao = await base44.integrations.Core.InvokeLLM({
        prompt: `VALIDAR CONTEÚDO JURÍDICO

TÍTULO: ${titulo}
CONTEÚDO: ${conteudo.substring(0, 3000)}${contextoFontes}

ANÁLISE OBRIGATÓRIA:
1. VERACIDADE: Há afirmações sem fundamento legal? (use as fontes confiáveis acima para verificar)
2. JURISPRUDÊNCIA: Cita decisões reais ou inventadas? (verifique nas fontes confiáveis)
3. LEGISLAÇÃO: Menciona leis/artigos corretos?
4. FAKE NEWS: Há desinformação ou exageros?
5. AUTORIDADE: Tom profissional adequado?

Se identificar citações de jurisprudências ou leis, verifique se correspondem a dados reais nas fontes confiáveis.

Retorne JSON:
{
  "score_confiabilidade": 0-100,
  "alertas": [
    {
      "nivel": "critico|alerta|info",
      "mensagem": "descrição",
      "sugestao": "como corrigir",
      "fonte_verificada": "sim|nao|parcial"
    }
  ],
  "referencias_necessarias": ["lista de temas que precisam de fonte"],
  "aprovado": boolean
}`,
        response_json_schema: {
          type: "object",
          properties: {
            score_confiabilidade: { type: "number" },
            alertas: { type: "array", items: { type: "object" } },
            referencias_necessarias: { type: "array", items: { type: "string" } },
            aprovado: { type: "boolean" }
          }
        }
      });

      setResultado(validacao);
      if (onValidado) onValidado(validacao);
      
      if (validacao.aprovado) {
        toast.success('Conteúdo validado com sucesso!');
      } else {
        toast.warning('Atenção: Conteúdo requer revisão');
      }
    } catch (error) {
      toast.error('Erro ao validar conteúdo');
    } finally {
      setValidando(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="font-bold">Validador Anti-Fake News</h3>
          </div>
          {resultado && (
            <span className={`text-2xl font-bold ${
              resultado.score_confiabilidade >= 80 ? 'text-green-600' : 
              resultado.score_confiabilidade >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {resultado.score_confiabilidade}/100
            </span>
          )}
        </div>

        <Button
          onClick={validar}
          disabled={validando || !topicos || topicos.length === 0}
          className="w-full"
        >
          {validando ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Validando...</>
          ) : (
            <><Shield className="w-4 h-4 mr-2" />Validar Conteúdo</>
          )}
        </Button>

        {resultado && (
          <div className="space-y-3">
            {resultado.alertas?.map((alerta, i) => (
              <div key={i} className={`p-3 rounded border ${
                alerta.nivel === 'critico' ? 'bg-red-50 border-red-200' :
                alerta.nivel === 'alerta' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-start gap-2">
                  {alerta.nivel === 'critico' && <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />}
                  {alerta.nivel === 'alerta' && <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />}
                  {alerta.nivel === 'info' && <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />}
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{alerta.mensagem}</p>
                    {alerta.sugestao && (
                      <p className="text-xs text-gray-600 mt-1">💡 {alerta.sugestao}</p>
                    )}
                    {alerta.fonte_verificada && (
                      <p className={`text-xs mt-1 ${
                        alerta.fonte_verificada === 'sim' ? 'text-green-600' :
                        alerta.fonte_verificada === 'parcial' ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>
                        🔍 Verificação de fonte: {alerta.fonte_verificada}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {resultado.referencias_necessarias?.length > 0 && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded">
                <p className="text-sm font-semibold mb-2">📚 Temas que precisam de referência:</p>
                <ul className="text-xs space-y-1">
                  {resultado.referencias_necessarias.map((ref, i) => (
                    <li key={i}>• {ref}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}