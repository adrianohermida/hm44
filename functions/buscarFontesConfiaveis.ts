import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { termo, categoria } = await req.json();

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0].id;

    let query = { escritorio_id: escritorioId, ativo: true, usar_em_ia: true };
    if (categoria) query.categoria = categoria;

    const fontes = await base44.asServiceRole.entities.FonteConfiavel.filter(query);

    const urls = fontes.map(f => f.url_base);

    const resultados = await base44.integrations.Core.InvokeLLM({
      prompt: `Busque informações sobre "${termo}" nos seguintes sites jurídicos confiáveis:

${urls.map((url, i) => `${i + 1}. ${url}`).join('\n')}

Retorne jurisprudências, artigos ou notícias relevantes em formato JSON:
{
  "resultados": [
    {
      "fonte": "nome do site",
      "titulo": "título do conteúdo",
      "resumo": "resumo breve",
      "url": "link direto",
      "data": "data publicação se disponível",
      "relevancia": 1-10
    }
  ]
}`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          resultados: {
            type: "array",
            items: {
              type: "object",
              properties: {
                fonte: { type: "string" },
                titulo: { type: "string" },
                resumo: { type: "string" },
                url: { type: "string" },
                data: { type: "string" },
                relevancia: { type: "number" }
              }
            }
          }
        }
      }
    });

    return Response.json(resultados);
  } catch (error) {
    console.error('Erro ao buscar fontes:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});