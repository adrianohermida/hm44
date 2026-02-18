import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { analise_id } = await req.json();

    if (!analise_id) {
      return Response.json({ error: 'analise_id é obrigatório' }, { status: 400 });
    }

    // Buscar análise
    const analises = await base44.asServiceRole.entities.DockerAnalise.filter({ id: analise_id });
    if (!analises.length) {
      return Response.json({ error: 'Análise não encontrada' }, { status: 404 });
    }
    const analise = analises[0];

    if (analise.status !== 'CONCLUIDO') {
      return Response.json({ error: 'Análise ainda não foi concluída' }, { status: 400 });
    }

    if (!analise.metadados_extraidos) {
      return Response.json({ error: 'Metadados não encontrados' }, { status: 400 });
    }

    const metadados = analise.metadados_extraidos;

    // Verificar se já existe provedor com mesma base_url
    const provedoresExistentes = await base44.asServiceRole.entities.ProvedorAPI.filter({
      escritorio_id: analise.escritorio_id
    });

    const provedorDuplicado = provedoresExistentes.find(p => 
      p.base_url_v1 === metadados.base_url || 
      p.base_url_v2 === metadados.base_url
    );

    if (provedorDuplicado) {
      return Response.json({
        sucesso: false,
        erro: 'Provedor já existe',
        provedor_existente: provedorDuplicado
      });
    }

    // Gerar código identificador único
    const codigoBase = metadados.nome_api
      ?.toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .substring(0, 4) || 'API';
    
    const numero = String(provedoresExistentes.length + 1).padStart(3, '0');
    const codigo_identificador = `${codigoBase}-${numero}`;

    // Mapear tipo de autenticação
    const tipoAuthMap = {
      'api_key': 'api_key',
      'bearer': 'bearer_token',
      'oauth2': 'oauth2',
      'basic': 'basic_auth'
    };

    const tipo_autenticacao = tipoAuthMap[metadados.autenticacao?.tipo] || 'api_key';

    // Criar provedor
    const novoProvedor = await base44.asServiceRole.entities.ProvedorAPI.create({
      escritorio_id: analise.escritorio_id,
      codigo_identificador: codigo_identificador,
      nome: metadados.nome_api || 'Nova API',
      tipo: 'REST',
      requer_autenticacao: !!metadados.autenticacao,
      tipo_autenticacao: tipo_autenticacao,
      base_url_v1: metadados.base_url || '',
      base_url_v2: '',
      secret_name: metadados.autenticacao?.header?.replace(/[^A-Z0-9_]/g, '_').toUpperCase() || '',
      api_key_config: {
        secret_name: metadados.autenticacao?.header?.replace(/[^A-Z0-9_]/g, '_').toUpperCase() || '',
        header_name: metadados.autenticacao?.header || 'Authorization',
        prefix: metadados.autenticacao?.formato?.split(' ')[0] || 'Bearer'
      },
      quota_config: {
        limite_mensal: metadados.rate_limits?.requisicoes_por_dia ? metadados.rate_limits.requisicoes_por_dia * 30 : 0,
        limite_diario: metadados.rate_limits?.requisicoes_por_dia || 0,
        consumo_mes_atual: 0,
        consumo_dia_atual: 0,
        alerta_threshold_percent: 80,
        quota_excedida: false
      },
      descricao: metadados.descricao || '',
      documentacao_url: analise.url_documentacao || '',
      ativo: true,
      saude_status: 'Desconhecido',
      latencia_media_ms: 0,
      taxa_sucesso: 100,
      total_requisicoes: 0
    });

    // Atualizar análise com provedor_id
    await base44.asServiceRole.entities.DockerAnalise.update(analise_id, {
      metadados_extraidos: {
        ...metadados,
        provedor_criado_id: novoProvedor.id
      }
    });

    return Response.json({
      sucesso: true,
      provedor: novoProvedor,
      mensagem: `Provedor "${novoProvedor.nome}" criado com sucesso`
    });

  } catch (error) {
    console.error('Erro:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});