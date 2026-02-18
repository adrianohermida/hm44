import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const baseUrl = 'https://hermidamaia.adv.br';
    
    const robotsTxt = `# robots.txt para hermidamaia.adv.br
User-agent: *
Allow: /
Allow: /Blog
Allow: /blog/*
Allow: /BlogPost/*
Disallow: /EditorBlog
Disallow: /GestaoBlog
Disallow: /Dashboard
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay para bots específicos
User-agent: Googlebot
Crawl-delay: 1

User-agent: Bingbot
Crawl-delay: 1
`;

    return new Response(robotsTxt, {
      headers: { 
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});