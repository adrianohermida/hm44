import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

// Custos de quota do YouTube Data API v3
const YOUTUBE_QUOTA_COSTS = {
  'activities.list': 1,
  'captions.list': 50,
  'captions.insert': 400,
  'captions.update': 450,
  'captions.delete': 50,
  'channelBanners.insert': 50,
  'channels.list': 1,
  'channels.update': 50,
  'channelSections.list': 1,
  'channelSections.insert': 50,
  'channelSections.update': 50,
  'channelSections.delete': 50,
  'comments.list': 1,
  'comments.insert': 50,
  'comments.update': 50,
  'comments.setModerationStatus': 50,
  'comments.delete': 50,
  'commentThreads.list': 1,
  'commentThreads.insert': 50,
  'commentThreads.update': 50,
  'guideCategories.list': 1,
  'i18nLanguages.list': 1,
  'i18nRegions.list': 1,
  'members.list': 1,
  'membershipsLevels.list': 1,
  'playlistItems.list': 1,
  'playlistItems.insert': 50,
  'playlistItems.update': 50,
  'playlistItems.delete': 50,
  'playlists.list': 1,
  'playlists.insert': 50,
  'playlists.update': 50,
  'playlists.delete': 50,
  'search.list': 100,
  'subscriptions.list': 1,
  'subscriptions.insert': 50,
  'subscriptions.delete': 50,
  'thumbnails.set': 50,
  'videoAbuseReportReasons.list': 1,
  'videoCategories.list': 1,
  'videos.list': 1,
  'videos.insert': 1600,
  'videos.update': 50,
  'videos.rate': 50,
  'videos.getRating': 1,
  'videos.reportAbuse': 50,
  'videos.delete': 50,
  'watermarks.set': 50,
  'watermarks.unset': 50
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar escritório
    const escritorios = await base44.entities.Escritorio.filter({ created_by: user.email });
    if (escritorios.length === 0) {
      return Response.json({ error: 'Nenhum escritório encontrado' }, { status: 404 });
    }

    const escritorio = escritorios[0];

    // Buscar endpoints YouTube existentes
    const endpoints = await base44.asServiceRole.entities.EndpointAPI.filter({
      escritorio_id: escritorio.id
    });

    const youtubeEndpoints = endpoints.filter(e => 
      e.path?.toLowerCase().includes('youtube') || 
      e.categoria?.toLowerCase().includes('youtube')
    );

    // Atualizar/criar precificação com quotas
    const updates = [];
    
    for (const endpoint of youtubeEndpoints) {
      const path = endpoint.path || '';
      const matchedKey = Object.keys(YOUTUBE_QUOTA_COSTS).find(key => 
        path.toLowerCase().includes(key.toLowerCase().replace('.', '/'))
      );

      const custoQuota = matchedKey ? YOUTUBE_QUOTA_COSTS[matchedKey] : 1;

      // Buscar precificação existente
      const precosExistentes = await base44.asServiceRole.entities.PrecificacaoEndpoint.filter({
        escritorio_id: escritorio.id,
        endpoint_id: endpoint.id
      });

      if (precosExistentes.length > 0) {
        // Atualizar
        await base44.asServiceRole.entities.PrecificacaoEndpoint.update(precosExistentes[0].id, {
          quota_gratuita_diaria: 10000,
          custo_quota: custoQuota,
          quota_excedente_custo: 0.10,
          modelo_cobranca: 'quota_gratuita'
        });
        updates.push({ id: precosExistentes[0].id, action: 'updated' });
      } else {
        // Criar novo
        const newPreco = await base44.asServiceRole.entities.PrecificacaoEndpoint.create({
          escritorio_id: escritorio.id,
          endpoint_id: endpoint.id,
          titulo: endpoint.nome || `YouTube ${matchedKey || 'API'}`,
          descricao: `Endpoint YouTube com quota de ${custoQuota} unidades`,
          categoria: 'YouTube Data API',
          versao: endpoint.versao_api || 'V3',
          valor_referencia: 0,
          custo_externo_unitario: 0,
          modelo_cobranca: 'quota_gratuita',
          quota_gratuita_diaria: 10000,
          custo_quota: custoQuota,
          quota_excedente_custo: 0.10,
          margem_percentual: 0,
          preco_venda: 0,
          ativo: true
        });
        updates.push({ id: newPreco.id, action: 'created' });
      }
    }

    return Response.json({ 
      success: true, 
      endpoints_youtube: youtubeEndpoints.length,
      updates: updates.length,
      details: updates,
      message: `${updates.length} precificações configuradas com quotas YouTube` 
    });

  } catch (error) {
    console.error('Error seeding YouTube quotas:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});