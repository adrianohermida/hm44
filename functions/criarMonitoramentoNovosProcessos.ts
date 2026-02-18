import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { termo, tipo, variacoes, tribunais } = await req.json();
    const token = Deno.env.get('ESCAVADOR_API_TOKEN');

    const response = await fetch('https://api.escavador.com/api/v2/monitoramentos/novos-processos', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ termo, tipo, variacoes, tribunais_especificos: tribunais })
    });

    const data = await response.json();

    await base44.entities.MonitoramentoNovosProcessos.create({
      escritorio_id: user.escritorio_id,
      monitoramento_id_externo: data.id,
      termo,
      tipo,
      variacoes,
      tribunais_especificos: tribunais,
      ativo: true
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});