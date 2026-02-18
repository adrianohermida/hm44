import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { url } = await req.json();
    
    const apiKey = Deno.env.get('GOOGLE_PAGESPEED_API_KEY');
    if (!apiKey) {
      return Response.json({ 
        error: 'API key não configurada',
        performance: 0,
        suggestions: ['Configure GOOGLE_PAGESPEED_API_KEY nas secrets']
      });
    }

    const response = await fetch(
      `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`
    );
    
    if (!response.ok) {
      throw new Error('Erro ao consultar PageSpeed API');
    }

    const data = await response.json();
    const performance = Math.round(data.lighthouseResult.categories.performance.score * 100);
    
    const suggestions = [];
    const audits = data.lighthouseResult.audits;
    
    if (audits['render-blocking-resources']?.score < 0.9) {
      suggestions.push('Reduza recursos bloqueadores de renderização');
    }
    if (audits['unused-css-rules']?.score < 0.9) {
      suggestions.push('Remova CSS não utilizado');
    }
    if (audits['offscreen-images']?.score < 0.9) {
      suggestions.push('Implemente lazy loading em imagens');
    }
    if (audits['uses-text-compression']?.score < 0.9) {
      suggestions.push('Ative compressão de texto');
    }

    return Response.json({
      performance,
      suggestions: suggestions.length ? suggestions : ['Sua página está bem otimizada!'],
      fcp: audits['first-contentful-paint']?.displayValue,
      lcp: audits['largest-contentful-paint']?.displayValue
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});