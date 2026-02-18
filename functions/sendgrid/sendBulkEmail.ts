import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgMail from 'npm:@sendgrid/mail@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { recipients, subject, body, from_name, template_id, dynamic_template_data } = await req.json();

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return Response.json({ error: 'recipients deve ser array não-vazio' }, { status: 400 });
    }

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    sgMail.setApiKey(apiKey);

    const fromEmail = 'contato@hermidamaia.adv.br';
    const personalizations = recipients.map(recipient => ({
      to: [{ email: recipient.email, name: recipient.name }],
      dynamic_template_data: recipient.data || dynamic_template_data || {}
    }));

    const msg = {
      personalizations,
      from: {
        email: fromEmail,
        name: from_name || 'Dr. Adriano Hermida Maia'
      },
      reply_to: { email: user.email, name: user.full_name }
    };

    if (template_id) {
      msg.template_id = template_id;
    } else if (subject && body) {
      msg.subject = subject;
      msg.content = [{ type: 'text/html', value: body }];
    } else {
      return Response.json({ error: 'Forneça template_id OU subject+body' }, { status: 400 });
    }

    await sgMail.send(msg);

    return Response.json({
      success: true,
      recipients_count: recipients.length,
      message: 'Emails enviados com sucesso'
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});