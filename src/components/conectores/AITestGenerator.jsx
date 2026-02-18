import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { base44 } from '@/api/base44Client';
import { Sparkles, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function AITestGenerator({ endpoint }) {
  const [casos, setCasos] = useState('');
  const [gerando, setGerando] = useState(false);

  const gerarCasos = async () => {
    setGerando(true);
    try {
      const prompt = `Gere 3 casos de teste para este endpoint:
Path: ${endpoint.path}
Método: ${endpoint.metodo}
Parâmetros: ${JSON.stringify(endpoint.parametros_obrigatorios)}

Retorne apenas um array JSON com objetos contendo: { nome, parametros, esperado }`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: 'object',
          properties: {
            casos: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  nome: { type: 'string' },
                  parametros: { type: 'object' },
                  esperado: { type: 'string' }
                }
              }
            }
          }
        }
      });

      setCasos(JSON.stringify(result.casos, null, 2));
      toast.success('Casos de teste gerados!');
    } catch (err) {
      toast.error('Erro ao gerar: ' + err.message);
    } finally {
      setGerando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
          <Sparkles className="w-5 h-5" /> Gerador de Casos de Teste (IA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={gerarCasos} disabled={gerando} className="w-full">
          {gerando ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
          Gerar Casos com IA
        </Button>
        {casos && (
          <>
            <Textarea value={casos} readOnly rows={12} className="font-mono text-xs" />
            <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(casos); toast.success('Copiado!'); }}>
              <Copy className="w-3 h-3 mr-2" /> Copiar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}