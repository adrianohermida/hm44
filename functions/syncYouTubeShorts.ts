import { base44 } from '@base44/sdk/deno';

export default async function syncYouTubeShorts(req) {
  try {
    const token = await base44.asServiceRole.connectors.getAccessToken('youtube');
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCj-7oLHb-J-tKxF8Xqr5wTg&maxResults=20&order=date&type=video&videoDuration=short`,
      {
        headers: { 'Authorization': `Bearer ${token}` }
      }
    );
    
    const data = await response.json();
    
    for (const item of data.items) {
      const existing = await base44.entities.YouTubeShort.filter({ video_id: item.id.videoId });
      
      if (existing.length === 0) {
        await base44.entities.YouTubeShort.create({
          video_id: item.id.videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail_url: item.snippet.thumbnails.high.url,
          published_at: item.snippet.publishedAt,
          ativo: true,
          ordem: 0
        });
      }
    }
    
    return { success: true, synced: data.items.length };
  } catch (error) {
    console.error('Sync error:', error);
    return { success: false, error: error.message };
  }
}