import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgClient from 'npm:@sendgrid/client@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, template_id, name, generation = 'dynamic' } = await req.json();

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgClient.setApiKey(apiKey);

    let response;

    switch (action) {
      case 'list':
        response = await sgClient.request({
          method: 'GET',
          url: `/v3/templates?generations=${generation}`
        });
        break;

      case 'get':
        if (!template_id) {
          return Response.json({ error: 'template_id é obrigatório' }, { status: 400 });
        }
        response = await sgClient.request({
          method: 'GET',
          url: `/v3/templates/${template_id}`
        });
        break;

      case 'create':
        if (!name) {
          return Response.json({ error: 'name é obrigatório' }, { status: 400 });
        }
        response = await sgClient.request({
          method: 'POST',
          url: '/v3/templates',
          body: { name, generation }
        });
        break;

      case 'delete':
        if (!template_id) {
          return Response.json({ error: 'template_id é obrigatório' }, { status: 400 });
        }
        response = await sgClient.request({
          method: 'DELETE',
          url: `/v3/templates/${template_id}`
        });
        break;

      default:
        return Response.json({ error: 'Ação inválida' }, { status: 400 });
    }

    return Response.json({
      success: true,
      data: response[1]?.body || response[1]
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});