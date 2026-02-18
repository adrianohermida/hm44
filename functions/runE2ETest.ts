import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { testName } = await req.json();

    // Obter o escritorio_id do usuário atual
    const escritorioId = user.escritorio_id;
    
    if (!escritorioId) {
      return Response.json({ 
        success: false, 
        error: 'Usuário admin sem escritorio_id definido',
        details: { user: { email: user.email, role: user.role } }
      });
    }

    let result;
    switch (testName) {
      case 'user_info':
        result = await testUserInfo(base44, user);
        break;
      case 'fix_escritorio':
        result = await fixEscritorioId(base44, user);
        break;
      case 'fix_processos_escritorio':
        result = await fixProcessosEscritorio(base44);
        break;
      case 'fix_tickets_escritorio':
        result = await fixTicketsEscritorio(base44, escritorioId);
        break;
      case 'fix_conversas_escritorio':
        result = await fixConversasEscritorio(base44, escritorioId);
        break;
      case 'multitenant_tickets':
        result = await testMultitenantTickets(base44, escritorioId);
        break;
      case 'multitenant_conversas':
        result = await testMultitenantConversas(base44, escritorioId);
        break;
      case 'multitenant_emails':
        result = await testMultitenantEmails(base44, escritorioId);
        break;
      case 'testChatIntegration':
        result = await testChatIntegration(base44, user, escritorioId);
        break;
      case 'testWhatsAppIntegration':
        result = await testWhatsAppIntegration(base44, user, escritorioId);
        break;
      case 'testEmailIntegration':
        result = await testEmailIntegration(base44, user, escritorioId);
        break;
      case 'testTicketsIntegration':
        result = await testTicketsIntegration(base44, user, escritorioId);
        break;
      case 'google_calendar_connection':
        result = await testGoogleCalendarConnection(base44);
        break;
      case 'google_calendar_events':
        result = await testGoogleCalendarEvents(base44);
        break;
      case 'google_calendar_availability':
        result = await testGoogleCalendarAvailability(base44);
        break;
      case 'sendgrid_config':
        result = await testSendGridConfig();
        break;
      case 'sendgrid_send_email':
        result = await testSendGridSendEmail(base44, user);
        break;
      case 'sendgrid_webhook':
        result = await testSendGridWebhook(base44);
        break;
      case 'sendgrid_inbound_parse':
        result = await testSendGridInboundParse(base44);
        break;
      case 'sendgrid_receive_email':
        result = await testSendGridReceiveEmail(base44, user);
        break;
      case 'sendgrid_full_flow':
        result = await testSendGridFullFlow(base44, user);
        break;
      case 'comunicacao':
        result = await testComunicacao(base44, user, escritorioId);
        break;
      default:
        result = { success: false, error: 'Teste não encontrado' };
    }

    return Response.json(result);
  } catch (error) {
    console.error('Erro ao executar teste:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});

async function testUserInfo(base44, user) {
  const escritorios = await base44.asServiceRole.entities.Escritorio.list();
  
  return {
    success: true,
    message: `Usuário: ${user.email}`,
    details: {
      user: {
        email: user.email,
        role: user.role,
        escritorio_id: user.escritorio_id || 'NÃO DEFINIDO',
        full_name: user.full_name
      },
      escritorios_existentes: escritorios.map(e => ({
        id: e.id,
        nome: e.nome
      }))
    }
  };
}

async function fixEscritorioId(base44, user) {
  const escritorios = await base44.asServiceRole.entities.Escritorio.list();
  
  if (escritorios.length === 0) {
    return {
      success: false,
      error: 'Nenhum escritório encontrado no sistema',
      details: { action: 'Crie um escritório primeiro' }
    };
  }

  const primeiroEscritorio = escritorios[0];
  
  await base44.asServiceRole.entities.User.update(user.id, {
    escritorio_id: primeiroEscritorio.id
  });

  return {
    success: true,
    message: `Escritório ${primeiroEscritorio.nome} atribuído ao usuário`,
    details: {
      escritorio: {
        id: primeiroEscritorio.id,
        nome: primeiroEscritorio.nome
      },
      user: user.email,
      action: 'Recarregue a página para aplicar as mudanças'
    }
  };
}

async function fixProcessosEscritorio(base44) {
  const { action, batchSize, startIndex } = await req.json();
  const ESCRITORIO_ID_CORRETO = '6948bed65e7da7a1c1eb64d1';
  
  // FASE 1: SCAN - Apenas identificar problemas
  if (action === 'scan') {
    const todosProcessos = await base44.asServiceRole.entities.Processo.list();
    
    const problemas = [];
    let corretos = 0;
    
    for (const processo of todosProcessos) {
      const issues = [];
      
      if (processo.escritorio_id !== ESCRITORIO_ID_CORRETO) {
        issues.push('escritorio_id_incorreto');
      }
      
      if (processo.numero_cnj && processo.id !== processo.numero_cnj) {
        issues.push('id_diferente_cnj');
      }
      
      if (issues.length > 0) {
        problemas.push({
          id: processo.id,
          numero_cnj: processo.numero_cnj,
          escritorio_id: processo.escritorio_id,
          issues
        });
      } else {
        corretos++;
      }
    }
    
    return {
      success: true,
      message: `🔍 Scan concluído: ${problemas.length} processos precisam correção`,
      details: {
        total: todosProcessos.length,
        corretos,
        com_problemas: problemas.length,
        problemas: problemas.slice(0, 10), // Primeiros 10 para preview
        total_problemas: problemas.length
      }
    };
  }
  
  // FASE 2: FIX - Corrigir em lote
  if (action === 'fix') {
    const todosProcessos = await base44.asServiceRole.entities.Processo.list();
    
    const problemas = [];
    for (const processo of todosProcessos) {
      const issues = [];
      if (processo.escritorio_id !== ESCRITORIO_ID_CORRETO) {
        issues.push('escritorio_id_incorreto');
      }
      if (processo.numero_cnj && processo.id !== processo.numero_cnj) {
        issues.push('id_diferente_cnj');
      }
      if (issues.length > 0) {
        problemas.push({ ...processo, issues });
      }
    }
    
    const batch = problemas.slice(startIndex, startIndex + batchSize);
    const stats = { corrigidos: 0, erros: [] };
    
    for (const processo of batch) {
      try {
        if (processo.issues.includes('id_diferente_cnj')) {
          const novoProcesso = { ...processo };
          delete novoProcesso.created_date;
          delete novoProcesso.updated_date;
          delete novoProcesso.created_by;
          delete novoProcesso.issues;

          await base44.asServiceRole.entities.Processo.create({
            id: processo.numero_cnj,
            ...novoProcesso,
            escritorio_id: ESCRITORIO_ID_CORRETO
          });

          await base44.asServiceRole.entities.Processo.delete(processo.id);
        } else if (processo.issues.includes('escritorio_id_incorreto')) {
          await base44.asServiceRole.entities.Processo.update(processo.id, {
            escritorio_id: ESCRITORIO_ID_CORRETO
          });
        }
        stats.corrigidos++;
      } catch (error) {
        stats.erros.push({
          processo_id: processo.id,
          erro: error.message
        });
      }
    }
    
    return {
      success: true,
      message: `✅ Lote processado: ${stats.corrigidos}/${batch.length}`,
      details: {
        ...stats,
        lote_processado: batch.length,
        proximo_index: startIndex + batchSize,
        total_pendentes: problemas.length - (startIndex + batchSize)
      }
    };
  }
}

async function fixTicketsEscritorio(base44, escritorioId) {
  const allTickets = await base44.asServiceRole.entities.Ticket.list();
  const ticketsIncorretos = allTickets.filter(t => 
    t.escritorio_id === 'default' || 
    t.escritorio_id === 'escritorio_padrao' || 
    !t.escritorio_id
  );
  
  if (ticketsIncorretos.length === 0) {
    return {
      success: true,
      message: '✅ Nenhum ticket precisa de correção',
      details: { total: allTickets.length, corrigidos: 0 }
    };
  }

  for (const ticket of ticketsIncorretos) {
    await base44.asServiceRole.entities.Ticket.update(ticket.id, {
      escritorio_id: escritorioId
    });
  }

  return {
    success: true,
    message: `✅ ${ticketsIncorretos.length} tickets corrigidos para escritório ${escritorioId}`,
    details: {
      total: allTickets.length,
      corrigidos: ticketsIncorretos.length,
      ids_corrigidos: ticketsIncorretos.map(t => ({ id: t.id, antigo: t.escritorio_id }))
    }
  };
}

async function fixConversasEscritorio(base44, escritorioId) {
  const allConversas = await base44.asServiceRole.entities.Conversa.list();
  const conversasIncorretas = allConversas.filter(c => 
    c.escritorio_id === 'default' || 
    c.escritorio_id === 'escritorio_padrao' || 
    !c.escritorio_id
  );
  
  if (conversasIncorretas.length === 0) {
    return {
      success: true,
      message: '✅ Nenhuma conversa precisa de correção',
      details: { total: allConversas.length, corrigidos: 0 }
    };
  }

  for (const conversa of conversasIncorretas) {
    await base44.asServiceRole.entities.Conversa.update(conversa.id, {
      escritorio_id: escritorioId
    });
  }

  return {
    success: true,
    message: `✅ ${conversasIncorretas.length} conversas corrigidas para escritório ${escritorioId}`,
    details: {
      total: allConversas.length,
      corrigidos: conversasIncorretas.length,
      ids_corrigidos: conversasIncorretas.map(c => ({ id: c.id, antigo: c.escritorio_id }))
    }
  };
}

async function testMultitenantTickets(base44, escritorioId) {
  const allTickets = await base44.asServiceRole.entities.Ticket.list();
  const ticketsEscritorio = allTickets.filter(t => t.escritorio_id === escritorioId);
  const ticketsOutros = allTickets.filter(t => t.escritorio_id && t.escritorio_id !== escritorioId);
  const ticketsSemEscritorio = allTickets.filter(t => !t.escritorio_id);

  const success = ticketsOutros.length === 0;
  const message = success 
    ? `✅ Isolamento OK: ${ticketsEscritorio.length} tickets do escritório, 0 vazamentos`
    : `❌ VAZAMENTO: ${ticketsOutros.length} tickets de outros escritórios visíveis`;

  return {
    success,
    message,
    details: {
      escritorio_id: escritorioId,
      tickets_corretos: ticketsEscritorio.length,
      tickets_outros_escritorios: ticketsOutros.length,
      tickets_sem_escritorio: ticketsSemEscritorio.length,
      total: allTickets.length,
      ids_outros: ticketsOutros.map(t => ({ id: t.id, escritorio_id: t.escritorio_id }))
    }
  };
}

async function testMultitenantConversas(base44, escritorioId) {
  const allConversas = await base44.asServiceRole.entities.Conversa.list();
  const conversasEscritorio = allConversas.filter(c => c.escritorio_id === escritorioId);
  const conversasOutras = allConversas.filter(c => c.escritorio_id && c.escritorio_id !== escritorioId);
  const conversasSemEscritorio = allConversas.filter(c => !c.escritorio_id);

  const success = conversasOutras.length === 0;
  const message = success 
    ? `✅ Isolamento OK: ${conversasEscritorio.length} conversas do escritório, 0 vazamentos`
    : `❌ VAZAMENTO: ${conversasOutras.length} conversas de outros escritórios visíveis`;

  return {
    success,
    message,
    details: {
      escritorio_id: escritorioId,
      conversas_corretas: conversasEscritorio.length,
      conversas_outros_escritorios: conversasOutras.length,
      conversas_sem_escritorio: conversasSemEscritorio.length,
      total: allConversas.length,
      ids_outros: conversasOutras.map(c => ({ id: c.id, escritorio_id: c.escritorio_id }))
    }
  };
}

async function testMultitenantEmails(base44, escritorioId) {
  const allEmails = await base44.asServiceRole.entities.EmailPreferencia.list();
  const emailsEscritorio = allEmails.filter(e => e.escritorio_id === escritorioId);
  const emailsOutros = allEmails.filter(e => e.escritorio_id && e.escritorio_id !== escritorioId);
  const emailsSemEscritorio = allEmails.filter(e => !e.escritorio_id);

  const success = emailsOutros.length === 0;
  const message = success 
    ? `✅ Isolamento OK: ${emailsEscritorio.length} e-mails do escritório, 0 vazamentos`
    : `❌ VAZAMENTO: ${emailsOutros.length} e-mails de outros escritórios visíveis`;

  return {
    success,
    message,
    details: {
      escritorio_id: escritorioId,
      emails_corretos: emailsEscritorio.length,
      emails_outros_escritorios: emailsOutros.length,
      emails_sem_escritorio: emailsSemEscritorio.length,
      total: allEmails.length,
      ids_outros: emailsOutros.map(e => ({ email: e.email, escritorio_id: e.escritorio_id }))
    }
  };
}

async function testGoogleCalendarConnection(base44) {
  try {
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Google Calendar não conectado',
        details: { 
          message: 'Nenhum access token disponível',
          action: 'Conecte o Google Calendar nas configurações'
        }
      };
    }

    // Testar se o token funciona fazendo uma requisição à API do Google Calendar
    const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return {
        success: false,
        error: 'Token inválido ou expirado',
        details: { 
          status: response.status,
          error: errorData,
          action: 'Reconecte o Google Calendar nas configurações'
        }
      };
    }

    const data = await response.json();
    const calendars = data.items || [];

    return {
      success: true,
      message: `✅ Google Calendar conectado (${calendars.length} calendários)`,
      details: {
        calendars_count: calendars.length,
        calendars: calendars.map(cal => ({
          id: cal.id,
          summary: cal.summary,
          primary: cal.primary || false
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro ao verificar conexão: ${error.message}`,
      details: { errorStack: error.stack }
    };
  }
}

async function testGoogleCalendarEvents(base44) {
  try {
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Google Calendar não conectado',
        details: { action: 'Execute o teste de conexão primeiro' }
      };
    }

    // Listar eventos dos próximos 7 dias
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      `timeMin=${now.toISOString()}&timeMax=${nextWeek.toISOString()}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      return {
        success: false,
        error: 'Erro ao listar eventos',
        details: { status: response.status, error: errorData }
      };
    }

    const data = await response.json();
    const events = data.items || [];

    return {
      success: true,
      message: `✅ ${events.length} eventos encontrados nos próximos 7 dias`,
      details: {
        events_count: events.length,
        events: events.slice(0, 5).map(e => ({
          summary: e.summary,
          start: e.start.dateTime || e.start.date,
          end: e.end.dateTime || e.end.date
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro ao testar eventos: ${error.message}`,
      details: { errorStack: error.stack }
    };
  }
}

async function testGoogleCalendarAvailability(base44) {
  try {
    const accessToken = await base44.asServiceRole.connectors.getAccessToken('googlecalendar');
    
    if (!accessToken) {
      return {
        success: false,
        error: 'Google Calendar não conectado',
        details: { action: 'Execute o teste de conexão primeiro' }
      };
    }

    // Verificar disponibilidade nas próximas 24h
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/freeBusy',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          timeMin: now.toISOString(),
          timeMax: tomorrow.toISOString(),
          items: [{ id: 'primary' }]
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      return {
        success: false,
        error: 'Erro ao consultar disponibilidade',
        details: { status: response.status, error: errorData }
      };
    }

    const data = await response.json();
    const calendar = data.calendars?.primary;
    const busy = calendar?.busy || [];

    return {
      success: true,
      message: `✅ ${busy.length} períodos ocupados nas próximas 24h`,
      details: {
        busy_slots: busy.length,
        busy_periods: busy.map(period => ({
          start: period.start,
          end: period.end
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro ao testar disponibilidade: ${error.message}`,
      details: { errorStack: error.stack }
    };
  }
}

async function testSendGridConfig() {
  const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
  
  if (!apiKey) {
    return {
      success: false,
      error: 'SENDGRID_API_TOKEN não configurado',
      details: { 
        action: 'Configure a secret SENDGRID_API_TOKEN nas configurações do app',
        required: true
      }
    };
  }

  try {
    // Testar a validade do token chamando a API do SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/user/profile', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: 'API Key inválida ou expirada',
        details: {
          status: response.status,
          error: errorText,
          action: 'Verifique se a API Key está correta no SendGrid'
        }
      };
    }

    const profile = await response.json();

    return {
      success: true,
      message: '✅ SendGrid configurado corretamente',
      details: {
        username: profile.username,
        email: profile.email,
        first_name: profile.first_name,
        last_name: profile.last_name,
        api_key_valid: true
      }
    };
  } catch (error) {
    return {
      success: false,
      error: `Erro ao verificar configuração: ${error.message}`,
      details: { errorStack: error.stack }
    };
  }
}

async function testSendGridSendEmail(base44, user) {
  try {
    console.log('🧪 Iniciando teste de envio de email...');
    
    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return {
        success: false,
        error: 'SENDGRID_API_TOKEN não configurado',
        details: { action: 'Execute o teste de configuração primeiro' }
      };
    }

    // Criar um ticket de teste
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    if (!escritorioId) {
      return {
        success: false,
        error: 'Nenhum escritório encontrado',
        details: { action: 'Crie um escritório primeiro' }
      };
    }

    const testTicket = await base44.asServiceRole.entities.Ticket.create({
      titulo: '[TESTE E2E] Envio SendGrid',
      descricao: 'Ticket criado automaticamente para teste de envio de email',
      cliente_email: user.email,
      cliente_nome: user.full_name || 'Teste',
      status: 'aberto',
      prioridade: 'baixa',
      categoria: 'email',
      canal: 'email',
      escritorio_id: escritorioId
    });

    console.log('✅ Ticket de teste criado:', testTicket.id);

    // Tentar enviar email via SendGrid
    const fromEmail = 'contato@hermidamaia.adv.br';
    const payload = {
      personalizations: [{
        to: [{ email: user.email }],
        subject: '[TESTE E2E] Email via SendGrid'
      }],
      from: {
        email: fromEmail,
        name: 'Dr. Adriano Hermida Maia'
      },
      content: [{
        type: 'text/html',
        value: '<p>Este é um email de teste enviado via SendGrid E2E.</p><p>Se você recebeu este email, o sistema está funcionando corretamente! ✅</p>'
      }],
      tracking_settings: {
        click_tracking: { enable: true },
        open_tracking: { enable: true }
      }
    };

    console.log('📨 Enviando email via SendGrid API...');

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('📡 SendGrid response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ SendGrid error:', errorText);
      
      // Limpar ticket de teste
      await base44.asServiceRole.entities.Ticket.delete(testTicket.id);
      
      return {
        success: false,
        error: 'Falha ao enviar email',
        details: {
          status: response.status,
          error: errorText,
          from_email: fromEmail,
          to_email: user.email,
          action: 'Verifique se o email remetente está verificado no SendGrid'
        }
      };
    }

    const messageId = response.headers.get('x-message-id');
    console.log('✅ Email enviado! Message ID:', messageId);

    // Criar mensagem no ticket
    const mensagem = await base44.asServiceRole.entities.TicketMensagem.create({
      ticket_id: testTicket.id,
      remetente_email: fromEmail,
      remetente_nome: 'Sistema E2E',
      tipo_remetente: 'agente',
      conteudo: 'Email de teste enviado via SendGrid',
      canal: 'email',
      escritorio_id: escritorioId
    });

    // Criar status do email
    await base44.asServiceRole.entities.EmailStatus.create({
      mensagem_id: mensagem.id,
      sendgrid_message_id: messageId,
      email_destinatario: user.email,
      status: 'enviado',
      timestamp_envio: new Date().toISOString()
    });

    return {
      success: true,
      message: '✅ Email enviado com sucesso via SendGrid',
      details: {
        message_id: messageId,
        to: user.email,
        from: fromEmail,
        ticket_id: testTicket.id,
        mensagem_id: mensagem.id,
        action: 'Verifique sua caixa de entrada para confirmar recebimento'
      }
    };

  } catch (error) {
    console.error('💥 Erro no teste:', error);
    return {
      success: false,
      error: `Erro ao testar envio: ${error.message}`,
      details: { errorStack: error.stack }
    };
  }
}

async function testSendGridInboundParse(base44) {
  try {
    console.log('🔍 Verificando configuração Inbound Parse...');
    
    const apiKey = Deno.env.get('SENDGRID_API_TOKEN');
    if (!apiKey) {
      return {
        success: false,
        error: 'SENDGRID_API_TOKEN não configurado',
        details: { action: 'Configure a API key primeiro' }
      };
    }

    // Verificar Inbound Parse via API
    const response = await fetch('https://api.sendgrid.com/v3/user/webhooks/parse/settings', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: 'Erro ao consultar Inbound Parse',
        details: {
          status: response.status,
          error: errorText,
          action: 'Verifique permissões da API key'
        }
      };
    }

    const parseSettings = await response.json();
    const webhooks = parseSettings.result || [];

    const appUrl = Deno.env.get('BASE44_APP_URL') || 'https://sua-app.base44.com';
    const expectedWebhooks = [
      `${appUrl}/api/functions/receiveEmail`,
      `${appUrl}/api/functions/webhookReceberEmail`
    ];

    if (webhooks.length === 0) {
      return {
        success: false,
        error: 'Inbound Parse não configurado',
        details: {
          action: 'Configure Inbound Parse no SendGrid',
          webhook_urls: expectedWebhooks,
          steps: [
            '1. Acesse SendGrid: Settings > Inbound Parse',
            '2. Clique em "Add Host & URL"',
            '3. Configure seu domínio (ex: mail.seudominio.com)',
            '4. Cole uma das URLs acima',
            '5. Configure DNS MX records apontando para SendGrid'
          ]
        }
      };
    }

    const webhookValido = webhooks.find(w => expectedWebhooks.includes(w.url));

    return {
      success: !!webhookValido,
      message: webhookValido
        ? `✅ Inbound Parse configurado (${webhooks.length} webhook${webhooks.length > 1 ? 's' : ''})`
        : `⚠️ ${webhooks.length} webhook${webhooks.length > 1 ? 's' : ''} configurado${webhooks.length > 1 ? 's' : ''} mas URL não corresponde`,
      details: {
        configured_webhooks: webhooks.length,
        webhooks: webhooks.map(w => ({
          hostname: w.hostname,
          url: w.url,
          valido: expectedWebhooks.includes(w.url)
        })),
        expected_urls: expectedWebhooks,
        action: webhookValido 
          ? `Envie email para: qualquer@${webhookValido.hostname}`
          : `Atualize webhook para uma das URLs: ${expectedWebhooks.join(' ou ')}`
      }
    };

  } catch (error) {
    console.error('💥 Erro:', error);
    return {
      success: false,
      error: `Erro ao verificar Inbound Parse: ${error.message}`,
      details: { errorStack: error.stack }
    };
  }
}

async function testSendGridReceiveEmail(base44, user) {
  try {
    console.log('🧪 Testando recebimento de email (simulação direta)...');
    
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;
    
    if (!escritorioId) {
      return {
        success: false,
        error: 'Nenhum escritório encontrado'
      };
    }
    
    // Simular diretamente a lógica do receiveEmail (sem fetch interno)
    const from = user.email;
    const subject = '[TESTE E2E] Email Inbound Parse';
    const body = 'Este é um email de teste para verificar o recebimento via Inbound Parse.';
    
    // Buscar cliente
    const clientes = await base44.asServiceRole.entities.Cliente.filter({
      escritorio_id: escritorioId
    });
    const cliente = clientes.find(c => c.email === from);
    
    // Criar ticket
    const ticket = await base44.asServiceRole.entities.Ticket.create({
      titulo: subject,
      descricao: body.substring(0, 500),
      cliente_id: cliente?.id,
      cliente_email: from,
      cliente_nome: cliente?.nome_completo || user.full_name,
      status: 'aberto',
      prioridade: 'media',
      categoria: 'email_inbound',
      canal: 'email',
      escritorio_id: escritorioId
    });
    
    // Criar mensagem
    await base44.asServiceRole.entities.TicketMensagem.create({
      ticket_id: ticket.id,
      remetente_email: from,
      remetente_nome: cliente?.nome_completo || user.full_name,
      tipo_remetente: 'cliente',
      conteudo: body,
      escritorio_id: escritorioId
    });
    
    console.log('✅ Ticket criado via simulação:', ticket.id);

    return {
      success: true,
      message: '✅ Email recebido e ticket criado (simulação)',
      details: {
        ticket_id: ticket.id,
        ticket_titulo: ticket.titulo,
        ticket_categoria: ticket.categoria,
        cliente_email: ticket.cliente_email,
        action: 'Lógica de receiveEmail validada. Para teste real, envie email para o domínio configurado no Inbound Parse'
      }
    };

  } catch (error) {
    console.error('💥 Erro:', error);
    return {
      success: false,
      error: `Erro ao testar recebimento: ${error.message}`,
      details: { errorStack: error.stack }
    };
  }
}

async function testSendGridFullFlow(base44, user) {
  try {
    console.log('🔄 Testando fluxo completo SendGrid (envio + recebimento)...');
    
    const results = {
      config: null,
      inbound_parse: null,
      send_email: null,
      receive_email: null,
      webhook_events: null
    };

    // 1. Verificar configuração
    console.log('1️⃣ Verificando configuração...');
    results.config = await testSendGridConfig();
    
    if (!results.config.success) {
      return {
        success: false,
        error: 'Falha na configuração base',
        details: results
      };
    }

    // 2. Verificar Inbound Parse
    console.log('2️⃣ Verificando Inbound Parse...');
    results.inbound_parse = await testSendGridInboundParse(base44);

    // 3. Testar envio
    console.log('3️⃣ Testando envio de email...');
    results.send_email = await testSendGridSendEmail(base44, user);

    // 4. Testar recebimento
    console.log('4️⃣ Testando recebimento de email...');
    results.receive_email = await testSendGridReceiveEmail(base44, user);

    // 5. Verificar webhook de eventos
    console.log('5️⃣ Verificando webhook de eventos...');
    results.webhook_events = await testSendGridWebhook(base44);

    const allSuccess = Object.values(results).every(r => r?.success);

    return {
      success: allSuccess,
      message: allSuccess 
        ? '✅ Fluxo completo SendGrid funcionando'
        : '⚠️ Alguns testes falharam',
      details: {
        summary: {
          config: results.config.success ? '✅' : '❌',
          inbound_parse: results.inbound_parse.success ? '✅' : '⚠️',
          send_email: results.send_email.success ? '✅' : '❌',
          receive_email: results.receive_email.success ? '✅' : '❌',
          webhook_events: results.webhook_events.success ? '✅' : '⚠️'
        },
        full_results: results,
        next_steps: !allSuccess ? [
          !results.config.success && 'Configure SENDGRID_API_TOKEN',
          !results.inbound_parse.success && 'Configure Inbound Parse no SendGrid',
          !results.send_email.success && 'Verifique email remetente verificado',
          !results.receive_email.success && 'Teste webhook receiveEmail',
          !results.webhook_events.success && 'Configure Event Webhook no SendGrid'
        ].filter(Boolean) : ['Todos os testes passaram! 🎉']
      }
    };

  } catch (error) {
    console.error('💥 Erro no fluxo completo:', error);
    return {
      success: false,
      error: `Erro no fluxo completo: ${error.message}`,
      details: { errorStack: error.stack }
    };
  }
}

async function testChatIntegration(base44, user, escritorioId) {
  const results = { timestamp: new Date().toISOString(), tests: [], success: true };

  try {
    const conversa = await base44.asServiceRole.entities.Conversa.create({
      cliente_email: 'test@chat.com',
      cliente_nome: 'Teste Chat Widget',
      canal: 'chat_widget',
      tipo: 'visitante',
      status: 'aberta',
      ultima_mensagem: 'Mensagem de teste chat',
      ultima_atualizacao: new Date().toISOString(),
      escritorio_id: escritorioId
    });
    
    results.tests.push({ name: 'Criar Conversa Chat', status: 'OK', data: { conversaId: conversa.id } });

    await base44.asServiceRole.entities.Mensagem.create({
      conversa_id: conversa.id,
      remetente_email: 'test@chat.com',
      remetente_nome: 'Teste Chat',
      tipo_remetente: 'visitante',
      conteudo: 'Olá, preciso de ajuda!',
      escritorio_id: escritorioId
    });

    results.tests.push({ name: 'Criar Mensagem Chat', status: 'OK' });

    const conversasChat = await base44.entities.Conversa.filter({ escritorio_id: escritorioId, canal: 'chat_widget' });
    results.tests.push({
      name: 'Query Chat',
      status: conversasChat.length > 0 ? 'OK' : 'FALHA',
      data: { total: conversasChat.length }
    });

    results.summary = {
      total: results.tests.length,
      passed: results.tests.filter(t => t.status === 'OK').length,
      failed: results.tests.filter(t => t.status === 'FALHA').length
    };
    results.success = results.summary.failed === 0;

  } catch (error) {
    results.success = false;
    results.error = error.message;
  }

  return results;
}

async function testWhatsAppIntegration(base44, user, escritorioId) {
  const results = { timestamp: new Date().toISOString(), tests: [], success: true };

  try {
    const conversa = await base44.asServiceRole.entities.Conversa.create({
      cliente_email: 'whatsapp@test.com',
      cliente_nome: 'Teste WhatsApp User',
      cliente_telefone: '+5511987654321',
      canal: 'whatsapp',
      tipo: 'cliente',
      status: 'aberta',
      ultima_mensagem: 'Oi, preciso de ajuda!',
      ultima_atualizacao: new Date().toISOString(),
      whatsapp_wamid: 'wamid.test123',
      escritorio_id: escritorioId
    });

    results.tests.push({ name: 'Criar Conversa WhatsApp', status: 'OK', data: { conversaId: conversa.id } });

    await base44.asServiceRole.entities.Mensagem.create({
      conversa_id: conversa.id,
      remetente_email: 'whatsapp@test.com',
      remetente_nome: 'Teste WhatsApp User',
      tipo_remetente: 'cliente',
      conteudo: 'Gostaria de agendar uma consulta',
      whatsapp_wamid: 'wamid.msg001',
      whatsapp_status: 'entregue',
      escritorio_id: escritorioId
    });

    results.tests.push({ name: 'Mensagem WhatsApp Entrada', status: 'OK' });

    const conversasWhatsApp = await base44.entities.Conversa.filter({ escritorio_id: escritorioId, canal: 'whatsapp' });
    results.tests.push({
      name: 'Query WhatsApp',
      status: conversasWhatsApp.length > 0 ? 'OK' : 'FALHA',
      data: { total: conversasWhatsApp.length }
    });

    results.summary = {
      total: results.tests.length,
      passed: results.tests.filter(t => t.status === 'OK').length,
      failed: results.tests.filter(t => t.status === 'FALHA').length
    };
    results.success = results.summary.failed === 0;

  } catch (error) {
    results.success = false;
    results.error = error.message;
  }

  return results;
}

async function testEmailIntegration(base44, user, escritorioId) {
  const results = { timestamp: new Date().toISOString(), tests: [], success: true };

  try {
    const ticket = await base44.asServiceRole.entities.Ticket.create({
      titulo: 'Dúvida sobre processo',
      descricao: 'Gostaria de saber o andamento do meu processo',
      cliente_email: 'email@test.com',
      cliente_nome: 'Teste Email Cliente',
      canal: 'email',
      status: 'aberto',
      prioridade: 'media',
      categoria: 'email_inbound',
      email_thread_id: 'thread-123@email.com',
      ultima_atualizacao: new Date().toISOString(),
      escritorio_id: escritorioId
    });

    results.tests.push({ name: 'Criar Ticket Email', status: 'OK', data: { ticketId: ticket.id } });

    await base44.asServiceRole.entities.TicketMensagem.create({
      ticket_id: ticket.id,
      remetente_email: 'email@test.com',
      remetente_nome: 'Teste Email Cliente',
      tipo_remetente: 'cliente',
      conteudo: 'Preciso saber urgentemente sobre meu caso.',
      escritorio_id: escritorioId
    });

    results.tests.push({ name: 'Mensagem Email Entrada', status: 'OK' });

    const ticketsEmail = await base44.entities.Ticket.filter({ escritorio_id: escritorioId, canal: 'email' });
    results.tests.push({
      name: 'Query Tickets Email',
      status: ticketsEmail.length > 0 ? 'OK' : 'FALHA',
      data: { total: ticketsEmail.length }
    });

    results.summary = {
      total: results.tests.length,
      passed: results.tests.filter(t => t.status === 'OK').length,
      failed: results.tests.filter(t => t.status === 'FALHA').length
    };
    results.success = results.summary.failed === 0;

  } catch (error) {
    results.success = false;
    results.error = error.message;
  }

  return results;
}

async function testTicketsIntegration(base44, user, escritorioId) {
  const results = { timestamp: new Date().toISOString(), tests: [], success: true };

  try {
    const ticketDireto = await base44.asServiceRole.entities.Ticket.create({
      titulo: 'Solicitação de consulta',
      descricao: 'Cliente solicitou consulta via formulário',
      cliente_email: 'ticket@test.com',
      cliente_nome: 'Teste Ticket Cliente',
      canal: 'chat',
      status: 'aberto',
      prioridade: 'alta',
      categoria: 'solicitacao',
      ultima_atualizacao: new Date().toISOString(),
      escritorio_id: escritorioId
    });

    results.tests.push({ name: 'Criar Ticket Direto', status: 'OK', data: { ticketId: ticketDireto.id } });

    const conversaOrigem = await base44.asServiceRole.entities.Conversa.create({
      cliente_email: 'escalado@test.com',
      cliente_nome: 'Teste Escalado',
      canal: 'chat_widget',
      tipo: 'cliente',
      status: 'aberta',
      ultima_mensagem: 'Problema complexo',
      ultima_atualizacao: new Date().toISOString(),
      escritorio_id: escritorioId
    });

    const ticketEscalado = await base44.asServiceRole.entities.Ticket.create({
      titulo: 'Escalado: Teste Escalado',
      descricao: 'Problema complexo',
      cliente_email: 'escalado@test.com',
      cliente_nome: 'Teste Escalado',
      origem_conversa_id: conversaOrigem.id,
      canal: 'chat',
      status: 'aberto',
      prioridade: 'urgente',
      categoria: 'chat_escalado',
      ultima_atualizacao: new Date().toISOString(),
      escritorio_id: escritorioId
    });

    await base44.asServiceRole.entities.Conversa.update(conversaOrigem.id, {
      status: 'escalada',
      ticket_id: ticketEscalado.id
    });

    results.tests.push({ name: 'Escalar Conversa → Ticket', status: 'OK', data: { ticketId: ticketEscalado.id } });

    const allTickets = await base44.entities.Ticket.filter({ escritorio_id: escritorioId });
    results.tests.push({
      name: 'Query Todos Tickets',
      status: allTickets.length >= 2 ? 'OK' : 'FALHA',
      data: { total: allTickets.length }
    });

    results.summary = {
      total: results.tests.length,
      passed: results.tests.filter(t => t.status === 'OK').length,
      failed: results.tests.filter(t => t.status === 'FALHA').length
    };
    results.success = results.summary.failed === 0;

  } catch (error) {
    results.success = false;
    results.error = error.message;
  }

  return results;
}

async function testComunicacao(base44, user, escritorioId) {
  const comunicacaoTest = await base44.asServiceRole.functions.invoke('testComunicacao', {});
  
  return {
    success: comunicacaoTest.data?.resumo?.status_geral === 'APROVADO',
    message: comunicacaoTest.data?.resumo?.status_geral || 'Teste executado',
    data: comunicacaoTest.data
  };
}

async function testSendGridWebhook(base44) {
  try {
    // Verificar se existem registros de EmailStatus
    const emailStatuses = await base44.asServiceRole.entities.EmailStatus.list();
    
    if (emailStatuses.length === 0) {
      return {
        success: false,
        error: 'Nenhum EmailStatus encontrado',
        details: {
          action: 'Execute o teste de envio de email primeiro',
          webhook_url: `${Deno.env.get('BASE44_APP_URL') || 'https://sua-app.base44.com'}/api/functions/webhookSendGrid`,
          webhook_config: 'Configure este webhook no SendGrid: Settings > Mail Settings > Event Webhook'
        }
      };
    }

    // Analisar os status dos emails
    const statusCounts = emailStatuses.reduce((acc, status) => {
      acc[status.status] = (acc[status.status] || 0) + 1;
      return acc;
    }, {});

    const hasTracking = emailStatuses.some(s => 
      s.status === 'entregue' || 
      s.status === 'aberto' || 
      s.status === 'clicado'
    );

    const webhookConfigured = hasTracking;

    return {
      success: webhookConfigured,
      message: webhookConfigured 
        ? '✅ Webhook SendGrid está recebendo eventos'
        : '⚠️ Webhook não configurado ou sem eventos',
      details: {
        total_emails: emailStatuses.length,
        status_breakdown: statusCounts,
        webhook_working: webhookConfigured,
        webhook_url: `${Deno.env.get('BASE44_APP_URL') || 'https://sua-app.base44.com'}/api/functions/webhookSendGrid`,
        recent_events: emailStatuses
          .filter(s => s.eventos?.length > 0)
          .slice(0, 3)
          .map(s => ({
            email: s.email_destinatario,
            status: s.status,
            last_event: s.eventos[s.eventos.length - 1]?.event
          })),
        action: webhookConfigured 
          ? 'Webhook funcionando corretamente'
          : 'Configure o webhook no SendGrid apontando para a URL acima'
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `Erro ao verificar webhook: ${error.message}`,
      details: { errorStack: error.stack }
    };
  }
}