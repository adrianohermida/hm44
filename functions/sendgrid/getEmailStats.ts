import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgClient from 'npm:@sendgrid/client@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { start_date, end_date, aggregated_by = 'day' } = await req.json();

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgClient.setApiKey(apiKey);

    // Estatísticas globais
    const [globalResponse] = await sgClient.request({
      method: 'GET',
      url: '/v3/stats',
      qs: {
        start_date: start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: end_date || new Date().toISOString().split('T')[0],
        aggregated_by
      }
    });

    return Response.json({
      success: true,
      stats: globalResponse.body
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});