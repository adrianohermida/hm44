import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Validar autenticação
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { escritorioId } = await req.json();
    
    if (!escritorioId) {
      return Response.json({ error: 'escritorioId é obrigatório' }, { status: 400 });
    }

    // Buscar artigos do escritório
    const artigos = await base44.asServiceRole.entities.Blog.filter({ 
      escritorio_id: escritorioId 
    });

    // Calcular métricas reais
    const totalVisitas = artigos.reduce((acc, art) => acc + (art.visualizacoes || 0), 0);
    const artigosPublicados = artigos.filter(art => art.publicado).length;
    const mediaVisualizacoes = artigosPublicados > 0 
      ? Math.round(totalVisitas / artigosPublicados) 
      : 0;

    // Top 5 artigos por visualizações
    const topArtigos = [...artigos]
      .filter(art => art.publicado)
      .sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
      .slice(0, 5)
      .map(art => ({
        id: art.id,
        titulo: art.titulo,
        categoria: art.categoria,
        visualizacoes: art.visualizacoes || 0
      }));

    // Artigos recentes (últimos 30 dias)
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    
    const artigosRecentes = artigos.filter(art => {
      if (!art.data_publicacao) return false;
      const dataPub = new Date(art.data_publicacao);
      return dataPub >= trintaDiasAtras;
    }).length;

    // Score SEO médio
    const artigosComScore = artigos.filter(art => art.score_seo_atual > 0);
    const scoreSEOMedio = artigosComScore.length > 0
      ? Math.round(
          artigosComScore.reduce((acc, art) => acc + art.score_seo_atual, 0) / 
          artigosComScore.length
        )
      : 0;

    // Distribuição por categoria
    const distribuicaoCategoria = artigos.reduce((acc, art) => {
      const cat = art.categoria || 'sem_categoria';
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    // Distribuição por status
    const distribuicaoStatus = artigos.reduce((acc, art) => {
      const status = art.status || 'rascunho';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Buscar keywords do escritório
    const keywords = await base44.asServiceRole.entities.SEOKeyword.filter({ 
      escritorio_id: escritorioId,
      ativo: true
    });

    const keywordsComPosicao = keywords.filter(k => k.posicao_atual && k.posicao_atual <= 10);

    // Métricas de engajamento (baseado em comentários se existir)
    const comentarios = await base44.asServiceRole.entities.BlogComment.filter({ 
      escritorio_id: escritorioId,
      aprovado: true
    }).catch(() => []);

    const taxaEngajamento = artigosPublicados > 0 
      ? ((comentarios.length / artigosPublicados) * 100).toFixed(1)
      : '0.0';

    return Response.json({
      success: true,
      data: {
        // Métricas gerais
        totalVisitas,
        artigosPublicados,
        totalArtigos: artigos.length,
        mediaVisualizacoes,
        artigosRecentes,
        scoreSEOMedio,
        
        // Top artigos
        topArtigos,
        
        // Distribuições
        distribuicaoCategoria,
        distribuicaoStatus,
        
        // SEO
        totalKeywords: keywords.length,
        keywordsTop10: keywordsComPosicao.length,
        
        // Engajamento
        totalComentarios: comentarios.length,
        taxaEngajamento: parseFloat(taxaEngajamento),
        
        // Metadata
        dataAtualizacao: new Date().toISOString(),
        fonte: 'database'
      }
    });

  } catch (error) {
    console.error('Erro ao buscar analytics:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});