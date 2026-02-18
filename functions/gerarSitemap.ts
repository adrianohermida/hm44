import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;
    
    if (!escritorioId) {
      return new Response('Escritório não encontrado', { status: 404 });
    }

    const artigos = await base44.asServiceRole.entities.Blog.filter({
      publicado: true,
      escritorio_id: escritorioId
    }, '-data_publicacao');

    const baseUrl = 'https://hermidamaia.adv.br';
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/Blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  ${artigos.map(art => {
    const url = art.slug ? `${baseUrl}/blog/${art.slug}` : `${baseUrl}/BlogPost?id=${art.id}`;
    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date(art.updated_date || art.data_publicacao || art.created_date).toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('')}
</urlset>`;

    return new Response(sitemap, {
      headers: { 'Content-Type': 'application/xml' }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});