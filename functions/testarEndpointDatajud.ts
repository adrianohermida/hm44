import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

function generateSchema(obj, depth = 0, visited = new Set()) {
  if (depth > 4) return { type: 'object' };
  if (obj === null) return { type: 'null' };
  if (obj === undefined) return { type: 'undefined' };
  
  const type = Array.isArray(obj) ? 'array' : typeof obj;
  
  if (type === 'object' && visited.has(obj)) {
    return { type: 'circular' };
  }
  
  if (type === 'object') {
    visited.add(obj);
    const properties = {};
    for (const key in obj) {
      properties[key] = generateSchema(obj[key], depth + 1, visited);
    }
    return { type: 'object', properties };
  }
  
  if (type === 'array') {
    return {
      type: 'array',
      items: obj.length > 0 ? generateSchema(obj[0], depth + 1, visited) : { type: 'unknown' }
    };
  }
  
  return { type };
}

Deno.serve(async (req) => {
  const startTime = Date.now();
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { endpoint_alias, query_body, custom_headers } = await req.json();
    
    const escritorios = await base44.entities.Escritorio.list();
    if (!escritorios?.[0]) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 400 });
    }

    if (!endpoint_alias) {
      return Response.json({ error: 'endpoint_alias obrigatório' }, { status: 400 });
    }

    if (!query_body || !query_body.query) {
      return Response.json({ error: 'query_body obrigatório' }, { status: 400 });
    }

    // Buscar secret do provedor DataJud
    const provedores = await base44.asServiceRole.entities.ProvedorAPI.filter({
      escritorio_id: escritorios[0].id,
      codigo_identificador: 'DATAJUD-CNJ'
    });

    const provedor = provedores[0];
    const secretName = provedor?.api_key_config?.secret_name || provedor?.secret_name || 'DATAJUD_API_TOKEN';
    const headerName = provedor?.api_key_config?.header_name || 'Authorization';
    const prefix = provedor?.api_key_config?.prefix || 'APIKey ';
    
    const token = Deno.env.get(secretName);
    if (!token) {
      return Response.json({ error: `${secretName} não configurado` }, { status: 500 });
    }

    const url = `https://api-publica.datajud.cnj.jus.br/${endpoint_alias}/_search`;
    
    const defaultHeaders = {
      [headerName]: `${prefix}${token}`,
      'Content-Type': 'application/json'
    };

    const finalHeaders = custom_headers 
      ? { ...defaultHeaders, ...custom_headers }
      : defaultHeaders;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: finalHeaders,
      body: JSON.stringify(query_body)
    });

    const responseData = await response.json();
    const latencia = Date.now() - startTime;

    const sucesso = response.ok && responseData?.hits?.total?.value > 0;
    const schema = sucesso ? generateSchema(responseData.hits.hits[0]._source) : null;

    // Salvar teste no histórico
    await base44.asServiceRole.entities.TesteEndpoint.create({
      escritorio_id: escritorios[0].id,
      provedor_id: 'datajud',
      endpoint_nome: endpoint_alias,
      parametros_enviados: query_body,
      resposta_completa: responseData,
      schema_resposta: schema,
      sucesso: sucesso,
      latencia_ms: latencia,
      status_http: response.status,
      usuario_email: user.email
    });

    if (!response.ok) {
      return Response.json({
        success: false,
        erro: `HTTP ${response.status}: ${JSON.stringify(responseData)}`,
        latencia
      });
    }

    return Response.json({
      success: sucesso,
      dados: responseData,
      total_encontrado: responseData?.hits?.total?.value || 0,
      query_executada: query_body,
      endpoint_url: url,
      endpoint_alias: endpoint_alias,
      latencia,
      schema,
      curl_command: `curl -X POST '${url}' -H '${headerName}: ${prefix}[${secretName}]' -H 'Content-Type: application/json' -d '${JSON.stringify(query_body)}'`
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      erro: error.message 
    }, { status: 500 });
  }
});