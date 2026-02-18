import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    console.log('📨 [INICIO] receiveEmail webhook chamado');
    console.log('📋 Headers:', Object.fromEntries(req.headers.entries()));
    
    const base44 = createClientFromRequest(req);
    
    // Validar webhook secret (opcional em dev)
    const webhookSecret = Deno.env.get('EMAIL_WEBHOOK_SECRET');
    const authHeader = req.headers.get('x-webhook-secret');
    
    if (webhookSecret && webhookSecret !== 'test' && authHeader !== webhookSecret) {
      console.log('❌ Secret inválido');
      return Response.json({ error: 'Secret inválido' }, { status: 403 });
    }

    // SendGrid envia form-data, não JSON!
    const contentType = req.headers.get('content-type') || '';
    let from, subject, body, to, attachments = [], rawHtml;

    if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
      // Formato SendGrid Inbound Parse
      const formData = await req.formData();
      from = formData.get('from');
      subject = formData.get('subject');
      const textBody = formData.get('text');
      rawHtml = formData.get('html');
      to = formData.get('to');
      
      // Parser HTML → Texto limpo (remove tags, preserva quebras)
      body = textBody || (rawHtml ? 
        rawHtml
          .replace(/<style[^>]*>.*?<\/style>/gis, '')
          .replace(/<script[^>]*>.*?<\/script>/gis, '')
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n\n')
          .replace(/<\/div>/gi, '\n')
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .trim()
        : '');
      
      // Processar anexos (SendGrid envia como files)
      const attachmentCount = parseInt(formData.get('attachments') || '0');
      for (let i = 1; i <= attachmentCount; i++) {
        const file = formData.get(`attachment${i}`);
        if (file && file instanceof File) {
          // Upload para storage
          const arrayBuffer = await file.arrayBuffer();
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
          
          const uploadResult = await base44.asServiceRole.integrations.Core.UploadFile({
            file: base64
          });
          
          attachments.push({
            nome: file.name,
            tipo: file.type,
            size: file.size,
            url: uploadResult.file_url
          });
        }
      }
      
      console.log('📧 SendGrid email:', { from, subject, to, hasBody: !!body, attachments: attachments.length });
    } else {
      // Formato JSON genérico (fallback)
      const data = await req.json();
      from = data.from || data.envelope?.from;
      subject = data.subject;
      body = data.body || data.text || data.html;
      to = data.to;
      
      console.log('📧 JSON email:', { from, subject, to });
    }

    if (!from || !body) {
      console.log('❌ Campos faltando:', { from, body });
      return Response.json({ error: 'Campos obrigatórios: from, body' }, { status: 400 });
    }

    console.log('✅ Email parseado:', { from, subject, hasBody: !!body });

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    
    if (!escritorios || escritorios.length === 0) {
      console.log('❌ Nenhum escritório encontrado');
      return Response.json({ error: 'Escritório não configurado' }, { status: 500 });
    }
    
    const escritorioId = escritorios[0].id;

    // Tentar vincular ao cliente existente por email
    let cliente = null;
    const clientesPorEmail = await base44.asServiceRole.entities.Cliente.filter({
      escritorio_id: escritorioId,
      email: from
    });
    
    if (clientesPorEmail.length > 0) {
      cliente = clientesPorEmail[0];
    } else {
      // Buscar por emails adicionais (fallback mais pesado)
      const todosClientes = await base44.asServiceRole.entities.Cliente.filter({
        escritorio_id: escritorioId
      });
      cliente = todosClientes.find(c => 
        c.emails_adicionais?.some(e => e.email === from)
      );
      
      // Auto-criar cliente se não existir
      if (!cliente) {
        console.log('👤 Cliente não encontrado, criando automaticamente');
        const nomeExtraido = from.split('@')[0].replace(/[._]/g, ' ');
        cliente = await base44.asServiceRole.entities.Cliente.create({
          escritorio_id: escritorioId,
          tipo: 'pf',
          nome_completo: nomeExtraido,
          email: from,
          origem: 'email_inbound',
          status: 'lead'
        });
      }
    }

    // Detectar thread (reply) - procurar por Re: ou ticket ID no subject
    const isReply = subject?.toLowerCase().includes('re:') || subject?.match(/\[ticket-(\w+)\]/i);
    let ticketExistente = null;

    if (isReply) {
      const ticketIdMatch = subject.match(/\[ticket-(\w+)\]/i);
      if (ticketIdMatch) {
        const tickets = await base44.asServiceRole.entities.Ticket.filter({
          escritorio_id: escritorioId
        });
        ticketExistente = tickets.find(t => t.id === ticketIdMatch[1]);
      } else {
        // Procurar ticket recente do mesmo email
        const tickets = await base44.asServiceRole.entities.Ticket.filter({
          cliente_email: from,
          escritorio_id: escritorioId
        }, '-created_date', 5);
        ticketExistente = tickets.find(t => 
          t.status !== 'fechado' && 
          subject?.toLowerCase().includes(t.titulo?.toLowerCase().substring(0, 20))
        );
      }
    }

    let ticket;
    if (ticketExistente) {
      // Adicionar mensagem ao ticket existente
      ticket = ticketExistente;
      await base44.asServiceRole.entities.Ticket.update(ticket.id, {
        status: ticket.status === 'resolvido' ? 'aguardando_cliente' : ticket.status,
        ultima_atualizacao: new Date().toISOString()
      });
      console.log(`🔁 [REPLY] Thread detectada, ticket: ${ticket.id}`);
    } else {
      // Criar novo ticket
      ticket = await base44.asServiceRole.entities.Ticket.create({
        titulo: subject || 'Mensagem via E-mail',
        descricao: body.substring(0, 500),
        cliente_id: cliente?.id,
        cliente_email: from,
        cliente_nome: cliente?.nome_completo || from.split('@')[0],
        status: 'aberto',
        prioridade: 'media',
        categoria: 'email_inbound',
        canal: 'email',
        escritorio_id: escritorioId
      });
      console.log(`🆕 [NOVO] Ticket criado: ${ticket.id}`);
    }

    // Anexos já processados com URLs

    const mensagem = await base44.asServiceRole.entities.TicketMensagem.create({
      ticket_id: ticket.id,
      remetente_email: from,
      remetente_nome: cliente?.nome_completo || from.split('@')[0],
      tipo_remetente: 'cliente',
      conteudo: body,
      anexos: attachments.length > 0 ? attachments : undefined,
      escritorio_id: escritorioId,
      canal: 'email'
    });

    // Notificar responsável
    if (ticket.responsavel_email) {
      await base44.asServiceRole.functions.invoke('notificarNovaMensagem', {
        ticket_id: ticket.id,
        mensagem_id: mensagem.id,
        escritorio_id: escritorioId
      });
    }

    console.log(`✅ [SUCESSO] ${ticketExistente ? 'Mensagem adicionada' : 'Ticket criado'}: ${ticket.id} | De: ${from}`);
    
    return Response.json({ 
      success: true, 
      ticket_id: ticket.id,
      is_reply: !!ticketExistente,
      message: ticketExistente ? 'Resposta adicionada ao ticket existente' : 'Novo ticket criado'
    });
  } catch (error) {
    console.error('💥 [ERRO] receiveEmail:', error);
    console.error('Stack:', error.stack);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});