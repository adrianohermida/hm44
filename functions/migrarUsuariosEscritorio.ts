import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    
    if (!escritorios || escritorios.length === 0) {
      return Response.json({ error: 'Nenhum escritório encontrado' }, { status: 404 });
    }

    const escritorioId = escritorios[0].id;

    // Buscar todos usuários
    const users = await base44.asServiceRole.entities.User.list();
    
    let atualizados = 0;
    let erros = 0;

    for (const u of users) {
      try {
        if (!u.escritorio_id) {
          await base44.asServiceRole.entities.User.update(u.id, {
            escritorio_id: escritorioId,
            ativo: true
          });
          atualizados++;
        }
      } catch (error) {
        console.error(`Erro ao atualizar ${u.email}:`, error);
        erros++;
      }
    }

    return Response.json({
      success: true,
      total_usuarios: users.length,
      atualizados,
      erros,
      escritorio_id: escritorioId
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});