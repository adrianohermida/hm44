import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const YOUTUBE_ANALYTICS_API_KEY = Deno.env.get('YOUTUBE_ANALYTICS_API_KEY');
    const { channelId, startDate, endDate, metrics = 'views,likes,comments,shares' } = await req.json();

    if (!channelId) {
      return Response.json({ error: 'channelId é obrigatório' }, { status: 400 });
    }

    const start = startDate || '2024-01-01';
    const end = endDate || new Date().toISOString().split('T')[0];

    // YouTube Analytics API endpoint
    const analyticsUrl = `https://youtubeanalytics.googleapis.com/v2/reports?ids=channel==${channelId}&startDate=${start}&endDate=${end}&metrics=${metrics}&dimensions=day&key=${YOUTUBE_ANALYTICS_API_KEY}`;
    
    const response = await fetch(analyticsUrl);
    const data = await response.json();

    if (!response.ok) {
      return Response.json({ error: data.error?.message || 'Erro ao buscar analytics' }, { status: 400 });
    }

    // Processar dados
    const analytics = {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,
      dailyData: []
    };

    if (data.rows && data.rows.length > 0) {
      data.rows.forEach(row => {
        analytics.totalViews += row[1] || 0;
        analytics.totalLikes += row[2] || 0;
        analytics.totalComments += row[3] || 0;
        analytics.totalShares += row[4] || 0;
        
        analytics.dailyData.push({
          date: row[0],
          views: row[1] || 0,
          likes: row[2] || 0,
          comments: row[3] || 0,
          shares: row[4] || 0
        });
      });
    }

    return Response.json({ 
      success: true,
      analytics: analytics,
      period: { startDate: start, endDate: end }
    });

  } catch (error) {
    console.error('Erro:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});