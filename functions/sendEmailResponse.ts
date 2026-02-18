import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { to, subject, body } = await req.json();

    await base44.integrations.Core.SendEmail({
      from_name: 'Assistente Virtual - Dr. Adriano Hermida Maia',
      to,
      subject: `${subject} (Resposta Automática)`,
      body: `${body}\n\n---\nEsta é uma resposta automática do assistente virtual.\nEm breve um advogado entrará em contato.`
    });

    return Response.json({ success: true, message: 'E-mail enviado' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});