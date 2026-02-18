import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgClient from 'npm:@sendgrid/client@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgClient.setApiKey(apiKey);

    // Buscar informações da conta
    const [accountResponse] = await sgClient.request({
      method: 'GET',
      url: '/v3/user/account'
    });

    // Buscar limites de envio
    const [quotaResponse] = await sgClient.request({
      method: 'GET',
      url: '/v3/user/credits'
    });

    return Response.json({
      success: true,
      account: accountResponse.body,
      quota: quotaResponse.body
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});