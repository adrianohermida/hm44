import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgClient from 'npm:@sendgrid/client@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { action, webhook_id, enabled, url, group_resubscribe, delivered, group_unsubscribe, spam_report, bounce, deferred, unsubscribe, dropped, open, click, processed } = await req.json();

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgClient.setApiKey(apiKey);

    let response;

    switch (action) {
      case 'get_event_webhook':
        response = await sgClient.request({
          method: 'GET',
          url: '/v3/user/webhooks/event/settings'
        });
        break;

      case 'update_event_webhook':
        if (!url) {
          return Response.json({ error: 'url é obrigatório' }, { status: 400 });
        }
        
        response = await sgClient.request({
          method: 'PATCH',
          url: '/v3/user/webhooks/event/settings',
          body: {
            enabled: enabled !== undefined ? enabled : true,
            url,
            group_resubscribe: group_resubscribe || false,
            delivered: delivered || false,
            group_unsubscribe: group_unsubscribe || false,
            spam_report: spam_report || false,
            bounce: bounce || false,
            deferred: deferred || false,
            unsubscribe: unsubscribe || false,
            dropped: dropped || false,
            open: open || false,
            click: click || false,
            processed: processed || false
          }
        });
        break;

      case 'test_event_webhook':
        if (!url) {
          return Response.json({ error: 'url é obrigatório' }, { status: 400 });
        }
        
        response = await sgClient.request({
          method: 'POST',
          url: '/v3/user/webhooks/event/test',
          body: { url }
        });
        break;

      case 'get_parse_webhook':
        response = await sgClient.request({
          method: 'GET',
          url: '/v3/user/webhooks/parse/settings'
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