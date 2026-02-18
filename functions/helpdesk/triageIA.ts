import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticket_id } = await req.json();

    if (!ticket_id) {
      return Response.json({ error: 'ticket_id é obrigatório' }, { status: 400 });
    }

    const [ticket] = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });
    
    if (!ticket) {
      return Response.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    // Buscar departamentos para contexto
    const departamentos = await base44.asServiceRole.entities.Departamento.filter({
      escritorio_id: ticket.escritorio_id,
      ativo: true
    });

    const prompt = `Analise este ticket de helpdesk e classifique:

TICKET:
Título: ${ticket.titulo}
Descrição: ${ticket.descricao}
Cliente: ${ticket.cliente_nome} (${ticket.cliente_email})

DEPARTAMENTOS DISPONÍVEIS:
${departamentos.map(d => `- ${d.nome}: ${d.descricao}`).join('\n')}

CATEGORIAS POSSÍVEIS:
- duvida: Dúvidas gerais
- problema: Problemas técnicos ou erros
- solicitacao: Pedidos de documentos, informações
- email_inbound: Email recebido sem classificação
- chat_escalado: Chat escalado para ticket
- outro: Outros casos

PRIORIDADES:
- urgente: Necessita atenção imediata
- alta: Importante, resolver em 4h
- media: Resolver em 24h
- baixa: Pode aguardar

Retorne a classificação ideal.`;

    const resultado = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          categoria: { type: "string" },
          prioridade: { type: "string" },
          departamento_sugerido: { type: "string" },
          tags_sugeridas: { type: "array", items: { type: "string" } },
          justificativa: { type: "string" }
        }
      }
    });

    // Atualizar ticket com classificação
    await base44.asServiceRole.entities.Ticket.update(ticket_id, {
      categoria: resultado.categoria,
      prioridade: resultado.prioridade,
      departamento_id: departamentos.find(d => d.nome === resultado.departamento_sugerido)?.id,
      tags: resultado.tags_sugeridas || []
    });

    return Response.json({
      success: true,
      classificacao: resultado
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});