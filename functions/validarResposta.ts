import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint_id, resposta } = await req.json();

    const endpoint = await base44.entities.EndpointAPI.filter({ id: endpoint_id });
    if (!endpoint[0] || !endpoint[0].schema_resposta) {
      return Response.json({ error: 'Schema não cadastrado' }, { status: 404 });
    }

    const divergencias = validarSchema(resposta, endpoint[0].schema_resposta);
    const valido = divergencias.length === 0;

    return Response.json({ 
      valido,
      divergencias,
      breaking_changes: divergencias.filter(d => d.severidade === 'CRITICAL')
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function validarSchema(obj, schema, path = '') {
  const divergencias = [];

  if (schema.type === 'array') {
    if (!Array.isArray(obj)) {
      divergencias.push({
        path,
        esperado: 'array',
        recebido: typeof obj,
        severidade: 'CRITICAL'
      });
      return divergencias;
    }
    if (obj.length > 0 && schema.items) {
      divergencias.push(...validarSchema(obj[0], schema.items, `${path}[0]`));
    }
    return divergencias;
  }

  if (schema.type === 'object') {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      divergencias.push({
        path,
        esperado: 'object',
        recebido: typeof obj,
        severidade: 'CRITICAL'
      });
      return divergencias;
    }

    for (const key in schema.properties) {
      const newPath = path ? `${path}.${key}` : key;
      if (!(key in obj)) {
        const isCritical = schema.required?.includes(key);
        divergencias.push({
          path: newPath,
          mensagem: 'Campo ausente',
          severidade: isCritical ? 'CRITICAL' : 'WARNING'
        });
      } else {
        divergencias.push(...validarSchema(obj[key], schema.properties[key], newPath));
      }
    }

    for (const key in obj) {
      if (!(key in schema.properties)) {
        divergencias.push({
          path: path ? `${path}.${key}` : key,
          mensagem: 'Campo não esperado',
          severidade: 'INFO'
        });
      }
    }
    return divergencias;
  }

  const tipoRecebido = typeof obj;
  if (schema.type !== tipoRecebido && !(schema.type === 'integer' && tipoRecebido === 'number')) {
    divergencias.push({
      path,
      esperado: schema.type,
      recebido: tipoRecebido,
      severidade: 'CRITICAL'
    });
  }

  return divergencias;
}