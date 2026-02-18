import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { objeto } = await req.json();
    const schema = gerarSchema(objeto);

    return Response.json({ schema });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function gerarSchema(obj, profundidade = 0) {
  if (profundidade > 10) return { type: 'object' };
  
  if (Array.isArray(obj)) {
    return {
      type: 'array',
      items: obj.length > 0 ? gerarSchema(obj[0], profundidade + 1) : { type: 'string' }
    };
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const properties = {};
    const required = [];
    
    for (const key in obj) {
      properties[key] = gerarSchema(obj[key], profundidade + 1);
      if (obj[key] !== null && obj[key] !== undefined) {
        required.push(key);
      }
    }
    
    return { 
      type: 'object', 
      properties,
      ...(required.length > 0 && { required })
    };
  }
  
  if (typeof obj === 'number') {
    return { 
      type: Number.isInteger(obj) ? 'integer' : 'number',
      example: obj
    };
  }
  
  if (typeof obj === 'boolean') return { type: 'boolean' };
  
  if (typeof obj === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(obj)) return { type: 'string', format: 'date' };
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(obj)) return { type: 'string', format: 'date-time' };
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(obj)) return { type: 'string', format: 'email' };
    return { type: 'string', example: obj.length > 50 ? obj.substring(0, 50) + '...' : obj };
  }
  
  return { type: 'string' };
}