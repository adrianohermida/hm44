import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { numero_cnj } = await req.json();
    if (!numero_cnj) return Response.json({ error: 'numero_cnj obrigatório' }, { status: 400 });

    const token = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!token) {
      return Response.json({ error: 'Token Escavador não configurado' }, { status: 500 });
    }

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    if (!escritorios[0]?.id) {
      return Response.json({ error: 'Você não está vinculado a nenhum escritório' }, { status: 403 });
    }
    const escritorioId = escritorios[0].id;

    const url = `https://api.escavador.com/api/v2/processos/numero_cnj/${numero_cnj}/status-atualizacao`;

    const startTime = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    const tempo_resposta_ms = Date.now() - startTime;

    // Registrar consumo
    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: escritorioId,
      usuario_email: user.email,
      provedor_id: '6949735a71244b18c7a49e5e',
      endpoint_id: '69507c0a0602864dc313691f',
      operacao: 'producao',
      parametros: { numero_cnj },
      sucesso: response.ok,
      http_status: response.status,
      creditos_consumidos: response.ok ? 1 : 0,
      tempo_resposta_ms
    });

    if (!response.ok) {
      return Response.json({ 
        error: `API retornou status ${response.status}`
      }, { status: response.status });
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('[statusAtualizacaoProcesso] Erro:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});