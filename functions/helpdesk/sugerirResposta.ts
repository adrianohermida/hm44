import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticket_id } = await req.json();

    const [ticket] = await base44.asServiceRole.entities.Ticket.filter({ id: ticket_id });
    
    if (!ticket) {
      return Response.json({ error: 'Ticket não encontrado' }, { status: 404 });
    }

    // Buscar mensagens do ticket
    const mensagens = await base44.asServiceRole.entities.TicketMensagem.filter({
      ticket_id
    });

    // Buscar base de conhecimento relacionada
    const artigosBase = await base44.asServiceRole.entities.BaseConhecimento.filter({
      escritorio_id: ticket.escritorio_id,
      ativo: true
    });

    // Buscar tickets similares resolvidos
    const ticketsSimilares = await base44.asServiceRole.entities.Ticket.filter({
      escritorio_id: ticket.escritorio_id,
      status: 'resolvido',
      categoria: ticket.categoria
    }, '-created_date', 5);

    const contextoMensagens = mensagens
      .sort((a, b) => new Date(a.created_date) - new Date(b.created_date))
      .map(m => `[${m.tipo_remetente}] ${m.conteudo}`)
      .join('\n\n');

    const prompt = `Você é um assistente de helpdesk jurídico experiente.

TICKET ATUAL:
Título: ${ticket.titulo}
Categoria: ${ticket.categoria}
Prioridade: ${ticket.prioridade}

HISTÓRICO DE MENSAGENS:
${contextoMensagens}

BASE DE CONHECIMENTO:
${artigosBase.slice(0, 3).map(a => `- ${a.titulo}: ${a.conteudo.substring(0, 200)}...`).join('\n')}

TICKETS SIMILARES RESOLVIDOS:
${ticketsSimilares.map(t => `- ${t.titulo}`).join('\n')}

Sugira 3 respostas possíveis para este ticket, em ordem de relevância.
Seja profissional, claro e objetivo.`;

    const sugestoes = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          sugestoes: {
            type: "array",
            items: {
              type: "object",
              properties: {
                titulo: { type: "string" },
                resposta: { type: "string" },
                confianca: { type: "number" },
                artigos_relacionados: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    });

    return Response.json({
      success: true,
      sugestoes: sugestoes.sugestoes
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});