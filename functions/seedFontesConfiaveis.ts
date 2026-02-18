import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0].id;

    const fontesOficiais = [
      {
        nome: "STF - Supremo Tribunal Federal",
        url_base: "https://portal.stf.jus.br/",
        tipo: "tribunal",
        categoria: "stf",
        confiabilidade: "alta",
        descricao: "Portal oficial do Supremo Tribunal Federal"
      },
      {
        nome: "STJ - Superior Tribunal de Justiça",
        url_base: "https://www.stj.jus.br/",
        tipo: "tribunal",
        categoria: "stj",
        confiabilidade: "alta",
        descricao: "Portal oficial do Superior Tribunal de Justiça"
      },
      {
        nome: "TST - Tribunal Superior do Trabalho",
        url_base: "https://www.tst.jus.br/",
        tipo: "tribunal",
        categoria: "tst",
        confiabilidade: "alta",
        descricao: "Portal oficial do Tribunal Superior do Trabalho"
      },
      {
        nome: "JusBrasil",
        url_base: "https://www.jusbrasil.com.br/",
        tipo: "jurisprudencia",
        categoria: "portal_juridico",
        confiabilidade: "alta",
        descricao: "Maior portal de jurisprudência do Brasil"
      },
      {
        nome: "Migalhas",
        url_base: "https://www.migalhas.com.br/",
        tipo: "noticia_juridica",
        categoria: "portal_juridico",
        confiabilidade: "alta",
        descricao: "Portal de notícias jurídicas"
      },
      {
        nome: "Consultor Jurídico",
        url_base: "https://www.conjur.com.br/",
        tipo: "noticia_juridica",
        categoria: "portal_juridico",
        confiabilidade: "alta",
        descricao: "Notícias e análises jurídicas"
      },
      {
        nome: "Jus.com.br",
        url_base: "https://jus.com.br/",
        tipo: "doutrina",
        categoria: "portal_juridico",
        confiabilidade: "alta",
        descricao: "Artigos e doutrina jurídica"
      }
    ];

    const created = [];
    for (const fonte of fontesOficiais) {
      const result = await base44.asServiceRole.entities.FonteConfiavel.create({
        ...fonte,
        escritorio_id: escritorioId,
        ativo: true,
        usar_em_ia: true
      });
      created.push(result);
    }

    return Response.json({ 
      success: true, 
      total: created.length,
      fontes: created
    });
  } catch (error) {
    console.error('Erro ao criar fontes:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});