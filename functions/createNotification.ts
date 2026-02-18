import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { 
      destinatario_email,
      tipo,
      titulo,
      mensagem,
      link_acao,
      entidade_relacionada,
      prioridade = 'media',
      escritorio_id
    } = await req.json();

    if (!destinatario_email || !titulo || !mensagem) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await base44.asServiceRole.entities.User.filter({
      email: destinatario_email
    });

    if (!user[0]) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const prefs = user[0].notification_prefs || {};
    const shouldNotify = prefs[tipo] !== false;

    if (!shouldNotify) {
      return Response.json({ skipped: true, reason: 'User preferences' });
    }

    const notificacao = await base44.asServiceRole.entities.Notificacao.create({
      destinatario_email,
      tipo,
      titulo,
      mensagem,
      link_acao,
      entidade_relacionada,
      prioridade,
      escritorio_id,
      lida: false
    });

    return Response.json({ success: true, notificacao });
  } catch (error) {
    console.error('Create notification error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});