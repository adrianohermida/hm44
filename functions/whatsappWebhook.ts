import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');
      
      const VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'base44_webhook';
      
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        return new Response(challenge, { status: 200 });
      }
      
      return new Response('Forbidden', { status: 403 });
    }
    
    if (req.method === 'POST') {
      const body = await req.json();
      
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      
      if (!value?.messages) {
        return Response.json({ success: true });
      }
      
      for (const message of value.messages) {
        const from = message.from;
        const wamid = message.id;
        const timestamp = message.timestamp;
        const type = message.type;
        
        let conteudo = '';
        let midia_url = null;
        let midia_tipo = null;
        
        if (type === 'text') {
          conteudo = message.text.body;
        } else if (type === 'image' || type === 'video' || type === 'document') {
          midia_url = message[type].id;
          midia_tipo = message[type].mime_type;
          conteudo = message[type].caption || `[${type}]`;
        }
        
        const escritorios = await base44.asServiceRole.entities.Escritorio.list();
        const escritorio_id = escritorios[0]?.id;
        
        if (!escritorio_id) continue;
        
        const conversasExistentes = await base44.asServiceRole.entities.Conversa.filter({
          cliente_telefone: from,
          escritorio_id
        });
        
        let conversa = conversasExistentes[0];
        
        if (!conversa) {
          conversa = await base44.asServiceRole.entities.Conversa.create({
            cliente_telefone: from,
            cliente_nome: value.contacts?.[0]?.profile?.name || from,
            cliente_email: `whatsapp_${from}@temp.com`,
            tipo: 'whatsapp',
            canal: 'whatsapp',
            status: 'aberta',
            ultima_mensagem: conteudo.substring(0, 100),
            ultima_atualizacao: new Date(parseInt(timestamp) * 1000).toISOString(),
            whatsapp_wamid: wamid,
            escritorio_id
          });
        } else {
          await base44.asServiceRole.entities.Conversa.update(conversa.id, {
            ultima_mensagem: conteudo.substring(0, 100),
            ultima_atualizacao: new Date(parseInt(timestamp) * 1000).toISOString(),
            status: 'aberta'
          });
        }
        
        await base44.asServiceRole.entities.Mensagem.create({
          conversa_id: conversa.id,
          remetente_email: conversa.cliente_email,
          remetente_nome: conversa.cliente_nome,
          tipo_remetente: 'cliente',
          conteudo,
          whatsapp_wamid: wamid,
          whatsapp_status: 'entregue',
          midia_url,
          midia_tipo,
          escritorio_id
        });
      }
      
      if (value?.statuses) {
        for (const status of value.statuses) {
          const wamid = status.id;
          const newStatus = status.status;
          
          const mensagens = await base44.asServiceRole.entities.Mensagem.filter({
            whatsapp_wamid: wamid
          });
          
          if (mensagens[0]) {
            await base44.asServiceRole.entities.Mensagem.update(mensagens[0].id, {
              whatsapp_status: newStatus
            });
          }
        }
      }
      
      return Response.json({ success: true });
    }
    
    return new Response('Method not allowed', { status: 405 });
  } catch (error) {
    console.error('WhatsApp Webhook Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});