import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { template_id, ticket_id } = await req.json();

    const [template] = await base44.asServiceRole.entities.TemplateResposta.filter({ id: template_id });
    const [ticket] = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });

    if (!template || !ticket) {
      return Response.json({ error: 'Template ou ticket não encontrado' }, { status: 404 });
    }

    let [cliente] = await base44.asServiceRole.entities.Cliente.filter({ 
      id: ticket.cliente_id 
    });

    if (!cliente && ticket.cliente_email) {
      [cliente] = await base44.asServiceRole.entities.Cliente.filter({
        email: ticket.cliente_email
      });
    }

    // Buscar dados do escritório
    const [escritorio] = await base44.asServiceRole.entities.Escritorio.filter({ 
      id: ticket.escritorio_id 
    });

    // Buscar última mensagem do ticket
    const mensagens = await base44.asServiceRole.entities.TicketMensagem.filter({
      ticket_id: ticket.id
    }, '-created_date', 1);
    const ultimaMensagem = mensagens[0];

    // Variáveis disponíveis
    const variaveis = {
      'cliente.nome': cliente?.nome_completo || ticket.cliente_nome || 'Cliente',
      'cliente.email': ticket.cliente_email,
      'cliente.telefone': cliente?.telefones?.[0]?.numero || '',
      'ticket.numero': ticket.numero_ticket || ticket.id.substring(0, 8).toUpperCase(),
      'ticket.titulo': ticket.titulo,
      'ticket.status': ticket.status,
      'ticket.prioridade': ticket.prioridade || 'media',
      'ticket.categoria': ticket.categoria || '',
      'ticket.ultima_mensagem': ultimaMensagem?.conteudo?.substring(0, 100) || '',
      'agente.nome': user.full_name,
      'agente.email': user.email,
      'agente.cargo': user.cargo || 'Atendente',
      'escritorio.nome': escritorio?.nome_fantasia || 'Hermida Maia Advogados',
      'escritorio.email': escritorio?.email_contato || '',
      'escritorio.telefone': escritorio?.telefone_principal || '',
      'data.hoje': new Date().toLocaleDateString('pt-BR'),
      'data.hora': new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      'data.completa': new Date().toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    // Processar template
    let assunto = template.assunto || '';
    let corpo = template.corpo;

    Object.entries(variaveis).forEach(([chave, valor]) => {
      const regex = new RegExp(`{{\\s*${chave}\\s*}}`, 'g');
      assunto = assunto.replace(regex, valor);
      corpo = corpo.replace(regex, valor);
    });

    // Incrementar contador de uso
    await base44.asServiceRole.entities.TemplateResposta.update(template_id, {
      vezes_usado: (template.vezes_usado || 0) + 1
    });

    return Response.json({
      success: true,
      assunto,
      corpo,
      variaveis_usadas: Object.keys(variaveis)
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});