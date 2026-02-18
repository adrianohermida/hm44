import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticket_id, action, duration_ms, timestamp } = await req.json();

    // Log apenas métricas lentas (> 5s)
    if (duration_ms > 5000) {
      console.log(`[PERFORMANCE] ${action} - ${duration_ms}ms - Ticket: ${ticket_id}`);
      
      // Opcional: salvar em entity para analytics
      // await base44.asServiceRole.entities.PerformanceLog.create({
      //   ticket_id,
      //   action,
      //   duration_ms,
      //   user_email: user.email,
      //   timestamp
      // });
    }

    return Response.json({ 
      success: true,
      logged: duration_ms > 5000 
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});