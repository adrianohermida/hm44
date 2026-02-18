import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { dados } = await req.json();
    let importados = 0;

    for (const item of dados) {
      const eps = await base44.entities.EndpointAPI.filter({ nome: item.titulo });
      if (!eps[0]) continue;

      const preco_venda = item.valor_referencia * (1 + (item.margem_lucro || 0.30));
      
      await base44.asServiceRole.entities.PrecificacaoEndpoint.create({
        endpoint_id: eps[0].id,
        titulo: item.titulo,
        categoria: item.categoria,
        valor_referencia: item.valor_referencia,
        custo_externo_unitario: item.custo_externo_unitario || 0,
        limite_custo_interno: item.limite_custo_interno || 1,
        limite_custo_externo: item.limite_custo_externo || 0,
        modelo_cobranca: item.modelo_cobranca,
        margem_lucro: item.margem_lucro || 0.30,
        preco_venda,
        ativo: true
      });
      importados++;
    }

    return Response.json({ importados });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});