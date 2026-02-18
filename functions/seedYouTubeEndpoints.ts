import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

/**
 * Cria endpoints do YouTube Data API v3 com custos de quota corretos
 * Baseado na documentação oficial: https://developers.google.com/youtube/v3/determine_quota_cost
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Buscar escritório
    const escritorios = await base44.asServiceRole.entities.Escritorio.filter({ 
      created_by: user.email 
    });
    
    if (!escritorios.length) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }
    
    const escritorio = escritorios[0];

    // 1. Buscar ou criar provedor YouTube Data API
    let provedores = await base44.asServiceRole.entities.ProvedorAPI.filter({
      escritorio_id: escritorio.id,
      nome: 'YouTube Data API'
    });

    let provedor;
    if (provedores.length === 0) {
      provedor = await base44.asServiceRole.entities.ProvedorAPI.create({
        escritorio_id: escritorio.id,
        codigo_identificador: 'YOUTUBE-001',
        nome: 'YouTube Data API',
        tipo: 'REST',
        requer_autenticacao: true,
        tipo_autenticacao: 'hybrid',
        base_url_v1: 'https://www.googleapis.com/youtube/v3',
        api_key_config: {
          secret_name: 'YOUTUBE_API_KEY',
          query_param_name: 'key'
        },
        oauth_config: {
          client_id: '1042763577765-6l72paf8hclin79egd0tg9rd24j208fv.apps.googleusercontent.com',
          client_secret: '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',
          auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
          token_url: 'https://oauth2.googleapis.com/token',
          revoke_url: 'https://oauth2.googleapis.com/revoke',
          response_type: 'token',
          include_granted_scopes: true,
          scopes: [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
          ]
        },
        schemas_resposta_exemplos: {
          channel_id: 'UCM--4S88EjE5AHEeAmn-xxw',
          for_username: '@dr.adrianohermidamaia'
        },
        descricao: 'API oficial do YouTube para gerenciar vídeos, playlists, canais e analytics',
        documentacao_url: 'https://developers.google.com/youtube/v3/docs',
        ativo: true
      });
    } else {
      // Atualizar provedor existente com credenciais OAuth
      provedor = await base44.asServiceRole.entities.ProvedorAPI.update(provedores[0].id, {
        tipo_autenticacao: 'hybrid',
        oauth_config: {
          client_id: '1042763577765-6l72paf8hclin79egd0tg9rd24j208fv.apps.googleusercontent.com',
          client_secret: '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',
          auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
          token_url: 'https://oauth2.googleapis.com/token',
          revoke_url: 'https://oauth2.googleapis.com/revoke',
          response_type: 'token',
          include_granted_scopes: true,
          scopes: [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.upload',
            'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
          ]
        },
        schemas_resposta_exemplos: {
          channel_id: 'UCM--4S88EjE5AHEeAmn-xxw',
          for_username: '@dr.adrianohermidamaia'
        }
      });
    }

    // Definir endpoints com custos de quota oficiais baseados na documentação
    const endpoints = [
      // CANAL (custo: 1)
      {
        nome: 'Detalhes do Canal',
        path: '/channels',
        metodo: 'GET',
        categoria: 'channels',
        custo_quota: 1,
        descricao: 'Obter informações e estatísticas do canal',
        parametros: [
          { nome: 'key', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'API Key do Google' },
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'Parts', exemplo: 'snippet,contentDetails,statistics', valor_padrao: 'snippet,statistics' },
          { nome: 'id', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'ID do canal', exemplo: 'UCM--4S88EjE5AHEeAmn-xxw', valor_padrao: 'UCM--4S88EjE5AHEeAmn-xxw' },
          { nome: 'forUsername', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'Username do canal', exemplo: '@dr.adrianohermidamaia', valor_padrao: '@dr.adrianohermidamaia' },
          { nome: 'mine', tipo: 'boolean', obrigatorio: false, localizacao: 'query', descricao: 'Meu canal (requer OAuth)', valor_padrao: 'false' }
        ]
      },
      // PLAYLISTS (custo: 1)
      {
        nome: 'Listar Playlists do Canal',
        path: '/playlists',
        metodo: 'GET',
        categoria: 'playlists',
        custo_quota: 1,
        descricao: 'Lista todas playlists de um canal (criadas pelo usuário, não inclui geradas pelo sistema)',
        parametros: [
          { nome: 'key', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'API Key do Google' },
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'Parts a retornar', exemplo: 'snippet,contentDetails', valor_padrao: 'snippet,contentDetails' },
          { nome: 'channelId', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'ID do canal', exemplo: 'UCM--4S88EjE5AHEeAmn-xxw', valor_padrao: 'UCM--4S88EjE5AHEeAmn-xxw' },
          { nome: 'mine', tipo: 'boolean', obrigatorio: false, localizacao: 'query', descricao: 'Minhas playlists (requer OAuth)', valor_padrao: 'false' },
          { nome: 'maxResults', tipo: 'number', obrigatorio: false, localizacao: 'query', descricao: 'Máximo de resultados (1-50)', exemplo: '50', valor_padrao: '25' }
        ]
      },
      // PLAYLIST ITEMS (custo: 1)
      {
        nome: 'Listar Itens da Playlist',
        path: '/playlistItems',
        metodo: 'GET',
        categoria: 'playlistItems',
        custo_quota: 1,
        descricao: 'Lista vídeos de uma playlist específica',
        parametros: [
          { nome: 'key', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'API Key do Google' },
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'Parts', exemplo: 'snippet,contentDetails', valor_padrao: 'snippet,contentDetails' },
          { nome: 'playlistId', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'ID da playlist' },
          { nome: 'maxResults', tipo: 'number', obrigatorio: false, localizacao: 'query', descricao: 'Máximo (1-50)', exemplo: '50', valor_padrao: '25' }
        ]
      },
      // VÍDEOS (custo: 1)
      {
        nome: 'Detalhes de Vídeos',
        path: '/videos',
        metodo: 'GET',
        categoria: 'videos',
        custo_quota: 1,
        descricao: 'Obter detalhes, métricas e estatísticas de vídeos',
        parametros: [
          { nome: 'key', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'API Key do Google' },
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'Parts', exemplo: 'snippet,contentDetails,statistics,player', valor_padrao: 'snippet,statistics' },
          { nome: 'id', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'IDs dos vídeos (separados por vírgula)', exemplo: 'VIDEO_ID_1,VIDEO_ID_2' }
        ]
      },
      // BUSCA (custo alto: 100)
      {
        nome: 'Buscar Vídeos e Shorts',
        path: '/search',
        metodo: 'GET',
        categoria: 'search',
        custo_quota: 100,
        descricao: 'Buscar vídeos, shorts e canais (⚠️ ALTO CUSTO: 100 unidades de quota)',
        parametros: [
          { nome: 'key', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'API Key do Google' },
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', valor_padrao: 'snippet', descricao: 'Parts da resposta' },
          { nome: 'channelId', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'Buscar apenas neste canal', exemplo: 'UCM--4S88EjE5AHEeAmn-xxw', valor_padrao: 'UCM--4S88EjE5AHEeAmn-xxw' },
          { nome: 'q', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'Termo de busca (keywords)' },
          { nome: 'type', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'Tipo de resultado', exemplo: 'video', valor_padrao: 'video', opcoes_validas: ['video', 'channel', 'playlist'] },
          { nome: 'maxResults', tipo: 'number', obrigatorio: false, localizacao: 'query', descricao: 'Máximo (1-50)', exemplo: '10', valor_padrao: '5' },
          { nome: 'order', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'Ordenação', exemplo: 'date', valor_padrao: 'date', opcoes_validas: ['date', 'rating', 'relevance', 'title', 'videoCount', 'viewCount'] },
          { nome: 'forMine', tipo: 'boolean', obrigatorio: false, localizacao: 'query', descricao: 'Meus vídeos (requer OAuth)', valor_padrao: 'false' }
        ]
      },
      // COMENTÁRIOS (custo: 1)
      {
        nome: 'Listar Comentários',
        path: '/commentThreads',
        metodo: 'GET',
        categoria: 'commentThreads',
        custo_quota: 1,
        descricao: 'Listar comentários de um vídeo',
        parametros: [
          { nome: 'key', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'API Key do Google' },
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', valor_padrao: 'snippet', descricao: 'Parts da resposta' },
          { nome: 'videoId', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'ID do vídeo' },
          { nome: 'maxResults', tipo: 'number', obrigatorio: false, localizacao: 'query', descricao: 'Máximo (1-100)', valor_padrao: '20' },
          { nome: 'order', tipo: 'string', obrigatorio: false, localizacao: 'query', opcoes_validas: ['time', 'relevance'], valor_padrao: 'time' }
        ]
      },
      // ASSINATURAS (custo: 1)
      {
        nome: 'Listar Assinaturas',
        path: '/subscriptions',
        metodo: 'GET',
        categoria: 'subscriptions',
        custo_quota: 1,
        descricao: 'Listar inscritos ou inscrições de um canal (requer OAuth se mine=true)',
        parametros: [
          { nome: 'key', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'API Key do Google' },
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', valor_padrao: 'snippet', descricao: 'Parts da resposta' },
          { nome: 'channelId', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'ID do canal' },
          { nome: 'mine', tipo: 'boolean', obrigatorio: false, localizacao: 'query', descricao: 'Minhas inscrições (requer OAuth)', valor_padrao: 'false' },
          { nome: 'mySubscribers', tipo: 'boolean', obrigatorio: false, localizacao: 'query', descricao: 'Meus inscritos (requer OAuth)', valor_padrao: 'false' },
          { nome: 'maxResults', tipo: 'number', obrigatorio: false, localizacao: 'query', descricao: 'Máximo (1-50)', valor_padrao: '25' }
        ]
      },
      // ATIVIDADES (custo: 1)
      {
        nome: 'Listar Atividades',
        path: '/activities',
        metodo: 'GET',
        categoria: 'activities',
        custo_quota: 1,
        descricao: 'Listar atividades do canal (uploads, likes, inscrições, etc)',
        parametros: [
          { nome: 'key', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'API Key do Google' },
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', valor_padrao: 'snippet,contentDetails', descricao: 'Parts da resposta' },
          { nome: 'channelId', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'ID do canal', exemplo: 'UCM--4S88EjE5AHEeAmn-xxw', valor_padrao: 'UCM--4S88EjE5AHEeAmn-xxw' },
          { nome: 'mine', tipo: 'boolean', obrigatorio: false, localizacao: 'query', descricao: 'Minhas atividades (requer OAuth)', valor_padrao: 'false' },
          { nome: 'home', tipo: 'boolean', obrigatorio: false, localizacao: 'query', descricao: 'Feed da página inicial (requer OAuth)', valor_padrao: 'false' },
          { nome: 'publishedAfter', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'Filtrar após data (RFC 3339)', exemplo: '2023-01-01T00:00:00Z' },
          { nome: 'publishedBefore', tipo: 'string', obrigatorio: false, localizacao: 'query', descricao: 'Filtrar antes da data (RFC 3339)', exemplo: '2023-12-31T23:59:59Z' },
          { nome: 'maxResults', tipo: 'number', obrigatorio: false, localizacao: 'query', descricao: 'Máximo (1-50)', valor_padrao: '25' }
        ]
      },
      // POST - CRIAR PLAYLIST (custo: 50 - requer OAuth)
      {
        nome: 'Criar Playlist',
        path: '/playlists',
        metodo: 'POST',
        categoria: 'playlists',
        custo_quota: 50,
        descricao: 'Criar uma nova playlist (requer OAuth 2.0)',
        parametros: [
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', valor_padrao: 'snippet,status', descricao: 'Parts a incluir' },
          { nome: 'title', tipo: 'string', obrigatorio: true, localizacao: 'body', descricao: 'Título da playlist', exemplo: 'Minha Nova Playlist' },
          { nome: 'description', tipo: 'string', obrigatorio: false, localizacao: 'body', descricao: 'Descrição', exemplo: 'Descrição da playlist' },
          { nome: 'privacyStatus', tipo: 'string', obrigatorio: false, localizacao: 'body', valor_padrao: 'private', opcoes_validas: ['private', 'public', 'unlisted'] }
        ]
      },
      // PUT - ATUALIZAR PLAYLIST (custo: 50 - requer OAuth)
      {
        nome: 'Atualizar Playlist',
        path: '/playlists',
        metodo: 'PUT',
        categoria: 'playlists',
        custo_quota: 50,
        descricao: 'Atualizar playlist existente (requer OAuth 2.0)',
        parametros: [
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', valor_padrao: 'snippet,status', descricao: 'Parts a atualizar' },
          { nome: 'id', tipo: 'string', obrigatorio: true, localizacao: 'body', descricao: 'ID da playlist' },
          { nome: 'title', tipo: 'string', obrigatorio: true, localizacao: 'body', descricao: 'Novo título' },
          { nome: 'description', tipo: 'string', obrigatorio: false, localizacao: 'body', descricao: 'Nova descrição' },
          { nome: 'privacyStatus', tipo: 'string', obrigatorio: false, localizacao: 'body', opcoes_validas: ['private', 'public', 'unlisted'] }
        ]
      },
      // DELETE - EXCLUIR PLAYLIST (custo: 50 - requer OAuth)
      {
        nome: 'Excluir Playlist',
        path: '/playlists',
        metodo: 'DELETE',
        categoria: 'playlists',
        custo_quota: 50,
        descricao: 'Excluir uma playlist (requer OAuth 2.0)',
        parametros: [
          { nome: 'id', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'ID da playlist a excluir' }
        ]
      },
      // POST - ADICIONAR VÍDEO À PLAYLIST (custo: 50 - requer OAuth)
      {
        nome: 'Adicionar Vídeo à Playlist',
        path: '/playlistItems',
        metodo: 'POST',
        categoria: 'playlistItems',
        custo_quota: 50,
        descricao: 'Adicionar vídeo a uma playlist (requer OAuth 2.0)',
        parametros: [
          { nome: 'part', tipo: 'string', obrigatorio: true, localizacao: 'query', valor_padrao: 'snippet', descricao: 'Parts a incluir' },
          { nome: 'playlistId', tipo: 'string', obrigatorio: true, localizacao: 'body', descricao: 'ID da playlist' },
          { nome: 'videoId', tipo: 'string', obrigatorio: true, localizacao: 'body', descricao: 'ID do vídeo a adicionar' },
          { nome: 'position', tipo: 'number', obrigatorio: false, localizacao: 'body', descricao: 'Posição na playlist (0-based)', valor_padrao: '0' }
        ]
      },
      // DELETE - REMOVER VÍDEO DA PLAYLIST (custo: 50 - requer OAuth)
      {
        nome: 'Remover Vídeo da Playlist',
        path: '/playlistItems',
        metodo: 'DELETE',
        categoria: 'playlistItems',
        custo_quota: 50,
        descricao: 'Remover item de uma playlist (requer OAuth 2.0)',
        parametros: [
          { nome: 'id', tipo: 'string', obrigatorio: true, localizacao: 'query', descricao: 'ID do item da playlist (não o videoId!)' }
        ]
      }
    ];

    const created = [];
    for (const ep of endpoints) {
      const existing = await base44.asServiceRole.entities.EndpointAPI.filter({
        escritorio_id: escritorio.id,
        provedor_id: provedor.id,
        nome: ep.nome
      });

      if (existing.length === 0) {
        const novo = await base44.asServiceRole.entities.EndpointAPI.create({
          ...ep,
          escritorio_id: escritorio.id,
          provedor_id: provedor.id,
          versao_api: 'V1',
          creditos_consumidos: ep.custo_quota,
          ativo: true
        });
        created.push(novo);

        // Criar precificação com quota (só se não existir)
        const existingPreco = await base44.asServiceRole.entities.PrecificacaoEndpoint.filter({
          escritorio_id: escritorio.id,
          endpoint_id: novo.id
        });
        
        if (existingPreco.length === 0) {
          await base44.asServiceRole.entities.PrecificacaoEndpoint.create({
            escritorio_id: escritorio.id,
            endpoint_id: novo.id,
            titulo: ep.nome,
            categoria: ep.categoria,
            versao: 'V1',
            valor_referencia: 0,
            custo_quota: ep.custo_quota,
            quota_gratuita_diaria: 10000,
            modelo_cobranca: 'quota_gratuita',
            ativo: true
          });
        }
      }
    }

    // 2. Criar provedor YouTube Analytics API
    let provedoresAnalytics = await base44.asServiceRole.entities.ProvedorAPI.filter({
      escritorio_id: escritorio.id,
      nome: 'YouTube Analytics API'
    });

    let provedorAnalytics;
    if (provedoresAnalytics.length === 0) {
      provedorAnalytics = await base44.asServiceRole.entities.ProvedorAPI.create({
        escritorio_id: escritorio.id,
        codigo_identificador: 'YOUTUBE-ANALYTICS-001',
        nome: 'YouTube Analytics API',
        tipo: 'REST',
        requer_autenticacao: true,
        tipo_autenticacao: 'hybrid',
        base_url_v1: 'https://youtubeanalytics.googleapis.com/v2',
        api_key_config: {
          secret_name: 'YOUTUBE_ANALYTICS_API_KEY',
          query_param_name: 'key'
        },
        oauth_config: {
          client_id: '1042763577765-6l72paf8hclin79egd0tg9rd24j208fv.apps.googleusercontent.com',
          client_secret: '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',
          auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
          token_url: 'https://oauth2.googleapis.com/token',
          revoke_url: 'https://oauth2.googleapis.com/revoke',
          response_type: 'token',
          include_granted_scopes: true,
          scopes: [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/yt-analytics.readonly',
            'https://www.googleapis.com/auth/yt-analytics-monetary.readonly'
          ]
        },
        schemas_resposta_exemplos: {
          channel_id: 'UCM--4S88EjE5AHEeAmn-xxw',
          for_username: '@dr.adrianohermidamaia'
        },
        descricao: 'API oficial do YouTube para analytics, relatórios e métricas avançadas',
        documentacao_url: 'https://developers.google.com/youtube/analytics',
        ativo: true
      });
    } else {
      provedorAnalytics = await base44.asServiceRole.entities.ProvedorAPI.update(provedoresAnalytics[0].id, {
        tipo_autenticacao: 'hybrid',
        oauth_config: {
          client_id: '1042763577765-6l72paf8hclin79egd0tg9rd24j208fv.apps.googleusercontent.com',
          client_secret: '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',
          auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
          token_url: 'https://oauth2.googleapis.com/token',
          revoke_url: 'https://oauth2.googleapis.com/revoke',
          response_type: 'token',
          include_granted_scopes: true,
          scopes: [
            'https://www.googleapis.com/auth/youtube.readonly',
            'https://www.googleapis.com/auth/yt-analytics.readonly',
            'https://www.googleapis.com/auth/yt-analytics-monetary.readonly'
          ]
        },
        schemas_resposta_exemplos: {
          channel_id: 'UCM--4S88EjE5AHEeAmn-xxw',
          for_username: '@dr.adrianohermidamaia'
        }
      });
    }

    return Response.json({
      sucesso: true,
      provedores: {
        data: provedor,
        analytics: provedorAnalytics
      },
      endpoints_criados: created.length,
      endpoints: created,
      message: `✅ ${created.length} endpoints do YouTube Data API criados | OAuth2 híbrido configurado`
    });

  } catch (error) {
    console.error('❌ Erro ao criar endpoints YouTube:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});