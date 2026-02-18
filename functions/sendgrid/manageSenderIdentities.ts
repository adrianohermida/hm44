import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgClient from 'npm:@sendgrid/client@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, sender_id, nickname, from_email, from_name, reply_to, address, city, country } = await req.json();

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
          url: '/v3/senders'
        });
        break;

      case 'create':
        if (!nickname || !from_email) {
          return Response.json({ error: 'nickname e from_email são obrigatórios' }, { status: 400 });
        }
        
        response = await sgClient.request({
          method: 'POST',
          url: '/v3/senders',
          body: {
            nickname,
            from: { email: from_email, name: from_name },
            reply_to: reply_to || from_email,
            address,
            city,
            country: country || 'BR'
          }
        });
        break;

      case 'get':
        if (!sender_id) {
          return Response.json({ error: 'sender_id é obrigatório' }, { status: 400 });
        }
        response = await sgClient.request({
          method: 'GET',
          url: `/v3/senders/${sender_id}`
        });
        break;

      case 'delete':
        if (!sender_id) {
          return Response.json({ error: 'sender_id é obrigatório' }, { status: 400 });
        }
        response = await sgClient.request({
          method: 'DELETE',
          url: `/v3/senders/${sender_id}`
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