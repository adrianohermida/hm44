import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cliente_ids } = await req.json();

    if (!cliente_ids || !Array.isArray(cliente_ids) || cliente_ids.length === 0) {
      return Response.json({ 
        error: 'cliente_ids obrigatório (array)' 
      }, { status: 400 });
    }

    let arquivados = 0;

    for (const id of cliente_ids) {
      try {
        await base44.asServiceRole.entities.Cliente.update(id, {
          status: 'arquivado'
        });
        arquivados++;
      } catch (error) {
        console.error(`Erro arquivando cliente ${id}:`, error);
      }
    }

    return Response.json({
      success: true,
      arquivados,
      total: cliente_ids.length
    });

  } catch (error) {
    console.error('Erro arquivarClientes:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});