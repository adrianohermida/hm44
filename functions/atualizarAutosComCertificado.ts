import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { numero_cnj, certificado_id, documentos_especificos } = await req.json();
    const token = Deno.env.get('ESCAVADOR_API_TOKEN');

    const body = {
      numero_cnj,
      tipo: 'autos',
      utilizar_certificado: true,
      certificado_id,
      ...(documentos_especificos && { documentos_especificos })
    };

    const response = await fetch('https://api.escavador.com/api/v2/processos/solicitar-atualizacao', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    await base44.entities.SolicitacaoAtualizacao.create({
      escritorio_id: user.escritorio_id || 'admin',
      processo_numero_cnj: numero_cnj,
      solicitacao_id_externo: data.solicitacao_id,
      status: 'PENDENTE',
      tipo_solicitacao: 'autos',
      utilizar_certificado: true,
      certificado_id,
      documentos_especificos
    });

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});