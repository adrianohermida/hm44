import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data_inicio, data_fim } = await req.json();
    
    const consumos = await base44.entities.ConsumoAPIEscavador.filter({
      escritorio_id: user.escritorio_id || 'admin',
      created_date: { $gte: data_inicio, $lte: data_fim }
    });

    const stats = {
      total_creditos: consumos.reduce((sum, c) => sum + (c.creditos_utilizados || 0), 0),
      total_requisicoes: consumos.length,
      por_operacao: {},
      sucesso_rate: 0
    };

    consumos.forEach(c => {
      stats.por_operacao[c.operacao] = (stats.por_operacao[c.operacao] || 0) + 1;
    });

    stats.sucesso_rate = (consumos.filter(c => c.sucesso).length / consumos.length * 100).toFixed(2);

    return Response.json(stats);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});