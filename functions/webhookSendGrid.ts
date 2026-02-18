import { EventWebhook, EventWebhookHeader } from 'npm:@sendgrid/eventwebhook@8.0.0';
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    console.log('📨 SendGrid webhook received');
    
    // ✅ SECURITY: Verificar assinatura ANTES de processar
    const publicKey = Deno.env.get('SENDGRID_WEBHOOK_PUBLIC_KEY');
    
    if (publicKey) {
      const signature = req.headers.get(EventWebhookHeader.SIGNATURE());
      const timestamp = req.headers.get(EventWebhookHeader.TIMESTAMP());
      const body = await req.text();
      
      // Validar timestamp (prevenir replay attacks - 10 minutos max)
      const MAX_AGE = 600000;
      const timestampMs = parseInt(timestamp) * 1000;
      if (Math.abs(Date.now() - timestampMs) > MAX_AGE) {
        console.log('❌ Timestamp expirado:', { timestamp, now: Date.now() });
        return Response.json({ error: 'Request too old' }, { status: 400 });
      }
      
      const eventWebhook = new EventWebhook();
      const ecPublicKey = eventWebhook.convertPublicKeyToECDSA(publicKey);
      
      if (!eventWebhook.verifySignature(ecPublicKey, body, signature, timestamp)) {
        console.log('❌ Invalid signature');
        return Response.json({ error: 'Invalid signature' }, { status: 403 });
      }
      
      console.log('✅ Signature verified');
      const events = JSON.parse(body);
      
      if (!Array.isArray(events)) {
        return Response.json({ error: 'Invalid payload' }, { status: 400 });
      }
      
      await processEvents(events);
      return Response.json({ success: true, processed: events.length });
    } else {
      console.log('⚠️ SENDGRID_WEBHOOK_PUBLIC_KEY not set, skipping signature verification');
      const events = await req.json();
      
      if (!Array.isArray(events)) {
        return Response.json({ error: 'Invalid payload' }, { status: 400 });
      }
      
      await processEvents(events);
      return Response.json({ success: true, processed: events.length });
    }

    async function processEvents(events) {
      const base44 = createClientFromRequest(req);

      for (const event of events) {
        const { event: eventType, sg_message_id, email, timestamp } = event;
        
        console.log(`Processing event: ${eventType} for ${email}`);

        // Buscar EmailStatus pelo sendgrid_message_id
        const statusRecords = await base44.asServiceRole.entities.EmailStatus.filter({
          sendgrid_message_id: sg_message_id
        });

        if (statusRecords.length === 0) {
          console.log(`No EmailStatus found for message_id: ${sg_message_id}`);
          continue;
        }

        const statusRecord = statusRecords[0];
        const updateData = {
          eventos: [...(statusRecord.eventos || []), event]
        };

        // Mapear eventos para status
        switch (eventType) {
          case 'delivered':
            updateData.status = 'entregue';
            updateData.timestamp_entrega = new Date(timestamp * 1000).toISOString();
            break;
          case 'open':
            updateData.status = 'aberto';
            updateData.timestamp_abertura = new Date(timestamp * 1000).toISOString();
            break;
          case 'click':
            updateData.status = 'clicado';
            break;
          case 'bounce':
          case 'dropped':
            updateData.status = 'bounce';
            break;
          case 'spamreport':
            updateData.status = 'spam';
            break;
          case 'deferred':
            updateData.status = 'enviando';
            break;
        }

        await base44.asServiceRole.entities.EmailStatus.update(statusRecord.id, updateData);

        // Criar notificação se email foi aberto
        if (eventType === 'open' && statusRecord.ticket_id) {
          const escritorios = await base44.asServiceRole.entities.Escritorio.list();
          
          if (!escritorios || escritorios.length === 0) {
            console.log('⚠️ Escritório não encontrado, pulando notificação');
            continue;
          }

          const [ticket] = await base44.asServiceRole.entities.Ticket.filter({
            id: statusRecord.ticket_id
          });

          if (ticket && ticket.responsavel_email) {
            await base44.asServiceRole.entities.Notificacao.create({
              titulo: 'Email aberto',
              mensagem: `Cliente abriu email: ${ticket.titulo}`,
              tipo: 'ticket',
              prioridade: 'baixa',
              destinatario_email: ticket.responsavel_email,
              link_acao: `/Helpdesk`,
              entidade_relacionada: ticket.id,
              escritorio_id: escritorios[0].id
            });
          }
        }
      }
    }

  } catch (error) {
    console.error('SendGrid webhook error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});