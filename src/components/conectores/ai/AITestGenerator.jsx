import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, Settings } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import TestParametersConfig from './TestParametersConfig';
import TestDataLibrary from './TestDataLibrary';

export default function AITestGenerator({ endpoint, onTestsGenerated }) {
  const [loading, setLoading] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [parameters, setParameters] = useState([]);

  const generate = async () => {
    setLoading(true);
    try {
      let parametrosConfig = '';
      if (parameters.length > 0) {
        parametrosConfig = '\n\nParâmetros de teste configurados:\n' + 
          parameters.map(p => `- ${p.nome}: ${p.valor}`).join('\n');
      }

      const prompt = `Gere casos de teste para este endpoint:
${JSON.stringify(endpoint, null, 2)}
${parametrosConfig}

IMPORTANTE: Use EXATAMENTE os valores fornecidos acima para os parâmetros correspondentes.
Não invente CPF, CNPJ, OAB ou CNJ - use apenas os valores fornecidos.

Incluir: sucesso, validação, edge cases, erros.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            casos: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  tipo: { type: "string" },
                  parametros: { type: "object" },
                  resultado_esperado: { type: "string" }
                }
              }
            }
          }
        }
      });
      onTestsGenerated(result.casos);
      toast.success(`${result.casos.length} casos gerados`);
    } catch (err) {
      toast.error('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button onClick={() => setShowConfig(!showConfig)} variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-1" />
          {showConfig ? 'Ocultar' : 'Configurar'} Parâmetros
        </Button>
        <Button onClick={generate} disabled={loading} variant="outline" size="sm">
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
          Gerar Testes IA
        </Button>
      </div>
      {showConfig && (
        <div className="grid grid-cols-2 gap-3">
          <TestParametersConfig parameters={parameters} onChange={setParameters} />
          <TestDataLibrary />
        </div>
      )}
    </div>
  );
}