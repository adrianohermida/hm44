import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { query, escritorio_id } = await req.json();

    if (!query || query.length < 3) {
      return Response.json([]);
    }

    const searchTerm = query.toLowerCase();
    const results = [];

    // Buscar tickets
    const tickets = await base44.entities.Ticket.filter({ 
      escritorio_id 
    });
    tickets.forEach(t => {
      if (
        t.titulo?.toLowerCase().includes(searchTerm) ||
        t.cliente_nome?.toLowerCase().includes(searchTerm) ||
        t.cliente_email?.toLowerCase().includes(searchTerm) ||
        t.numero_ticket?.toLowerCase().includes(searchTerm) ||
        t.id.substring(0, 6).toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: t.id,
          title: `#${t.id.substring(0, 6)} - ${t.titulo}`,
          type: 'Ticket',
          subtitle: t.cliente_nome || t.cliente_email,
          url: `/Helpdesk?ticket=${t.id}`,
          data: t
        });
      }
    });

    // Buscar clientes
    const clientes = await base44.entities.Cliente.filter({ 
      escritorio_id 
    });
    clientes.forEach(c => {
      if (
        c.nome_completo?.toLowerCase().includes(searchTerm) ||
        c.razao_social?.toLowerCase().includes(searchTerm) ||
        c.email_principal?.toLowerCase().includes(searchTerm) ||
        c.cpf?.includes(searchTerm) ||
        c.cnpj?.includes(searchTerm)
      ) {
        results.push({
          id: c.id,
          title: c.nome_completo || c.razao_social,
          type: 'Cliente',
          subtitle: c.email_principal,
          url: `/ClienteDetalhes?id=${c.id}`,
          data: c
        });
      }
    });

    // Buscar processos
    const processos = await base44.entities.Processo.filter({ 
      escritorio_id 
    });
    processos.forEach(p => {
      if (
        p.numero_cnj?.includes(searchTerm) ||
        p.titulo?.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: p.id,
          title: p.numero_cnj || p.titulo,
          type: 'Processo',
          subtitle: p.titulo,
          url: `/ProcessoDetails?id=${p.id}`,
          data: p
        });
      }
    });

    return Response.json(results.slice(0, 20));
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});