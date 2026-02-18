import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, metadata, timestamp } = await req.json();

    // Log estruturado para analytics
    console.log(JSON.stringify({
      type: 'helpdesk_action',
      action,
      user_email: user.email,
      metadata,
      timestamp
    }));

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});