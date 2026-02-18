import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgMail from 'npm:@sendgrid/mail@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, template_id, dynamic_template_data, from_name, categories, custom_args, send_at } = await req.json();

    if (!to || !template_id) {
      return Response.json({ error: 'to e template_id são obrigatórios' }, { status: 400 });
    }

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgMail.setApiKey(apiKey);

    const msg = {
      to,
      from: {
        email: 'contato@hermidamaia.adv.br',
        name: from_name || 'Dr. Adriano Hermida Maia'
      },
      reply_to: { email: user.email, name: user.full_name },
      template_id,
      dynamic_template_data: dynamic_template_data || {},
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true }
      }
    };

    if (categories) msg.categories = categories;
    if (custom_args) msg.custom_args = custom_args;
    if (send_at) msg.send_at = send_at;

    const response = await sgMail.send(msg);
    const messageId = response[0]?.headers?.['x-message-id'];

    return Response.json({
      success: true,
      message_id: messageId,
      message: 'Email template enviado'
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});