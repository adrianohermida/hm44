import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();

    // Buscar artigo
    const artigos = await base44.asServiceRole.entities.Blog.filter({ id });
    if (!artigos || artigos.length === 0) {
      return Response.json({ error: 'Artigo não encontrado' }, { status: 404 });
    }

    const artigo = artigos[0];

    // Otimizações automáticas via IA
    const prompt = `
Analise este artigo de blog jurídico e sugira otimizações SEO:

Título: ${artigo.titulo}
Meta Description: ${artigo.meta_description || 'Não definida'}
Keywords: ${artigo.keywords?.join(', ') || 'Nenhuma'}
Conteúdo: ${artigo.conteudo?.substring(0, 1000)}...

Retorne JSON com:
{
  "titulo_otimizado": "título otimizado com keyword principal",
  "meta_description_otimizada": "150-160 caracteres otimizado",
  "keywords_sugeridas": ["keyword1", "keyword2", "keyword3"],
  "melhorias": ["lista de melhorias aplicadas"]
}
`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          titulo_otimizado: { type: "string" },
          meta_description_otimizada: { type: "string" },
          keywords_sugeridas: { type: "array", items: { type: "string" } },
          melhorias: { type: "array", items: { type: "string" } }
        }
      }
    });

    // Calcular novo score SEO
    const scoreSEO = calcularScoreSEO({
      titulo: response.titulo_otimizado,
      meta_description: response.meta_description_otimizada,
      keywords: response.keywords_sugeridas,
      conteudo: artigo.conteudo
    });

    // Atualizar artigo
    await base44.asServiceRole.entities.Blog.update(id, {
      titulo: response.titulo_otimizado,
      meta_description: response.meta_description_otimizada,
      keywords: response.keywords_sugeridas,
      score_seo_atual: scoreSEO
    });

    // Criar versão no histórico
    const versoes = await base44.asServiceRole.entities.BlogVersion.filter({ blog_id: id });
    await base44.asServiceRole.entities.BlogVersion.create({
      blog_id: id,
      escritorio_id: artigo.escritorio_id,
      versao_numero: (versoes[0]?.versao_numero || 0) + 1,
      titulo: response.titulo_otimizado,
      conteudo: artigo.conteudo,
      meta_description: response.meta_description_otimizada,
      keywords: response.keywords_sugeridas,
      score_seo: scoreSEO,
      tipo_mudanca: 'ia_otimizacao',
      descricao_mudanca: 'Otimização automática via IA',
      autor_mudanca: user.email
    });

    return Response.json({
      success: true,
      melhorias: response.melhorias,
      score_anterior: artigo.score_seo_atual || 0,
      score_novo: scoreSEO
    });

  } catch (error) {
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});

function calcularScoreSEO(data) {
  let score = 0;
  if (data.titulo?.length >= 40 && data.titulo.length <= 60) score += 20;
  if (data.meta_description?.length >= 150 && data.meta_description.length <= 160) score += 20;
  if (data.keywords?.length >= 3) score += 15;
  const palavras = data.conteudo?.split(' ').length || 0;
  if (palavras >= 800) score += 25;
  if (palavras >= 1500) score += 10;
  return Math.min(score, 100);
}