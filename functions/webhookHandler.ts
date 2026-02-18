import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const url = new URL(req.url);
    const webhookId = url.pathname.split('/').pop();

    const token = req.headers.get('X-Webhook-Token');
    const evento = req.headers.get('X-Event-Type') || 'unknown';
    const payload = await req.json();

    const webhook = await base44.asServiceRole.entities.WebhookConector.filter({ 
      url_webhook: { $regex: webhookId } 
    }).then(r => r[0]);

    if (!webhook) {
      return Response.json({ error: 'Webhook não encontrado' }, { status: 404 });
    }

    const validado = token === webhook.token_validacao;
    const startTime = Date.now();

    let sucesso = true;
    let erro_mensagem = null;

    if (!validado) {
      sucesso = false;
      erro_mensagem = 'Token de validação inválido';
    }

    const tempo_resposta_ms = Date.now() - startTime;

    await base44.asServiceRole.entities.LogWebhook.create({
      escritorio_id: webhook.escritorio_id,
      webhook_id: webhook.id,
      evento,
      payload,
      headers: Object.fromEntries(req.headers.entries()),
      status_code: sucesso ? 200 : 401,
      tempo_resposta_ms,
      sucesso,
      erro_mensagem,
      ip_origem: req.headers.get('x-forwarded-for') || 'unknown',
      validado
    });

    await base44.asServiceRole.entities.WebhookConector.update(webhook.id, {
      total_chamadas: (webhook.total_chamadas || 0) + 1,
      ultima_chamada: new Date().toISOString()
    });

    if (!validado) {
      return Response.json({ error: erro_mensagem }, { status: 401 });
    }

    return Response.json({ 
      success: true, 
      message: 'Webhook recebido com sucesso',
      webhook_id: webhook.id 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});