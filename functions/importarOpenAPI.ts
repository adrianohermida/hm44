import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { provedor_id, versao_api, openapi_url } = await req.json();

    const response = await fetch(openapi_url);
    const spec = await response.json();

    const endpoints = [];
    const paths = spec.paths || {};

    for (const path in paths) {
      for (const method in paths[path]) {
        if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;

        const operation = paths[path][method];
        endpoints.push({
          provedor_id,
          versao_api: versao_api || 'V2',
          nome: operation.summary || `${method.toUpperCase()} ${path}`,
          metodo: method.toUpperCase(),
          path,
          parametros_obrigatorios: extractParams(operation, true),
          parametros_opcionais: extractParams(operation, false),
          schema_resposta: extractResponseSchema(operation),
          ativo: true
        });
      }
    }

    for (const ep of endpoints) {
      await base44.asServiceRole.entities.EndpointAPI.create(ep);
    }

    return Response.json({ importados: endpoints.length, endpoints });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function extractParams(operation, required) {
  const params = operation.parameters || [];
  return params
    .filter(p => required ? p.required : !p.required)
    .map(p => p.name);
}

function extractResponseSchema(operation) {
  const responses = operation.responses || {};
  const ok = responses['200'] || responses['201'];
  if (!ok?.content?.['application/json']?.schema) return null;
  return ok.content['application/json'].schema;
}