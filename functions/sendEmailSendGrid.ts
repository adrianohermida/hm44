import sgMail from 'npm:@sendgrid/mail@8.1.3';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    console.log('📧 SendGrid: Iniciando envio de email');
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      console.log('❌ Usuário não autenticado');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, body, ticket_id, from_name, attachments = [], cc, bcc } = await req.json();
    console.log('📋 Dados recebidos:', { to, subject, ticket_id, hasBody: !!body });

    if (!to || !subject || !body) {
      console.log('❌ Campos obrigatórios faltando');
      return Response.json({ error: 'Campos obrigatórios: to, subject, body' }, { status: 400 });
    }

    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      console.log('❌ SENDGRID_API_TOKEN não configurado');
      return Response.json({ error: 'SENDGRID_API_TOKEN não configurado' }, { status: 500 });
    }

    console.log('✅ API Key encontrada, enviando para SendGrid...');

    sgMail.setApiKey(apiKey);

    // ✅ COMPLIANCE: Categories + CustomArgs + ReplyTo
    const msg = {
      to,
      ...(cc && { cc }),
      ...(bcc && { bcc }),
      from: {
        name: from_name || user.full_name || 'Dr. Adriano Hermida Maia',
        email: 'contato@hermidamaia.adv.br'
      },
      replyTo: {
        email: user.email,
        name: user.full_name
      },
      subject,
      html: body,
      categories: ['helpdesk', 'ticket', ticket_id ? 'resposta' : 'novo'],
      customArgs: {
        ticket_id: ticket_id || 'new',
        user_email: user.email,
        tipo_email: 'resposta_ticket'
      },
      headers: {
        'X-Ticket-ID': ticket_id || '',
        'X-Entity-ID': ticket_id || ''
      },
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true }
      },
      ...(attachments.length > 0 && {
        attachments: attachments.map(a => ({
          content: a.content,
          filename: a.filename,
          type: a.type,
          disposition: 'attachment'
        }))
      })
    };

    console.log('📨 Enviando via @sendgrid/mail...');

    const response = await sgMail.send(msg);
    const messageId = response[0].headers['x-message-id'];
    
    console.log('✅ Email enviado! Message ID:', messageId);

    return Response.json({ 
      success: true,
      message_id: messageId
    });

  } catch (error) {
    console.error('💥 Erro crítico:', error);
    console.error('Stack:', error.stack);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});