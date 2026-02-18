import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { numero_cnj } = await req.json();
    const token = Deno.env.get('ESCAVADOR_API_TOKEN');

    const response = await fetch(`https://api.escavador.com/api/v2/processos/${numero_cnj}/audiencias`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await response.json();

    await base44.entities.ConsumoAPIEscavador.create({
      escritorio_id: user.escritorio_id || 'admin',
      usuario_email: user.email,
      endpoint: '/api/v2/processos/:numero_cnj/audiencias',
      versao_api: 'V2',
      operacao: 'BUSCA_PROCESSO',
      status_resposta: response.status,
      sucesso: response.ok,
      parametros: { numero_cnj }
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});