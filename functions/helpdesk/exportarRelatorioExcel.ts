import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filtros, escritorio_id, usuario_email } = await req.json();
    
    let query = { escritorio_id };
    if (filtros.status && filtros.status !== 'todos') {
      query.status = filtros.status;
    }
    if (filtros.departamento_id && filtros.departamento_id !== 'todos') {
      query.departamento_id = filtros.departamento_id;
    }
    
    const tickets = await base44.entities.Ticket.filter(query, '-created_date', 500);
    
    // Simples CSV (Excel pode ser implementado com biblioteca)
    const csv = [
      'Número,Título,Status,Prioridade,Cliente,Criado em',
      ...tickets.map(t => 
        `${t.numero_ticket},"${t.titulo}",${t.status},${t.prioridade},"${t.cliente_nome}",${new Date(t.created_date).toLocaleString('pt-BR')}`
      )
    ].join('\n');
    
    // Registrar evento
    await base44.entities.RelatorioEvento.create({
      escritorio_id,
      tipo_relatorio: 'excel',
      usuario_email,
      filtros_aplicados: filtros,
      total_tickets: tickets.length
    });
    
    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=relatorio.csv'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});