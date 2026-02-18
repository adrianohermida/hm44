import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const faturas = await base44.entities.FaturaServico.filter(
      { escritorio_id: user.escritorio_id },
      '-created_date',
      50
    );

    return Response.json({ faturas });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});