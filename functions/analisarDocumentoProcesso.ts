import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { documento_urls, numero_cnj } = await req.json();

    const prompt = `Analise os documentos jurídicos anexados e gere um resumo executivo estruturado em tópicos com:
    
1. IDENTIFICAÇÃO DO CASO (número, partes, tribunal)
2. OBJETO DA AÇÃO (pedidos principais)
3. PARTES ENVOLVIDAS (autor, réu, advogados)
4. ESTÁGIO PROCESSUAL (fase atual, últimas movimentações)
5. PONTOS CRÍTICOS (questões jurídicas relevantes)
6. PRAZOS IMPORTANTES (datas-chave identificadas)
7. RECOMENDAÇÕES (próximos passos sugeridos)

Seja objetivo, técnico e destaque informações acionáveis.`;

    const { data } = await base44.functions.invoke('invocarLLM', {
      prompt,
      file_urls: documento_urls,
      response_json_schema: {
        type: 'object',
        properties: {
          identificacao: { type: 'string' },
          objeto: { type: 'string' },
          partes: { type: 'array', items: { type: 'string' } },
          estagio: { type: 'string' },
          pontos_criticos: { type: 'array', items: { type: 'string' } },
          prazos: { type: 'array', items: { type: 'string' } },
          recomendacoes: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    return Response.json({ resumo: data, numero_cnj });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});