import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

const typingUsers = new Map();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, ticket_id, user_email } = await req.json();

    if (action === 'start') {
      typingUsers.set(ticket_id, { 
        user_email: user_email || user.email, 
        timestamp: Date.now() 
      });
    } else if (action === 'stop') {
      typingUsers.delete(ticket_id);
    }

    for (const [key, val] of typingUsers.entries()) {
      if (Date.now() - val.timestamp > 5000) {
        typingUsers.delete(key);
      }
    }

    const typing = typingUsers.get(ticket_id);
    return Response.json({ typing: typing || null });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});