import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { numero_cnj, salvar_no_sistema = true, cliente_id = null } = await req.json();

    if (!numero_cnj) {
      return Response.json({ 
        error: 'numero_cnj é obrigatório',
        sucesso: false 
      }, { status: 400 });
    }

    // Buscar escritório
    const [escritorio] = await base44.asServiceRole.entities.Escritorio.list();
    if (!escritorio) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }

    // Buscar endpoint e provedor
    const [endpoint] = await base44.asServiceRole.entities.EndpointAPI.filter({
      nome: 'Processo por numeração CNJ'
    });

    if (!endpoint) {
      return Response.json({ error: 'Endpoint não configurado' }, { status: 500 });
    }

    const [provedor] = await base44.asServiceRole.entities.ProvedorAPI.filter({
      id: endpoint.provedor_id
    });

    if (!provedor) {
      return Response.json({ error: 'Provedor não encontrado' }, { status: 500 });
    }

    // Construir URL
    const baseUrl = provedor.base_url_v2 || provedor.base_url_v1;
    const path = endpoint.path.replace('{numero_cnj}', numero_cnj);
    const url = baseUrl + path;

    // Buscar secret
    const apiKey = Deno.env.get('ESCAVADOR_API_TOKEN');
    if (!apiKey) {
      return Response.json({ error: 'ESCAVADOR_API_TOKEN não configurado' }, { status: 500 });
    }

    // Executar request
    const inicioReq = Date.now();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      }
    });

    const tempoMs = Date.now() - inicioReq;
    const httpStatus = response.status;
    
    if (!response.ok) {
      const errorText = await response.text();
      
      // Registrar consumo (falha)
      await base44.asServiceRole.entities.ConsumoAPIExterna.create({
        escritorio_id: escritorio.id,
        provedor_id: provedor.id,
        endpoint_id: endpoint.id,
        operacao: 'consulta_cnj',
        parametros: { numero_cnj },
        sucesso: false,
        http_status: httpStatus,
        tempo_ms: tempoMs,
        creditos_consumidos: endpoint.creditos_consumidos || 5,
        erro: errorText,
        executado_por: user.email
      });

      return Response.json({
        sucesso: false,
        erro: errorText,
        http_status: httpStatus
      }, { status: httpStatus });
    }

    const data = await response.json();

    // Registrar consumo (sucesso)
    await base44.asServiceRole.entities.ConsumoAPIExterna.create({
      escritorio_id: escritorio.id,
      provedor_id: provedor.id,
      endpoint_id: endpoint.id,
      operacao: 'consulta_cnj',
      parametros: { numero_cnj },
      sucesso: true,
      http_status: httpStatus,
      tempo_ms: tempoMs,
      creditos_consumidos: endpoint.creditos_consumidos || 5,
      resposta: data,
      executado_por: user.email
    });

    // Salvar no sistema se solicitado
    if (salvar_no_sistema) {
      const [processoExistente] = await base44.asServiceRole.entities.Processo.filter({
        numero_cnj,
        escritorio_id: escritorio.id
      });

      let processoId = processoExistente?.id;
      const fonteOrigem = data.fontes?.[0];
      const capa = fonteOrigem?.capa || {};

      const processoData = {
        escritorio_id: escritorio.id,
        cliente_id: cliente_id,
        numero_cnj,
        numero_interno: numero_cnj.replace(/\D/g, ''),
        classe: capa.classe || 'Não informado',
        assunto: capa.assunto || 'Não informado',
        area: capa.area || 'CIVEL',
        polo: 'ATIVO',
        situacao: capa.situacao || 'Em andamento',
        valor_causa: capa.valor_causa?.valor ? parseFloat(capa.valor_causa.valor) : null,
        data_distribuicao: capa.data_distribuicao || data.data_inicio,
        tribunal: fonteOrigem?.sigla || data.unidade_origem?.tribunal_sigla,
        vara: data.unidade_origem?.nome,
        comarca: data.unidade_origem?.cidade,
        estado: data.estado_origem?.sigla,
        grau: fonteOrigem?.grau || 1,
        status: 'ativo',
        origem_dados: 'escavador_api',
        data_ultima_atualizacao: new Date().toISOString(),
        metadata_escavador: {
          processo_fonte_id: fonteOrigem?.processo_fonte_id,
          sistema: fonteOrigem?.sistema,
          url_tribunal: fonteOrigem?.url,
          segredo_justica: fonteOrigem?.segredo_justica,
          status_predito: fonteOrigem?.status_predito,
          informacoes_complementares: capa.informacoes_complementares
        }
      };

      if (!processoExistente) {
        const novoProcesso = await base44.asServiceRole.entities.Processo.create(processoData);
        processoId = novoProcesso.id;

        // Notificação interna
        await base44.asServiceRole.entities.Notificacao.create({
          tipo: 'novo_processo_importado',
          titulo: `Novo processo via Escavador: ${numero_cnj}`,
          mensagem: `Processo ${capa.classe} importado do tribunal ${fonteOrigem?.sigla}`,
          user_email: user.email,
          escritorio_id: escritorio.id,
          link: `/processos/${processoId}?from=escavador&endpoint_id=${endpoint.id}`
        });
      } else {
        await base44.asServiceRole.entities.Processo.update(processoId, processoData);
        processoId = processoExistente.id;
      }

      // Limpar partes antigas
      await base44.asServiceRole.entities.ProcessoParte.delete({ processo_id: processoId });

      // Criar partes atualizadas
      if (fonteOrigem?.envolvidos) {
        for (const env of fonteOrigem.envolvidos) {
          await base44.asServiceRole.entities.ProcessoParte.create({
            processo_id: processoId,
            escritorio_id: escritorio.id,
            nome: env.nome,
            tipo_participacao: env.tipo_normalizado || env.tipo,
            polo: env.polo,
            cpf_cnpj: env.cpf || env.cnpj,
            qualificacao: env.tipo_pessoa === 'FISICA' ? 'PF' : 'PJ',
            quantidade_processos: env.quantidade_processos
          });

          // Advogados
          if (env.advogados) {
            for (const adv of env.advogados) {
              await base44.asServiceRole.entities.ProcessoParte.create({
                processo_id: processoId,
                escritorio_id: escritorio.id,
                nome: adv.nome,
                tipo_participacao: 'Advogado',
                polo: 'ADVOGADO',
                cpf_cnpj: adv.cpf,
                oab: adv.oabs?.[0] ? `${adv.oabs[0].numero}/${adv.oabs[0].uf}` : null,
                quantidade_processos: adv.quantidade_processos
              });
            }
          }
        }
      }

      // Salvar audiências
      if (fonteOrigem?.audiencias) {
        for (const aud of fonteOrigem.audiencias) {
          await base44.asServiceRole.entities.AudienciaProcesso.create({
            processo_id: processoId,
            escritorio_id: escritorio.id,
            tipo: aud.tipo,
            data_audiencia: aud.data,
            situacao: aud.situacao,
            observacoes: `${aud.quantidade_pessoas} pessoa(s)`
          });
        }
      }

      return Response.json({
        sucesso: true,
        processo_id: processoId,
        numero_cnj,
        data_escavador: data,
        creditos_consumidos: endpoint.creditos_consumidos || 5,
        tempo_ms: tempoMs,
        estatisticas: {
          partes_importadas: fonteOrigem?.quantidade_envolvidos || 0,
          audiencias_importadas: fonteOrigem?.audiencias?.length || 0,
          movimentacoes_disponiveis: fonteOrigem?.quantidade_movimentacoes || 0
        }
      });
    }

    return Response.json({
      sucesso: true,
      data,
      creditos_consumidos: endpoint.creditos_consumidos || 5,
      tempo_ms: tempoMs
    });

  } catch (error) {
    console.error('❌ Erro ao consultar processo CNJ:', error);
    return Response.json({
      sucesso: false,
      erro: error.message
    }, { status: 500 });
  }
});