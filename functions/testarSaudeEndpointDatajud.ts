import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const startTime = Date.now();
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { endpoint_alias, endpoint_id } = await req.json();
    
    const escritorios = await base44.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    const token = Deno.env.get('DATAJUD_API_TOKEN');
    if (!token) {
      return Response.json({ error: 'DATAJUD_API_TOKEN não configurado' }, { status: 500 });
    }

    const url = `https://api-publica.datajud.cnj.jus.br/${endpoint_alias}/_search`;
    const testQuery = { query: { match_all: {} }, size: 1 };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `APIKey ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testQuery)
      });

      const latencia = Date.now() - startTime;
      const disponivel = response.ok;

      await base44.asServiceRole.entities.HistoricoSaudeProvedor.create({
        escritorio_id: escritorioId,
        provedor_id: 'datajud_cnj',
        endpoint_nome: endpoint_alias,
        disponivel,
        tempo_resposta_ms: latencia,
        status_code: response.status,
        erro: disponivel ? null : `HTTP ${response.status}`,
        testado_por: user.email
      });

      return Response.json({
        success: disponivel,
        latencia,
        status: response.status,
        disponivel
      });
    } catch (error) {
      await base44.asServiceRole.entities.HistoricoSaudeProvedor.create({
        escritorio_id: escritorioId,
        provedor_id: 'datajud_cnj',
        endpoint_nome: endpoint_alias,
        disponivel: false,
        erro: error.message,
        testado_por: user.email
      });

      return Response.json({
        success: false,
        erro: error.message
      });
    }
  } catch (error) {
    return Response.json({ 
      success: false, 
      erro: error.message 
    }, { status: 500 });
  }
});