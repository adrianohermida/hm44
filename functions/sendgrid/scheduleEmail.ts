import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgMail from 'npm:@sendgrid/mail@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, body, send_at, batch_id, from_name } = await req.json();

    if (!to || !subject || !body || !send_at) {
      return Response.json({ error: 'to, subject, body e send_at são obrigatórios' }, { status: 400 });
    }

    const sendAtTimestamp = Math.floor(new Date(send_at).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);

    if (sendAtTimestamp <= now) {
      return Response.json({ error: 'send_at deve ser no futuro' }, { status: 400 });
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
      subject,
      html: body,
      send_at: sendAtTimestamp,
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true }
      }
    };

    if (batch_id) msg.batch_id = batch_id;

    const response = await sgMail.send(msg);
    const messageId = response[0]?.headers?.['x-message-id'];

    return Response.json({
      success: true,
      message_id: messageId,
      scheduled_for: send_at,
      message: 'Email agendado com sucesso'
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});