import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgClient from 'npm:@sendgrid/client@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: 'email é obrigatório' }, { status: 400 });
    }

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgClient.setApiKey(apiKey);

    // Validar email usando API SendGrid
    const [response] = await sgClient.request({
      method: 'POST',
      url: '/v3/validations/email',
      body: { email }
    });

    return Response.json({
      success: true,
      validation: response.body
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});