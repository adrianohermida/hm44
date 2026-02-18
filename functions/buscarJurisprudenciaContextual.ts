import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { trecho_selecionado, escritorio_id } = await req.json();

    // Buscar fontes confiáveis ativas
    const fontes = await base44.asServiceRole.entities.FonteConfiavel.filter({
      escritorio_id,
      ativo: true,
      usar_em_ia: true,
      tipo: 'jurisprudencia'
    });

    if (fontes.length === 0) {
      return Response.json({ 
        error: 'Nenhuma fonte confiável cadastrada',
        sugestao: 'Cadastre fontes em Marketing > Fontes Confiáveis'
      }, { status: 404 });
    }

    // Montar contexto de fontes para a IA
    const contextoFontes = fontes.map(f => `${f.nome} (${f.url_base})`).join(', ');

    // Buscar jurisprudências relevantes via IA
    const resultado = await base44.integrations.Core.InvokeLLM({
      prompt: `Analise o seguinte trecho de um artigo jurídico e busque jurisprudências relevantes nas seguintes fontes confiáveis: ${contextoFontes}

TRECHO:
"${trecho_selecionado}"

TAREFA:
1. Identifique o tema jurídico principal
2. Busque jurisprudências relevantes (STF, STJ, TJs)
3. Retorne no máximo 3 jurisprudências mais relevantes
4. Para cada uma, forneça: tribunal, número do processo, ementa resumida (max 100 chars), link direto

Retorne JSON estruturado.`,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          tema_identificado: { type: "string" },
          jurisprudencias: {
            type: "array",
            items: {
              type: "object",
              properties: {
                tribunal: { type: "string" },
                numero_processo: { type: "string" },
                ementa_resumida: { type: "string" },
                link: { type: "string" },
                relevancia: { type: "string", enum: ["alta", "media", "baixa"] }
              }
            }
          }
        }
      }
    });

    return Response.json({
      trecho_analisado: trecho_selecionado,
      tema: resultado.tema_identificado,
      jurisprudencias: resultado.jurisprudencias || [],
      fontes_utilizadas: fontes.map(f => ({ nome: f.nome, url: f.url_base }))
    });

  } catch (error) {
    console.error('Erro ao buscar jurisprudências:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});