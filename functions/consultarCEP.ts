import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cep } = await req.json();
    if (!cep) {
      return Response.json({ error: 'CEP é obrigatório' }, { status: 400 });
    }

    const cepLimpo = cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      return Response.json({ error: 'CEP inválido' }, { status: 400 });
    }

    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
    const response = await fetch(url);
    
    if (!response.ok) {
      return Response.json({ error: 'Erro ao consultar CEP' }, { status: response.status });
    }

    const data = await response.json();
    
    if (data.erro) {
      return Response.json({ error: 'CEP não encontrado' }, { status: 404 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});