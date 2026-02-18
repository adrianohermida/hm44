import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    const CHANNEL_ID = 'UCBh3n1eWDKa2dN2rZK0nPIg'; // @dr.adrianohermidamaia

    // 1. Buscar shorts do canal
    const searchResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet&order=date&maxResults=50&type=video&videoDuration=short`
    );
    
    if (!searchResponse.ok) {
      throw new Error('Failed to fetch shorts');
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    if (!videoIds) {
      return Response.json({ success: true, count: 0, message: 'No shorts found' });
    }

    // 2. Buscar detalhes + analytics dos vídeos
    const detailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails,statistics`
    );
    
    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch video details');
    }
    
    const detailsData = await detailsResponse.json();

    // 3. Processar e salvar na entidade YouTubeShort
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    const shortsToSave = detailsData.items.map(video => ({
      escritorio_id: escritorioId,
      video_id: video.id,
      titulo: video.snippet.title,
      descricao: video.snippet.description,
      thumbnail_url: video.snippet.thumbnails.high.url,
      published_at: video.snippet.publishedAt,
      duracao: video.contentDetails.duration,
      view_count: parseInt(video.statistics.viewCount || 0),
      like_count: parseInt(video.statistics.likeCount || 0),
      comment_count: parseInt(video.statistics.commentCount || 0),
      engagement_rate: ((parseInt(video.statistics.likeCount || 0) + parseInt(video.statistics.commentCount || 0)) / parseInt(video.statistics.viewCount || 1) * 100).toFixed(2),
      ultima_sincronizacao: new Date().toISOString()
    }));

    // 4. Atualizar ou criar registros
    for (const short of shortsToSave) {
      const existing = await base44.asServiceRole.entities.YouTubeShort.filter({ 
        video_id: short.video_id 
      });

      if (existing.length > 0) {
        await base44.asServiceRole.entities.YouTubeShort.update(existing[0].id, short);
      } else {
        await base44.asServiceRole.entities.YouTubeShort.create(short);
      }
    }

    return Response.json({ 
      success: true, 
      count: shortsToSave.length,
      shorts: shortsToSave
    });

  } catch (error) {
    console.error('YouTube Shorts Sync Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});