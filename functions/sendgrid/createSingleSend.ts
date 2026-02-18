import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgClient from 'npm:@sendgrid/client@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { name, send_at, list_ids, segment_ids, from_email, from_name, subject, html_content, plain_content, categories, custom_unsubscribe_url } = await req.json();

    if (!name || !subject) {
      return Response.json({ error: 'name e subject são obrigatórios' }, { status: 400 });
    }

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgClient.setApiKey(apiKey);

    const singleSend = {
      name,
      send_at: send_at ? new Date(send_at).toISOString() : undefined,
      send_to: {
        list_ids: list_ids || [],
        segment_ids: segment_ids || [],
        all: !list_ids && !segment_ids
      },
      email_config: {
        subject,
        html_content: html_content || `<html><body>${plain_content}</body></html>`,
        plain_content: plain_content || '',
        sender_id: 0, // Usar sender padrão
        suppression_group_id: 0,
        custom_unsubscribe_url: custom_unsubscribe_url || ''
      },
      categories: categories || []
    };

    const [response] = await sgClient.request({
      method: 'POST',
      url: '/v3/marketing/singlesends',
      body: singleSend
    });

    return Response.json({
      success: true,
      single_send_id: response.body.id,
      status: response.body.status,
      data: response.body
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});