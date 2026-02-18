import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const startTime = Date.now();
  let statusCode = 500;
  let sucesso = false;
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { cpf } = await req.json();
    
    if (!cpf) {
      statusCode = 400;
      return Response.json({ error: 'CPF é obrigatório' }, { status: 400 });
    }

    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
      statusCode = 400;
      return Response.json({ error: 'CPF inválido' }, { status: 400 });
    }

    const token = Deno.env.get('DIRECTDATA_API_KEY');
    
    if (!token) {
      statusCode = 500;
      return Response.json({ error: 'Token DirectData não configurado' }, { status: 500 });
    }

    const url = `https://apiv3.directd.com.br/api/CadastroPessoaFisica?CPF=${cpfLimpo}&TOKEN=${token}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });

    statusCode = response.status;
    const data = await response.json();
    sucesso = response.ok && !data.error;

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: escritorioId,
      usuario_email: user.email,
      provedor_id: '6949a088ff43da2cb996d2c9',
      endpoint_id: '694999729d2ed8feb8ddbb9d',
      operacao: 'consulta_cpf',
      parametros: { cpf: cpfLimpo.substring(0, 3) + '***' },
      sucesso,
      http_status: statusCode,
      tempo_resposta_ms: Date.now() - startTime,
      creditos_consumidos: 1,
      custo_estimado: 0.16
    });

    if (!response.ok) {
      return Response.json({ 
        error: 'Erro ao consultar DirectData',
        status: response.status,
        details: data
      }, { status: response.status });
    }

    return Response.json(data);
    
  } catch (error) {
    return Response.json({ 
      error: error.message,
      sucesso: false 
    }, { status: statusCode });
  }
});