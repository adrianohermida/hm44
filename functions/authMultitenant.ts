import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const isAdmin = user.role === 'admin';

    if (isAdmin) {
      // Se já tem escritorio_id, apenas retornar sucesso
      if (user.escritorio_id) {
        return Response.json({
          success: true,
          userType: 'admin',
          redirectUrl: '/Dashboard',
          escritorio_id: user.escritorio_id
        });
      }

      // Retornar sucesso — admin sem escritorio_id ainda pode usar a plataforma
      return Response.json({
        success: true,
        userType: 'admin',
        redirectUrl: '/Dashboard',
        escritorio_id: null
      });
    }

    // CLIENT EXTERNO: Redireciona para MeuPainel
    return Response.json({
      success: true,
      userType: 'client',
      redirectUrl: '/MeuPainel',
      email: user.email,
      full_name: user.full_name
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});