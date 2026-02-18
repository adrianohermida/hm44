import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { artigo_id } = await req.json();

    const artigo = (await base44.entities.Blog.filter({ id: artigo_id }))[0];
    if (!artigo) {
      return Response.json({ error: 'Artigo não encontrado' }, { status: 404 });
    }

    const subscribers = await base44.entities.NewsletterSubscriber.filter({
      escritorio_id: artigo.escritorio_id,
      ativo: true
    });

    const subscribersSegmentados = artigo.tags?.length > 0
      ? subscribers.filter(sub => 
          sub.interesses?.some(interesse => artigo.tags.includes(interesse))
        )
      : subscribers;

    let enviados = 0;
    const sendGridApiKey = Deno.env.get('SENDGRID_API_TOKEN');

    for (const subscriber of subscribersSegmentados) {
      const emailHtml = `
        <h1>${artigo.titulo}</h1>
        <p>${artigo.resumo}</p>
        <p><a href="https://seu-dominio.com/blog/${artigo.id}">Ler artigo completo</a></p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          <a href="https://seu-dominio.com/unsubscribe?email=${subscriber.email}">Cancelar inscrição</a>
        </p>
      `;

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sendGridApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: subscriber.email, name: subscriber.nome }]
          }],
          from: { email: 'contato@seu-dominio.com', name: 'Dr. Adriano Hermida Maia' },
          subject: artigo.titulo,
          content: [{
            type: 'text/html',
            value: emailHtml
          }]
        })
      });

      if (response.ok) enviados++;
    }

    return Response.json({ 
      success: true, 
      enviados,
      total: subscribersSegmentados.length 
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});