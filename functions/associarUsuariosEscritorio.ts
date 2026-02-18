import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();

        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const escritorioId = '6948bed65e7da7a1c1eb64d1';
        const emails = ['adrianohermida@gmail.com', 'contato@aetherlab.com'];

        // Buscar todos os usuários
        const allUsers = await base44.asServiceRole.entities.User.list();
        
        // Filtrar apenas os usuários que precisamos atualizar
        const usersToUpdate = allUsers.filter(u => emails.includes(u.email));

        // Atualizar cada usuário com o escritorio_id
        const results = [];
        for (const userToUpdate of usersToUpdate) {
            await base44.asServiceRole.entities.User.update(userToUpdate.id, {
                escritorio_id: escritorioId
            });
            results.push({ email: userToUpdate.email, updated: true });
        }

        return Response.json({ 
            success: true,
            escritorio_id: escritorioId,
            users_updated: results
        });
    } catch (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }
});