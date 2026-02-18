import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const ESCRITORIO_ID = '6948bed65e7da7a1c1eb64d1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const allUsers = await base44.asServiceRole.entities.User.list();
    const usersToUpdate = allUsers.filter(u => !u.escritorio_id || u.escritorio_id !== ESCRITORIO_ID);

    const results = [];
    for (const u of usersToUpdate) {
      try {
        await base44.asServiceRole.entities.User.update(u.id, {
          escritorio_id: ESCRITORIO_ID
        });
        results.push({ email: u.email, status: 'updated' });
      } catch (error) {
        results.push({ email: u.email, status: 'error', error: error.message });
      }
    }

    return Response.json({ 
      success: true,
      total_users: allUsers.length,
      updated_count: results.filter(r => r.status === 'updated').length,
      results
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});