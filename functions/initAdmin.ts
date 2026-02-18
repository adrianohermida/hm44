import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Busca o usuário por email
    const users = await base44.asServiceRole.entities.User.filter({ 
      email: 'adrianohermida@gmail.com' 
    });
    
    if (users.length === 0) {
      return Response.json({ 
        error: 'Usuário não encontrado',
        success: false 
      }, { status: 404 });
    }

    const user = users[0];
    
    // Atualiza para admin
    await base44.asServiceRole.entities.User.update(user.id, { 
      role: 'admin' 
    });

    return Response.json({ 
      success: true,
      message: 'Usuário adrianohermida@gmail.com agora é admin',
      user: { id: user.id, email: user.email, role: 'admin' }
    });
  } catch (error) {
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});