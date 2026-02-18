import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { tipo, titulo, conteudo_html, versao, modulo_aplicacao, obrigatorio, ativo, data_vigencia, autor_criacao } = body;

    // Gerar hash SHA-256
    const encoder = new TextEncoder();
    const data = encoder.encode(conteudo_html);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash_sha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const termo = await base44.asServiceRole.entities.TermoLegal.create({
      tipo,
      titulo,
      conteudo_html,
      versao,
      hash_sha256,
      modulo_aplicacao: modulo_aplicacao || 'global',
      obrigatorio: obrigatorio !== false,
      ativo: ativo !== false,
      data_vigencia,
      autor_criacao
    });

    return Response.json({ termo });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});