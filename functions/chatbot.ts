import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const isHorarioComercial = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
};

const precisaAtendimentoHumano = (message, tentativas) => {
  const keywords = ['falar com atendente', 'falar com humano', 'quero ajuda', 'advogado', 'urgente', 'emergência'];
  return tentativas >= 3 || keywords.some(kw => message.toLowerCase().includes(kw));
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { message, isAuthenticated, userEmail, userName, conversaId, tentativas = 0 } = await req.json();

    const horarioComercial = isHorarioComercial();
    const precisaHumano = precisaAtendimentoHumano(message, tentativas);

    let promptContext = isAuthenticated
      ? `Você é um assistente jurídico especializado em direito do consumidor e superendividamento. 
         O usuário está autenticado como cliente. Responda de forma profissional e empática.
         ${precisaHumano ? 'IMPORTANTE: O usuário precisa de atendimento humano. Informe que você irá encaminhar.' : ''}
         ${!horarioComercial && precisaHumano ? 'Está fora do horário comercial. Informe que será criado um ticket de atendimento.' : ''}`
      : `Você é um assistente virtual do escritório Dr. Adriano Hermida Maia, especializado em defesa do superendividado.
         Se a pessoa demonstrar ser cliente existente, oriente-a a fazer login para atendimento seguro.
         Para novos leads, ${horarioComercial ? 'informe que pode encaminhar ao atendimento.' : 'informe que o horário de atendimento é de segunda a sexta, 9h às 18h.'}`;

    const llmResponse = await base44.integrations.Core.InvokeLLM({
      prompt: `${promptContext}\n\nMensagem do usuário: ${message}\n\nResponda de forma breve (máx 3 parágrafos).`
    });

    let conversaIdFinal = conversaId;
    let ticketCriado = null;
    
    // Obter escritório correto (multitenant)
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    if (!escritorioId) {
      return Response.json({ 
        response: 'Sistema temporariamente indisponível. Tente novamente em instantes.',
        error: 'Escritório não configurado'
      }, { status: 500 });
    }
    
    // Criar conversa para TODOS (autenticado OU visitante)
    if (!conversaId) {
      const sessionId = crypto.randomUUID();
      
      const conversa = await base44.asServiceRole.entities.Conversa.create({
        cliente_email: userEmail || `visitante_${sessionId}@anonimo`,
        cliente_nome: userName || 'Visitante Anônimo',
        tipo: isAuthenticated ? 'cliente' : 'visitante',
        canal: 'chat_widget',
        status: 'aberta',
        ultima_mensagem: message,
        ultima_atualizacao: new Date().toISOString(),
        dados_visitante: !isAuthenticated ? {
          sessionId,
          userAgent: 'web',
          referrer: 'widget'
        } : undefined,
        escritorio_id: escritorioId
      });
      conversaIdFinal = conversa.id;

      // Mensagem do usuário/visitante
      await base44.asServiceRole.entities.Mensagem.create({
        conversa_id: conversa.id,
        remetente_email: conversa.cliente_email,
        remetente_nome: conversa.cliente_nome,
        tipo_remetente: isAuthenticated ? 'cliente' : 'visitante',
        conteudo: message,
        escritorio_id: escritorioId
      });
    } else {
      // Conversa existente - nova mensagem
      const conversaExistente = await base44.asServiceRole.entities.Conversa.list();
      const conversa = conversaExistente.find(c => c.id === conversaId);
      
      await base44.asServiceRole.entities.Mensagem.create({
        conversa_id: conversaId,
        remetente_email: conversa?.cliente_email || userEmail || 'visitante@anonimo',
        remetente_nome: conversa?.cliente_nome || userName || 'Visitante',
        tipo_remetente: isAuthenticated ? 'cliente' : 'visitante',
        conteudo: message,
        escritorio_id: escritorioId
      });

      // Atualizar última mensagem
      await base44.asServiceRole.entities.Conversa.update(conversaId, {
        ultima_mensagem: message,
        ultima_atualizacao: new Date().toISOString()
      });
    }

    // Resposta do bot SEMPRE
    await base44.asServiceRole.entities.Mensagem.create({
      conversa_id: conversaIdFinal,
      remetente_email: 'bot@sistema.com',
      remetente_nome: 'Assistente Virtual',
      tipo_remetente: 'admin',
      conteudo: llmResponse,
      escritorio_id: escritorioId
    });

    // Criar ticket se precisa atendimento humano (apenas autenticados)
    if (isAuthenticated && precisaHumano && !horarioComercial) {
      const ticket = await base44.asServiceRole.entities.Ticket.create({
        titulo: 'Atendimento via Chat - Fora do horário',
        descricao: `Cliente solicitou atendimento via chat.\n\nÚltima mensagem: ${message}`,
        cliente_email: userEmail,
        cliente_nome: userName || 'Cliente',
        status: 'aberto',
        prioridade: 'media',
        categoria: 'solicitacao',
        escritorio_id: escritorioId
      });
      ticketCriado = ticket.id;

      await base44.asServiceRole.entities.TicketMensagem.create({
        ticket_id: ticket.id,
        remetente_email: userEmail,
        remetente_nome: userName || 'Cliente',
        tipo_remetente: 'cliente',
        conteudo: message,
        escritorio_id: escritorioId
      });
    }

    return Response.json({
      response: llmResponse,
      conversaId: conversaIdFinal,
      ticketCriado,
      precisaHumano,
      horarioComercial
    });
  } catch (error) {
    return Response.json({ 
      response: 'Desculpe, não consegui processar sua mensagem. Tente novamente.',
      error: error.message 
    }, { status: 500 });
  }
});