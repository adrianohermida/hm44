import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const escritorios = await base44.entities.Escritorio.list();
    if (!escritorios?.[0]) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 400 });
    }

    const escritorioId = escritorios[0].id;

    // Criar provedor DataJud
    const existingProvedor = await base44.asServiceRole.entities.ProvedorAPI.filter({
      escritorio_id: escritorioId,
      codigo_identificador: 'DATAJUD-CNJ'
    });

    let provedorId;
    if (existingProvedor.length === 0) {
      const provedor = await base44.asServiceRole.entities.ProvedorAPI.create({
        escritorio_id: escritorioId,
        codigo_identificador: 'DATAJUD-CNJ',
        nome: 'DataJud CNJ',
        tipo: 'REST',
        requer_autenticacao: true,
        tipo_autenticacao: 'api_key',
        base_url_v1: 'https://api-publica.datajud.cnj.jus.br',
        secret_name: 'DATAJUD_API_TOKEN',
        api_key_config: {
          secret_name: 'DATAJUD_API_TOKEN',
          header_name: 'Authorization',
          prefix: 'APIKey '
        },
        descricao: 'API pública do CNJ para consulta de processos judiciais',
        documentacao_url: 'https://datajud.cnj.jus.br/api-publica',
        ativo: true
      });
      provedorId = provedor.id;
    } else {
      provedorId = existingProvedor[0].id;
    }

    // Endpoints por tribunal
    const tribunais = [
      { alias: 'api_publica_tjmg', nome: 'TJMG', fullName: 'TJ Minas Gerais' },
      { alias: 'api_publica_tjsp', nome: 'TJSP', fullName: 'TJ São Paulo' },
      { alias: 'api_publica_tjrj', nome: 'TJRJ', fullName: 'TJ Rio de Janeiro' },
      { alias: 'api_publica_tjrs', nome: 'TJRS', fullName: 'TJ Rio Grande do Sul' },
      { alias: 'api_publica_trf3', nome: 'TRF3', fullName: 'TRF 3ª Região' }
    ];

    let criados = 0;
    let atualizados = 0;

    for (const tribunal of tribunais) {
      const existing = await base44.asServiceRole.entities.EndpointAPI.filter({
        escritorio_id: escritorioId,
        provedor_id: provedorId,
        nome: `Busca Processos ${tribunal.nome}`
      });

      const endpointData = {
        provedor_id: provedorId,
        escritorio_id: escritorioId,
        versao_api: 'V1',
        nome: `Busca Processos ${tribunal.nome}`,
        descricao: `Consulta processos no ${tribunal.fullName} via DataJud`,
        categoria: 'Busca Processos',
        metodo: 'POST',
        path: `/${tribunal.alias}/_search`,
        requer_autenticacao: true,
        parametros: [
          {
            nome: 'query',
            tipo: 'object',
            obrigatorio: true,
            localizacao: 'body',
            descricao: 'Query Elasticsearch',
            exemplo: JSON.stringify({ match: { numeroProcesso: '00008856582023826029' } })
          },
          {
            nome: 'size',
            tipo: 'number',
            obrigatorio: false,
            localizacao: 'body',
            valor_padrao: '10',
            exemplo: '10',
            descricao: 'Quantidade de resultados'
          }
        ],
        exemplo_payload: {
          query: { match: { numeroProcesso: '00008856582023826029' } },
          size: 10
        },
        documentacao_url: 'https://datajud.cnj.jus.br/api-publica',
        ativo: true,
        tags: ['datajud', 'cnj', tribunal.nome.toLowerCase()]
      };

      if (existing.length === 0) {
        await base44.asServiceRole.entities.EndpointAPI.create(endpointData);
        criados++;
      } else {
        await base44.asServiceRole.entities.EndpointAPI.update(existing[0].id, endpointData);
        atualizados++;
      }
    }

    return Response.json({
      success: true,
      provedor_id: provedorId,
      criados,
      atualizados,
      total: tribunais.length
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});