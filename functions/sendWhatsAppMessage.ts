import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { conversa_id, conteudo, midia_url } = await req.json();
    
    if (!conversa_id || !conteudo) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const conversa = await base44.asServiceRole.entities.Conversa.filter({
      id: conversa_id,
      escritorio_id: user.escritorio_id
    });
    
    if (!conversa[0]) {
      return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }
    
    const conv = conversa[0];
    const to = conv.cliente_telefone;
    
    if (!to) {
      return Response.json({ error: 'No phone number in conversation' }, { status: 400 });
    }
    
    const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
    const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');
    
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      return Response.json({ error: 'WhatsApp not configured' }, { status: 500 });
    }
    
    let messagePayload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to,
      type: 'text',
      text: { body: conteudo }
    };
    
    if (midia_url) {
      messagePayload = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'image',
        image: { link: midia_url }
      };
    }
    
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messagePayload)
      }
    );
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error?.message || 'WhatsApp API error');
    }
    
    const mensagem = await base44.asServiceRole.entities.Mensagem.create({
      conversa_id,
      remetente_email: user.email,
      remetente_nome: user.full_name,
      tipo_remetente: 'admin',
      conteudo,
      whatsapp_wamid: result.messages?.[0]?.id,
      whatsapp_status: 'enviando',
      midia_url,
      escritorio_id: user.escritorio_id
    });
    
    await base44.asServiceRole.entities.Conversa.update(conversa_id, {
      ultima_mensagem: conteudo.substring(0, 100),
      ultima_atualizacao: new Date().toISOString(),
      status: 'respondida'
    });
    
    return Response.json({ 
      success: true, 
      mensagem,
      whatsapp_message_id: result.messages?.[0]?.id 
    });
    
  } catch (error) {
    console.error('Send WhatsApp Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});