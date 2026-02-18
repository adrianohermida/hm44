import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Não autorizado' }, { status: 403 });
    }

    const { titulo, assunto, mensagem, escritorio_id } = await req.json();

    // Buscar preferências de email
    const preferencias = await base44.asServiceRole.entities.EmailPreferencia.list();
    const emailsBanidos = preferencias
      .filter(p => p.banido || !p.aceita_marketing)
      .map(p => p.email);

    // Buscar todos os clientes do escritório
    const allUsers = await base44.asServiceRole.entities.User.list();
    const clientes = allUsers.filter(u => 
      u.escritorio_id === escritorio_id && 
      u.role === 'user' &&
      u.email &&
      !emailsBanidos.includes(u.email)
    );

    // Criar registro da campanha
    const campanha = await base44.asServiceRole.entities.Campanha.create({
      titulo,
      assunto,
      mensagem,
      escritorio_id,
      status: 'em_envio',
      destinatarios_count: clientes.length,
      enviados_count: 0,
    });

    // Enviar emails com footer LGPD
    let enviados = 0;
    const origin = req.headers.get('origin') || 'https://seu-dominio.com';
    
    for (const cliente of clientes) {
      try {
        const pref = preferencias.find(p => p.email === cliente.email);
        const token = pref?.unsubscribe_token || crypto.randomUUID();
        
        const footerLgpd = `
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280;">
            <p>Você está recebendo este email porque se cadastrou em nosso escritório.</p>
            <p><a href="${origin}/unsubscribe?token=${token}" style="color: #10b981;">Cancelar inscrição</a></p>
            <p>Conforme LGPD - Lei 13.709/2018</p>
          </div>
        `;

        await base44.integrations.Core.SendEmail({
          to: cliente.email,
          subject: assunto,
          body: mensagem + footerLgpd,
          from_name: 'Dr. Adriano Hermida Maia',
        });
        enviados++;
      } catch (error) {
        console.error(`Erro ao enviar para ${cliente.email}:`, error);
      }
    }

    // Atualizar campanha
    await base44.asServiceRole.entities.Campanha.update(campanha.id, {
      status: 'enviada',
      enviados_count: enviados,
      data_envio: new Date().toISOString(),
    });

    return Response.json({ 
      success: true, 
      campanha_id: campanha.id,
      destinatarios: clientes.length,
      enviados 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});