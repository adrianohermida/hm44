import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { endpoint_id } = await req.json();

    const endpoint = await base44.entities.EndpointAPI.filter({ id: endpoint_id });
    if (!endpoint[0]?.schema_resposta) {
      return Response.json({ error: 'Schema não encontrado' }, { status: 404 });
    }

    const mock = gerarDados(endpoint[0].schema_resposta);
    return Response.json({ mock });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function gerarDados(schema) {
  if (schema.type === 'array') {
    return [gerarDados(schema.items), gerarDados(schema.items)];
  }

  if (schema.type === 'object') {
    const obj = {};
    for (const key in schema.properties) {
      obj[key] = gerarDados(schema.properties[key]);
    }
    return obj;
  }

  if (schema.type === 'string') {
    if (schema.format === 'email') return 'mock@example.com';
    if (schema.format === 'date') return '2025-01-01';
    if (schema.format === 'date-time') return '2025-01-01T12:00:00Z';
    return schema.example || 'mock_string';
  }

  if (schema.type === 'integer') return schema.example || 123;
  if (schema.type === 'number') return schema.example || 123.45;
  if (schema.type === 'boolean') return true;

  return null;
}