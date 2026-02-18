import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const startTime = Date.now();
  let statusCode = 200;
  
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { processo_id } = await req.json();

    if (!processo_id) {
      return Response.json({ error: 'processo_id é obrigatório' }, { status: 400 });
    }

    const [processo] = await base44.asServiceRole.entities.Processo.filter({ id: processo_id });
    
    if (!processo || !processo.numero_cnj) {
      return Response.json({ error: 'Processo não encontrado ou sem número CNJ' }, { status: 404 });
    }

    const response = await base44.asServiceRole.functions.invoke('consultarProcessoCNJ', {
      numero_cnj: processo.numero_cnj,
      salvar_no_sistema: true,
      cliente_id: processo.cliente_id
    });

    // Validar estrutura da resposta
    if (!response || !response.data) {
      statusCode = 500;
      
      await base44.asServiceRole.entities.ConsumoAPIExterna.create({
        escritorio_id: processo.escritorio_id,
        usuario_email: user.email,
        provedor_id: '6949a088ff43da2cb996d2c8',
        endpoint_id: 'refresh-processo',
        operacao: 'refresh',
        parametros: { numero_cnj: processo.numero_cnj },
        sucesso: false,
        http_status: 500,
        tempo_resposta_ms: Date.now() - startTime,
        erro_mensagem: 'Resposta vazia da API',
        creditos_consumidos: 1,
        custo_estimado: 0.50
      });

      return Response.json({
        sucesso: false,
        erro: 'API retornou resposta vazia ou inválida'
      }, { status: 500 });
    }

    // Verificar se há dados para atualizar
    const dadosAtualizados = response.data.processo_atualizado || response.data.processo || response.data;
    
    if (!dadosAtualizados || typeof dadosAtualizados !== 'object') {
      statusCode = 500;
      
      await base44.asServiceRole.entities.ConsumoAPIExterna.create({
        escritorio_id: processo.escritorio_id,
        usuario_email: user.email,
        provedor_id: '6949a088ff43da2cb996d2c8',
        endpoint_id: 'refresh-processo',
        operacao: 'refresh',
        parametros: { numero_cnj: processo.numero_cnj },
        sucesso: false,
        http_status: response.status || 200,
        tempo_resposta_ms: Date.now() - startTime,
        erro_mensagem: 'Estrutura de dados inválida',
        creditos_consumidos: 1,
        custo_estimado: 0.50
      });

      return Response.json({
        sucesso: false,
        erro: 'Dados do processo não encontrados na resposta da API'
      }, { status: 500 });
    }

    // Atualizar processo (apenas campos que existem)
    const updateData = {
      data_ultima_verificacao: new Date().toISOString()
    };

    if (dadosAtualizados.tribunal) updateData.tribunal = dadosAtualizados.tribunal;
    if (dadosAtualizados.sistema) updateData.sistema = dadosAtualizados.sistema;
    if (dadosAtualizados.classe) updateData.classe = dadosAtualizados.classe;
    if (dadosAtualizados.assunto) updateData.assunto = dadosAtualizados.assunto;
    if (dadosAtualizados.area) updateData.area = dadosAtualizados.area;
    if (dadosAtualizados.orgao_julgador) updateData.orgao_julgador = dadosAtualizados.orgao_julgador;
    if (dadosAtualizados.instancia) updateData.instancia = dadosAtualizados.instancia;
    if (dadosAtualizados.data_distribuicao) updateData.data_distribuicao = dadosAtualizados.data_distribuicao;
    if (dadosAtualizados.valor_causa) updateData.valor_causa = dadosAtualizados.valor_causa;
    if (dadosAtualizados.polo_ativo) updateData.polo_ativo = dadosAtualizados.polo_ativo;
    if (dadosAtualizados.polo_passivo) updateData.polo_passivo = dadosAtualizados.polo_passivo;
    if (dadosAtualizados.data_ultima_movimentacao) updateData.data_ultima_movimentacao = dadosAtualizados.data_ultima_movimentacao;
    if (dadosAtualizados.situacao_processo) updateData.situacao_processo = dadosAtualizados.situacao_processo;
    if (dadosAtualizados.dados_completos_api) updateData.dados_completos_api = dadosAtualizados.dados_completos_api;

    await base44.asServiceRole.entities.Processo.update(processo_id, updateData);

    // Registrar consumo de API
    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: processo.escritorio_id,
      usuario_email: user.email,
      provedor_id: '6949a088ff43da2cb996d2c8',
      endpoint_id: 'refresh-processo',
      operacao: 'refresh',
      parametros: { numero_cnj: processo.numero_cnj },
      sucesso: true,
      http_status: response.status || 200,
      tempo_resposta_ms: Date.now() - startTime,
      creditos_consumidos: 1,
      custo_estimado: 0.50
    });

    return Response.json({
      sucesso: true,
      processo_id,
      numero_cnj: processo.numero_cnj,
      campos_atualizados: Object.keys(updateData).length - 1,
      tempo_ms: Date.now() - startTime
    });

  } catch (error) {
    const errorTime = Date.now() - startTime;
    
    try {
      const base44 = createClientFromRequest(req);
      const { processo_id } = await req.json();
      const [processo] = await base44.asServiceRole.entities.Processo.filter({ id: processo_id });
      
      if (processo) {
        await base44.asServiceRole.entities.ConsumoAPIExterna.create({
          escritorio_id: processo.escritorio_id,
          usuario_email: 'system',
          provedor_id: '6949a088ff43da2cb996d2c8',
          endpoint_id: 'refresh-processo',
          operacao: 'refresh',
          parametros: { numero_cnj: processo.numero_cnj },
          sucesso: false,
          http_status: 500,
          tempo_resposta_ms: errorTime,
          erro_mensagem: error.message,
          creditos_consumidos: 0,
          custo_estimado: 0
        });
      }
    } catch (logError) {
      console.error('Erro ao registrar consumo:', logError);
    }

    return Response.json({
      sucesso: false,
      erro: error.message
    }, { status: 500 });
  }
});