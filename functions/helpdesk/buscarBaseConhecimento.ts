import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, categoria, tags, limit = 10 } = await req.json();

    if (!query) {
      return Response.json({ error: 'query é obrigatório' }, { status: 400 });
    }

    const [escritorio] = await base44.asServiceRole.entities.Escritorio.list();

    // Buscar artigos
    let filtro = {
      escritorio_id: escritorio.id,
      ativo: true
    };

    if (categoria) filtro.categoria = categoria;

    const artigos = await base44.asServiceRole.entities.BaseConhecimento.filter(filtro);

    // Usar LLM para ranquear relevância
    const prompt = `Dado a pergunta do usuário: "${query}"

ARTIGOS DISPONÍVEIS:
${artigos.map((a, i) => `${i + 1}. ${a.titulo} - Tags: ${a.tags?.join(', ')}\n${a.conteudo.substring(0, 150)}...`).join('\n\n')}

Retorne os IDs dos ${limit} artigos mais relevantes para a pergunta, ordenados por relevância.`;

    const ranking = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          artigos_ranqueados: {
            type: "array",
            items: {
              type: "object",
              properties: {
                posicao: { type: "number" },
                score_relevancia: { type: "number" },
                motivo: { type: "string" }
              }
            }
          }
        }
      }
    });

    const artigosRanqueados = ranking.artigos_ranqueados
      .map(r => ({
        ...artigos[r.posicao - 1],
        score_relevancia: r.score_relevancia,
        motivo: r.motivo
      }))
      .filter(a => a.id);

    return Response.json({
      success: true,
      artigos: artigosRanqueados.slice(0, limit)
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});