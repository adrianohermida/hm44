import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const YOUTUBE_API_KEY = Deno.env.get('YOUTUBE_API_KEY');
    
    if (!YOUTUBE_API_KEY) {
      return Response.json({ error: 'YOUTUBE_API_KEY não configurada' }, { status: 500 });
    }

    const { channelId = 'UCYGUn86HfmYcT9bQF9_4lOg', maxResults = 50, type = 'short', order = 'date' } = await req.json();

    console.log('Buscando vídeos:', { channelId, maxResults, type, order });

    // Buscar vídeos/shorts do canal com ordenação
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=${order}&maxResults=${maxResults}&type=video&videoDuration=short`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (!searchResponse.ok) {
      return Response.json({ error: searchData.error?.message || 'Erro ao buscar vídeos' }, { status: 400 });
    }

    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    // Buscar detalhes dos vídeos
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=snippet,contentDetails,statistics`;
    
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (!detailsResponse.ok) {
      return Response.json({ error: detailsData.error?.message || 'Erro ao buscar detalhes' }, { status: 400 });
    }

    // Processar vídeos com informações completas
    const videos = detailsData.items
      .map(video => {
        const duration = video.contentDetails.duration;
        const durationSeconds = parseDuration(duration);
        const isShort = durationSeconds <= 60;
        
        return {
          id: video.id,
          title: video.snippet.title,
          description: video.snippet.description,
          thumbnail: video.snippet.thumbnails.high?.url || video.snippet.thumbnails.medium?.url || video.snippet.thumbnails.default?.url,
          publishedAt: video.snippet.publishedAt,
          duration: duration,
          durationSeconds: durationSeconds,
          isShort: isShort,
          views: parseInt(video.statistics?.viewCount || 0),
          likes: parseInt(video.statistics?.likeCount || 0),
          comments: parseInt(video.statistics?.commentCount || 0),
          url: `https://www.youtube.com/shorts/${video.id}`
        };
      })
      .filter(v => type === 'short' ? v.isShort : true);

    console.log(`✅ Encontrados ${videos.length} vídeos`);

    return Response.json({ 
      success: true,
      videos: videos,
      totalResults: videos.length
    });

  } catch (error) {
    console.error('Erro:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function parseDuration(duration) {
  if (!duration) return 0;
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}