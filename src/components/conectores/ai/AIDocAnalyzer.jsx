import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Brain, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function AIDocAnalyzer({ docUrl, onEndpointsExtracted }) {
  const [url, setUrl] = useState(docUrl || '');
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Extraia TODOS os endpoints desta documentação API: ${url}\n\nRetorne lista completa com nome, método HTTP, path, descrição e parâmetros.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            endpoints: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  nome: { type: "string" },
                  metodo: { type: "string" },
                  path: { type: "string" },
                  descricao: { type: "string" },
                  parametros: { type: "array", items: { type: "object" } }
                }
              }
            }
          }
        }
      });
      onEndpointsExtracted(result.endpoints);
      toast.success(`${result.endpoints.length} endpoints extraídos`);
    } catch (err) {
      toast.error('Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL da documentação" />
      <Button onClick={analyze} disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
      </Button>
    </div>
  );
}