import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import sgMail from 'npm:@sendgrid/mail@8.1.0';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, body, attachments, from_name } = await req.json();

    if (!to || !subject || !body) {
      return Response.json({ error: 'to, subject e body são obrigatórios' }, { status: 400 });
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
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true }
      }
    };

    // Processar anexos
    if (attachments && Array.isArray(attachments)) {
      msg.attachments = await Promise.all(attachments.map(async (att) => {
        // Se é URL, baixar conteúdo
        if (att.url) {
          const fileResponse = await fetch(att.url);
          const buffer = await fileResponse.arrayBuffer();
          const base64Content = btoa(String.fromCharCode(...new Uint8Array(buffer)));
          
          return {
            content: base64Content,
            filename: att.filename || 'anexo.pdf',
            type: att.type || 'application/pdf',
            disposition: 'attachment'
          };
        }
        
        // Se já é base64
        return {
          content: att.content,
          filename: att.filename,
          type: att.type,
          disposition: att.disposition || 'attachment'
        };
      }));
    }

    const response = await sgMail.send(msg);
    const messageId = response[0]?.headers?.['x-message-id'];

    return Response.json({
      success: true,
      message_id: messageId,
      attachments_count: attachments?.length || 0
    });

  } catch (error) {
    return Response.json({ error: error.message, details: error.response?.body }, { status: 500 });
  }
});