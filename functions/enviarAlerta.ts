import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    const { alerta_id } = await req.json();

    const alerta = await base44.entities.AlertaConector.filter({ id: alerta_id });
    if (!alerta[0]) return Response.json({ error: 'Alerta não encontrado' }, { status: 404 });

    const config = await base44.entities.ConfiguracaoAlerta.filter({ 
      escritorio_id: alerta[0].escritorio_id 
    });

    if (!config[0]) return Response.json({ error: 'Configuração não encontrada' }, { status: 404 });

    if (config[0].ativar_email && !alerta[0].notificado_email) {
      await enviarEmail(base44, config[0], alerta[0]);
      await base44.entities.AlertaConector.update(alerta_id, { notificado_email: true });
    }

    if (config[0].ativar_webhook && !alerta[0].notificado_webhook) {
      await enviarWebhook(config[0].webhook_url, alerta[0]);
      await base44.entities.AlertaConector.update(alerta_id, { notificado_webhook: true });
    }

    return Response.json({ enviado: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

async function enviarEmail(base44, config, alerta) {
  for (const email of config.email_destinatarios || []) {
    await base44.integrations.Core.SendEmail({
      to: email,
      subject: `🚨 Alerta API: ${alerta.tipo_alerta}`,
      body: `Severidade: ${alerta.severidade}\n\n${alerta.mensagem}\n\nDetalhes: ${JSON.stringify(alerta.detalhes, null, 2)}`
    });
  }
}

async function enviarWebhook(url, alerta) {
  if (!url) return;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alerta)
  });
}