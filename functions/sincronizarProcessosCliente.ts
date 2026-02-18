import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cliente_id } = await req.json();

    if (!cliente_id) {
      return Response.json({ error: 'cliente_id obrigatório' }, { status: 400 });
    }

    // Buscar todas as partes do cliente
    const partes = await base44.asServiceRole.entities.ProcessoParte.filter({
      cliente_id
    });

    // Extrair IDs únicos de processos
    const processoIds = [...new Set(partes.map(p => p.processo_id))];

    // Atualizar cliente com lista de processos
    await base44.asServiceRole.entities.Cliente.update(cliente_id, {
      processos_ids: processoIds
    });

    return Response.json({
      success: true,
      cliente_id,
      processos_sincronizados: processoIds.length
    });

  } catch (error) {
    console.error('Erro sincronizarProcessosCliente:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});