import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { termo_id, conteudo_html, ...rest } = body;

    let updateData = { ...rest };

    if (conteudo_html) {
      const encoder = new TextEncoder();
      const data = encoder.encode(conteudo_html);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hash_sha256 = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      updateData.conteudo_html = conteudo_html;
      updateData.hash_sha256 = hash_sha256;
    }

    const termo = await base44.asServiceRole.entities.TermoLegal.update(termo_id, updateData);

    return Response.json({ termo });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});