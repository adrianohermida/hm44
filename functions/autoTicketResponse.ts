import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticket_id, action } = await req.json();
    
    if (!ticket_id || !action) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ticket = await base44.asServiceRole.entities.Ticket.filter({
      id: ticket_id,
      escritorio_id: user.escritorio_id
    });

    if (!ticket[0]) {
      return Response.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const t = ticket[0];

    const mensagens = await base44.asServiceRole.entities.TicketMensagem.filter({
      ticket_id: t.id
    });

    const historico = mensagens
      .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
      .map(m => `[${m.tipo_remetente}] ${m.conteudo}`)
      .join('\n');

    if (action === 'suggest_response') {
      const prompt = `Você é um assistente jurídico especializado em direito do consumidor e superendividamento.

HISTÓRICO DO TICKET:
Título: ${t.titulo}
Descrição: ${t.descricao}
Categoria: ${t.categoria}
Status: ${t.status}

MENSAGENS:
${historico}

TAREFA: Sugira 3 respostas profissionais e empáticas para o cliente. Cada resposta deve ser clara, objetiva e adequada ao contexto jurídico. Retorne no formato JSON:

{
  "respostas": [
    { "titulo": "Resposta 1", "conteudo": "texto completo..." },
    { "titulo": "Resposta 2", "conteudo": "texto completo..." },
    { "titulo": "Resposta 3", "conteudo": "texto completo..." }
  ]
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.7
        })
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return Response.json({ success: true, ...result });
    }

    if (action === 'classify') {
      const prompt = `Analise este ticket de atendimento jurídico:

Título: ${t.titulo}
Descrição: ${t.descricao}

TAREFA: Classifique este ticket. Retorne JSON:

{
  "prioridade": "baixa" | "media" | "alta" | "urgente",
  "categoria": "duvida" | "problema" | "solicitacao" | "email" | "outro",
  "tags": ["tag1", "tag2", "tag3"],
  "justificativa": "explicação breve da classificação"
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.3
        })
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);

      await base44.asServiceRole.entities.Ticket.update(t.id, {
        prioridade: result.prioridade,
        categoria: result.categoria
      });

      return Response.json({ success: true, ...result });
    }

    if (action === 'generate_template') {
      const { tipo } = await req.json();
      
      const prompts = {
        boas_vindas: 'Crie uma mensagem de boas-vindas calorosa para novo cliente de escritório jurídico',
        aguardando_documentos: 'Crie mensagem profissional solicitando documentos pendentes',
        atualizacao_processo: 'Crie mensagem informando atualização em processo judicial',
        agendamento_consulta: 'Crie mensagem confirmando agendamento de consulta',
        fechamento: 'Crie mensagem de encerramento e satisfação do atendimento'
      };

      const prompt = `${prompts[tipo] || prompts.boas_vindas}. Seja profissional, empático e objetivo. Retorne JSON: { "assunto": "título", "corpo": "texto completo" }`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          temperature: 0.7
        })
      });

      const data = await response.json();
      const result = JSON.parse(data.choices[0].message.content);
      
      return Response.json({ success: true, ...result });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error) {
    console.error('Auto ticket response error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});