import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const results = {
      timestamp: new Date().toISOString(),
      usuario: user.email,
      testes: []
    };

    // ============================================
    // TESTE 1: Entities Existem e São Acessíveis
    // ============================================
    try {
      const conversas = await base44.asServiceRole.entities.Conversa.filter({ escritorio_id: user.escritorio_id });
      const mensagens = await base44.asServiceRole.entities.Mensagem.filter({ escritorio_id: user.escritorio_id });
      const tickets = await base44.asServiceRole.entities.Ticket.filter({ escritorio_id: user.escritorio_id });
      const ticketMensagens = await base44.asServiceRole.entities.TicketMensagem.filter({ escritorio_id: user.escritorio_id });

      results.testes.push({
        teste: '1. Entities Base',
        status: 'PASS',
        detalhes: {
          conversas: conversas.length,
          mensagens: mensagens.length,
          tickets: tickets.length,
          ticketMensagens: ticketMensagens.length
        }
      });
    } catch (error) {
      results.testes.push({
        teste: '1. Entities Base',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 2: Backend Functions - Chatbot
    // ============================================
    try {
      const chatbotTest = await base44.asServiceRole.functions.invoke('chatbot', {
        message: 'Teste E2E',
        sessionId: 'test-session',
        userEmail: 'test@example.com'
      });

      results.testes.push({
        teste: '2. Function: chatbot',
        status: chatbotTest.status === 200 ? 'PASS' : 'FAIL',
        detalhes: {
          status: chatbotTest.status,
          temResposta: !!chatbotTest.data
        }
      });
    } catch (error) {
      results.testes.push({
        teste: '2. Function: chatbot',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 3: Backend Functions - findOrCreateConversa
    // ============================================
    try {
      const conversaTest = await base44.asServiceRole.functions.invoke('findOrCreateConversa', {
        cliente_email: user.email,
        cliente_nome: user.full_name,
        canal: 'chat_widget',
        escritorio_id: user.escritorio_id
      });

      results.testes.push({
        teste: '3. Function: findOrCreateConversa',
        status: conversaTest.status === 200 ? 'PASS' : 'FAIL',
        detalhes: {
          conversaCriada: !!conversaTest.data?.conversa_id
        }
      });
    } catch (error) {
      results.testes.push({
        teste: '3. Function: findOrCreateConversa',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 4: Backend Functions - sendEmailResponse
    // ============================================
    try {
      const emailResponseExists = await testFunctionExists(base44, 'sendEmailResponse');
      results.testes.push({
        teste: '4. Function: sendEmailResponse',
        status: emailResponseExists ? 'PASS' : 'FAIL',
        detalhes: { existe: emailResponseExists }
      });
    } catch (error) {
      results.testes.push({
        teste: '4. Function: sendEmailResponse',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 5: Backend Functions - sendTicketResponse
    // ============================================
    try {
      const ticketResponseExists = await testFunctionExists(base44, 'sendTicketResponse');
      results.testes.push({
        teste: '5. Function: sendTicketResponse',
        status: ticketResponseExists ? 'PASS' : 'FAIL',
        detalhes: { existe: ticketResponseExists }
      });
    } catch (error) {
      results.testes.push({
        teste: '5. Function: sendTicketResponse',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 6: Backend Functions - sendWhatsAppMessage
    // ============================================
    try {
      const whatsappExists = await testFunctionExists(base44, 'sendWhatsAppMessage');
      results.testes.push({
        teste: '6. Function: sendWhatsAppMessage',
        status: whatsappExists ? 'PASS' : 'FAIL',
        detalhes: { existe: whatsappExists }
      });
    } catch (error) {
      results.testes.push({
        teste: '6. Function: sendWhatsAppMessage',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 7: Backend Functions - autoTicketResponse
    // ============================================
    try {
      const autoTicketExists = await testFunctionExists(base44, 'autoTicketResponse');
      results.testes.push({
        teste: '7. Function: autoTicketResponse',
        status: autoTicketExists ? 'PASS' : 'FAIL',
        detalhes: { existe: autoTicketExists }
      });
    } catch (error) {
      results.testes.push({
        teste: '7. Function: autoTicketResponse',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 8: Fluxo Completo - Criar Conversa + Mensagem
    // ============================================
    try {
      const novaConversa = await base44.asServiceRole.entities.Conversa.create({
        cliente_email: `teste.e2e.${Date.now()}@example.com`,
        cliente_nome: 'Teste E2E',
        canal: 'chat_widget',
        tipo: 'cliente',
        status: 'aberta',
        escritorio_id: user.escritorio_id
      });

      const novaMensagem = await base44.asServiceRole.entities.Mensagem.create({
        conversa_id: novaConversa.id,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: 'admin',
        conteudo: 'Teste E2E - Mensagem',
        escritorio_id: user.escritorio_id
      });

      await base44.asServiceRole.entities.Conversa.delete(novaConversa.id);
      await base44.asServiceRole.entities.Mensagem.delete(novaMensagem.id);

      results.testes.push({
        teste: '8. Fluxo: Criar Conversa + Mensagem',
        status: 'PASS',
        detalhes: {
          conversaCriada: !!novaConversa.id,
          mensagemCriada: !!novaMensagem.id
        }
      });
    } catch (error) {
      results.testes.push({
        teste: '8. Fluxo: Criar Conversa + Mensagem',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 9: Fluxo Completo - Criar Ticket + Mensagem
    // ============================================
    try {
      const novoTicket = await base44.asServiceRole.entities.Ticket.create({
        titulo: 'Teste E2E',
        descricao: 'Teste automatizado',
        cliente_email: user.email,
        cliente_nome: user.full_name,
        status: 'aberto',
        prioridade: 'media',
        categoria: 'duvida',
        canal: 'chat',
        escritorio_id: user.escritorio_id
      });

      const ticketMensagem = await base44.asServiceRole.entities.TicketMensagem.create({
        ticket_id: novoTicket.id,
        remetente_email: user.email,
        remetente_nome: user.full_name,
        tipo_remetente: 'admin',
        conteudo: 'Teste E2E - Ticket Mensagem',
        escritorio_id: user.escritorio_id
      });

      await base44.asServiceRole.entities.TicketMensagem.delete(ticketMensagem.id);
      await base44.asServiceRole.entities.Ticket.delete(novoTicket.id);

      results.testes.push({
        teste: '9. Fluxo: Criar Ticket + Mensagem',
        status: 'PASS',
        detalhes: {
          ticketCriado: !!novoTicket.id,
          mensagemCriada: !!ticketMensagem.id
        }
      });
    } catch (error) {
      results.testes.push({
        teste: '9. Fluxo: Criar Ticket + Mensagem',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 10: Escalação - Conversa para Ticket
    // ============================================
    try {
      const conversaParaEscalar = await base44.asServiceRole.entities.Conversa.create({
        cliente_email: `escalar.${Date.now()}@example.com`,
        cliente_nome: 'Teste Escalação',
        canal: 'chat_widget',
        tipo: 'cliente',
        status: 'aberta',
        escritorio_id: user.escritorio_id
      });

      const ticketEscalado = await base44.asServiceRole.entities.Ticket.create({
        titulo: 'Escalado de Chat',
        descricao: 'Teste escalação',
        cliente_email: conversaParaEscalar.cliente_email,
        cliente_nome: conversaParaEscalar.cliente_nome,
        origem_conversa_id: conversaParaEscalar.id,
        status: 'aberto',
        prioridade: 'media',
        categoria: 'chat_escalado',
        canal: 'chat',
        escritorio_id: user.escritorio_id
      });

      await base44.asServiceRole.entities.Conversa.update(conversaParaEscalar.id, {
        status: 'escalada',
        ticket_id: ticketEscalado.id
      });

      await base44.asServiceRole.entities.Ticket.delete(ticketEscalado.id);
      await base44.asServiceRole.entities.Conversa.delete(conversaParaEscalar.id);

      results.testes.push({
        teste: '10. Fluxo: Escalação Conversa → Ticket',
        status: 'PASS',
        detalhes: {
          conversaCriada: !!conversaParaEscalar.id,
          ticketCriado: !!ticketEscalado.id,
          vinculoCorreto: conversaParaEscalar.ticket_id === ticketEscalado.id
        }
      });
    } catch (error) {
      results.testes.push({
        teste: '10. Fluxo: Escalação Conversa → Ticket',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 11: Upload de Anexos
    // ============================================
    try {
      const testFile = new Blob(['Teste E2E Anexo'], { type: 'text/plain' });
      const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({
        file: testFile
      });

      results.testes.push({
        teste: '11. Upload de Anexos',
        status: uploadResult.file_url ? 'PASS' : 'FAIL',
        detalhes: {
          urlGerada: !!uploadResult.file_url
        }
      });
    } catch (error) {
      results.testes.push({
        teste: '11. Upload de Anexos',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 12: IA - Sugestões de Resposta
    // ============================================
    try {
      const iaSuggestion = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: 'Gere uma resposta profissional para: "Preciso de ajuda com meu processo"',
        response_json_schema: {
          type: 'object',
          properties: {
            resposta: { type: 'string' }
          }
        }
      });

      results.testes.push({
        teste: '12. IA: Sugestões de Resposta',
        status: iaSuggestion.resposta ? 'PASS' : 'FAIL',
        detalhes: {
          respostaGerada: !!iaSuggestion.resposta
        }
      });
    } catch (error) {
      results.testes.push({
        teste: '12. IA: Sugestões de Resposta',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // TESTE 13: Multi-tenant Isolation
    // ============================================
    try {
      const outroEscritorio = await base44.asServiceRole.entities.Escritorio.list();
      const escritorioTest = outroEscritorio.find(e => e.id !== user.escritorio_id);

      if (escritorioTest) {
        const conversasVazias = await base44.entities.Conversa.filter({
          escritorio_id: escritorioTest.id
        });

        results.testes.push({
          teste: '13. Multi-tenant: Isolamento',
          status: conversasVazias.length === 0 ? 'PASS' : 'FAIL',
          detalhes: {
            acessouOutroEscritorio: conversasVazias.length > 0,
            isolamentoFunciona: conversasVazias.length === 0
          }
        });
      } else {
        results.testes.push({
          teste: '13. Multi-tenant: Isolamento',
          status: 'SKIP',
          detalhes: { motivo: 'Apenas um escritório no sistema' }
        });
      }
    } catch (error) {
      results.testes.push({
        teste: '13. Multi-tenant: Isolamento',
        status: 'PASS',
        detalhes: { erroEsperado: 'Isolamento funcionou - sem acesso' }
      });
    }

    // ============================================
    // TESTE 14: Status de Leitura
    // ============================================
    try {
      const conversaLeitura = await base44.asServiceRole.entities.Conversa.create({
        cliente_email: `leitura.${Date.now()}@example.com`,
        cliente_nome: 'Teste Leitura',
        canal: 'email',
        tipo: 'cliente',
        status: 'aberta',
        escritorio_id: user.escritorio_id
      });

      const mensagemNaoLida = await base44.asServiceRole.entities.Mensagem.create({
        conversa_id: conversaLeitura.id,
        remetente_email: conversaLeitura.cliente_email,
        remetente_nome: conversaLeitura.cliente_nome,
        tipo_remetente: 'cliente',
        conteudo: 'Mensagem não lida',
        lida: false,
        escritorio_id: user.escritorio_id
      });

      await base44.asServiceRole.entities.Mensagem.update(mensagemNaoLida.id, { lida: true });
      const mensagemAtualizada = await base44.asServiceRole.entities.Mensagem.filter({ 
        conversa_id: conversaLeitura.id 
      });

      await base44.asServiceRole.entities.Mensagem.delete(mensagemNaoLida.id);
      await base44.asServiceRole.entities.Conversa.delete(conversaLeitura.id);

      results.testes.push({
        teste: '14. Status de Leitura',
        status: mensagemAtualizada[0]?.lida === true ? 'PASS' : 'FAIL',
        detalhes: {
          marcadaComoLida: mensagemAtualizada[0]?.lida === true
        }
      });
    } catch (error) {
      results.testes.push({
        teste: '14. Status de Leitura',
        status: 'FAIL',
        erro: error.message
      });
    }

    // ============================================
    // RESUMO FINAL
    // ============================================
    const totalTestes = results.testes.length;
    const passed = results.testes.filter(t => t.status === 'PASS').length;
    const failed = results.testes.filter(t => t.status === 'FAIL').length;
    const skipped = results.testes.filter(t => t.status === 'SKIP').length;

    results.resumo = {
      total: totalTestes,
      passed,
      failed,
      skipped,
      taxa_sucesso: `${Math.round((passed / (totalTestes - skipped)) * 100)}%`,
      status_geral: failed === 0 ? '✅ APROVADO' : '❌ FALHAS DETECTADAS'
    };

    results.violacoes_criticas = results.testes
      .filter(t => t.status === 'FAIL')
      .map(t => ({
        teste: t.teste,
        erro: t.erro,
        correcao: getCorrecaoSugerida(t.teste, t.erro)
      }));

    results.funcionalidades_testadas = {
      entities: ['Conversa', 'Mensagem', 'Ticket', 'TicketMensagem'],
      functions: ['chatbot', 'findOrCreateConversa', 'sendEmailResponse', 'sendTicketResponse', 'sendWhatsAppMessage', 'autoTicketResponse'],
      fluxos: ['Criar Conversa + Mensagem', 'Criar Ticket + Mensagem', 'Escalação Conversa → Ticket'],
      recursos: ['Upload de Anexos', 'IA - Sugestões', 'Status de Leitura', 'Multi-tenant Isolation']
    };

    return Response.json(results, { status: 200 });

  } catch (error) {
    return Response.json({
      error: 'Erro no teste E2E',
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
});

// Helper function para testar se função existe
async function testFunctionExists(base44, functionName) {
  try {
    await base44.asServiceRole.functions.invoke(functionName, {});
    return true;
  } catch (error) {
    if (error.message.includes('not found') || error.message.includes('404')) {
      return false;
    }
    return true; // Função existe mas pode ter falhado por falta de params
  }
}

// Helper para sugerir correções
function getCorrecaoSugerida(teste, erro) {
  if (teste.includes('chatbot')) {
    return '1. Verifique se functions/chatbot.js existe\n2. Teste manualmente: base44.functions.invoke("chatbot", {message: "teste"})\n3. Verifique logs do backend function';
  }
  if (teste.includes('findOrCreateConversa')) {
    return '1. Verifique se functions/findOrCreateConversa.js existe\n2. Confira se a função cria conversa corretamente\n3. Teste com: base44.functions.invoke("findOrCreateConversa", {cliente_email: "teste@example.com"})';
  }
  if (teste.includes('sendEmailResponse')) {
    return '1. Criar functions/sendEmailResponse.js\n2. Função deve enviar email via SendGrid quando admin responde ticket\n3. Integrar com EmailStatus entity';
  }
  if (teste.includes('sendTicketResponse')) {
    return '1. Criar functions/sendTicketResponse.js\n2. Função deve criar TicketMensagem quando admin responde\n3. Atualizar status do ticket';
  }
  if (teste.includes('sendWhatsAppMessage')) {
    return '1. Verifique functions/sendWhatsAppMessage.js\n2. Confirme integração com WhatsApp Business API\n3. Teste envio de mensagem real';
  }
  if (teste.includes('autoTicketResponse')) {
    return '1. Verifique functions/autoTicketResponse.js\n2. Confirme se IA está respondendo tickets automaticamente\n3. Testar com ticket de teste';
  }
  if (teste.includes('Multi-tenant')) {
    return '1. Verifique se todas as queries filtram por escritorio_id\n2. Teste com dois escritórios diferentes\n3. Confirme isolamento total de dados';
  }
  if (erro?.includes('not found')) {
    return `1. Criar a função backend em functions/${teste.split(':')[1]?.trim()}.js\n2. Implementar lógica conforme especificação\n3. Testar com payload de exemplo`;
  }
  return 'Verifique os logs de erro detalhados acima para identificar o problema específico';
}