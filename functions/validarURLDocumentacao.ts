import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();

    if (!url) {
      return Response.json({ 
        valido: false, 
        erro: 'URL é obrigatória' 
      }, { status: 400 });
    }

    // 1. Validar formato da URL
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      return Response.json({ 
        valido: false, 
        erro: 'URL inválida' 
      });
    }

    // 2. Validar protocolo
    if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
      return Response.json({ 
        valido: false, 
        erro: 'Protocolo deve ser HTTP ou HTTPS' 
      });
    }

    // 3. Testar conectividade e Content-Type
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Base44DockerBot/1.0)',
          'Accept': 'application/json, text/html, text/yaml, */*'
        },
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      if (!response.ok) {
        return Response.json({ 
          valido: false, 
          erro: `Erro HTTP: ${response.status} ${response.statusText}`,
          status: response.status
        });
      }

      const contentType = response.headers.get('content-type') || '';
      
      // 4. Detectar tipo de documentação
      let tipoDetectado = 'DESCONHECIDO';
      let confianca = 0;
      
      if (contentType.includes('application/json')) {
        tipoDetectado = 'SWAGGER_JSON';
        confianca = 0.8;
      } else if (contentType.includes('yaml') || contentType.includes('yml')) {
        tipoDetectado = 'OPENAPI_YAML';
        confianca = 0.8;
      } else if (contentType.includes('text/html')) {
        // Buscar conteúdo para confirmar
        const htmlRes = await fetch(url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Base44DockerBot/1.0)' }
        });
        const html = await htmlRes.text();
        
        if (html.includes('swagger-ui') || html.includes('redoc')) {
          tipoDetectado = 'SWAGGER_UI';
          confianca = 0.9;
        } else if (html.includes('postman')) {
          tipoDetectado = 'POSTMAN_DOCS';
          confianca = 0.7;
        } else if (html.includes('raml') || html.includes('#%RAML')) {
          tipoDetectado = 'RAML';
          confianca = 0.8;
        } else if (html.includes('blueprint') || html.includes('FORMAT:')) {
          tipoDetectado = 'API_BLUEPRINT';
          confianca = 0.7;
        } else {
          tipoDetectado = 'HTML_DOCS';
          confianca = 0.5;
        }
      }

      // 5. Avisos de qualidade
      const avisos = [];
      if (parsedUrl.protocol === 'http:') {
        avisos.push('⚠️ URL não usa HTTPS (menos seguro)');
      }
      if (confianca < 0.7) {
        avisos.push('⚠️ Tipo de documentação não identificado com certeza');
      }
      if (!contentType.includes('json') && !contentType.includes('yaml') && !contentType.includes('html')) {
        avisos.push('⚠️ Content-Type incomum');
      }

      return Response.json({
        valido: true,
        url: url,
        tipo_detectado: tipoDetectado,
        confianca: confianca,
        content_type: contentType,
        avisos: avisos,
        recomendacao: confianca >= 0.7 ? 'Documentação detectada com sucesso' : 'Revisar tipo de documentação'
      });

    } catch (error) {
      return Response.json({ 
        valido: false, 
        erro: `Erro ao conectar: ${error.message}`,
        detalhes: 'Verifique se a URL está acessível e aceita requisições externas'
      });
    }

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});