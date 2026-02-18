import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cliente_email, cliente_nome } = await req.json();
    
    // Get escritorio_id from user or first escritorio
    let escritorio_id = user.escritorio_id;
    if (!escritorio_id) {
      const escritorios = await base44.asServiceRole.entities.Escritorio.list();
      if (escritorios.length === 0) {
        return Response.json({ error: 'No escritorio found' }, { status: 404 });
      }
      escritorio_id = escritorios[0].id;
    }

    const conversas = await base44.entities.Conversa.filter({
      escritorio_id,
      cliente_email
    });

    let conversa;
    if (conversas.length > 0) {
      conversa = conversas[0];
    } else {
      conversa = await base44.entities.Conversa.create({
        escritorio_id,
        cliente_email,
        cliente_nome,
        status: 'ativa'
      });
    }

    return Response.json(conversa);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});