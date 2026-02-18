import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgClient from 'npm:@sendgrid/client@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, email, group_id } = await req.json();

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgClient.setApiKey(apiKey);

    let response;

    switch (action) {
      case 'list_bounces':
        response = await sgClient.request({
          method: 'GET',
          url: '/v3/suppression/bounces'
        });
        break;

      case 'list_blocks':
        response = await sgClient.request({
          method: 'GET',
          url: '/v3/suppression/blocks'
        });
        break;

      case 'list_spam_reports':
        response = await sgClient.request({
          method: 'GET',
          url: '/v3/suppression/spam_reports'
        });
        break;

      case 'list_unsubscribes':
        response = await sgClient.request({
          method: 'GET',
          url: '/v3/suppression/unsubscribes'
        });
        break;

      case 'delete_bounce':
        if (!email) {
          return Response.json({ error: 'email é obrigatório' }, { status: 400 });
        }
        response = await sgClient.request({
          method: 'DELETE',
          url: `/v3/suppression/bounces/${email}`
        });
        break;

      case 'add_to_unsubscribe_group':
        if (!email || !group_id) {
          return Response.json({ error: 'email e group_id são obrigatórios' }, { status: 400 });
        }
        response = await sgClient.request({
          method: 'POST',
          url: `/v3/asm/groups/${group_id}/suppressions`,
          body: { recipient_emails: [email] }
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