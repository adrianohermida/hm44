import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { processo_id } = await req.json();
    
    if (!processo_id) {
      return Response.json({ error: 'processo_id obrigatório' }, { status: 400 });
    }

    // Buscar processo
    const processos = await base44.asServiceRole.entities.Processo.filter({ id: processo_id });
    const processo = processos[0];
    
    if (!processo) {
      return Response.json({ error: 'Processo não encontrado' }, { status: 404 });
    }

    if (!processo.numero_cnj) {
      return Response.json({ error: 'Processo sem número CNJ' }, { status: 400 });
    }

    // Parse CNJ para determinar endpoint
    const cnj = processo.numero_cnj.replace(/\D/g, '');
    const segmento = cnj.substring(13, 14);
    const tribunal = cnj.substring(14, 16);
    const tribunalCode = segmento + tribunal;
    
    const endpointMap = {
      '100': 'api_publica_stf',
      '300': 'api_publica_stj',
      '401': 'api_publica_trf1',
      '807': 'api_publica_tjdft',
      '826': 'api_publica_tjsp',
      '819': 'api_publica_tjrj',
      '813': 'api_publica_tjmg',
      '821': 'api_publica_tjrs'
    };
    
    const endpoint = endpointMap[tribunalCode];
    if (!endpoint) {
      return Response.json({ 
        error: 'Tribunal não suportado',
        tribunal_code: tribunalCode 
      }, { status: 400 });
    }

    // Chamar API DataJud
    const apiUrl = `https://api-publica.datajud.cnj.jus.br/${endpoint}/_search`;
    const token = Deno.env.get('DATAJUD_API_TOKEN');
    
    const query = {
      query: { match: { numeroProcesso: cnj } },
      size: 1
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `APIKey ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      throw new Error(`API DataJud retornou ${response.status}`);
    }

    const data = await response.json();
    const hits = data?.hits?.hits || [];
    
    if (hits.length === 0) {
      await base44.asServiceRole.entities.Processo.update(processo_id, {
        sync_status: 'not_found',
        ultima_sincronizacao_datajud: new Date().toISOString()
      });
      
      return Response.json({
        success: false,
        error: 'Processo não encontrado no DataJud',
        endpoint
      });
    }

    const processoData = hits[0]._source;
    
    // Atualizar processo
    await base44.asServiceRole.entities.Processo.update(processo_id, {
      sync_status: 'synced',
      ultima_sincronizacao_datajud: new Date().toISOString(),
      datajud_raw: processoData,
      classe: processoData.classe?.nome,
      orgao_julgador: processoData.orgaoJulgador?.nome,
      sistema: processoData.sistema?.nome,
      data_distribuicao: processoData.dataAjuizamento
    });

    const stats = {
      movimentos_novos: 0,
      publicacoes_criadas: 0
    };

    // Processar movimentos
    if (processoData.movimentos) {
      for (const mov of processoData.movimentos) {
        const movExistente = await base44.asServiceRole.entities.MovimentacaoProcesso.filter({
          processo_id,
          data: mov.dataHora?.split('T')[0],
          tipo: mov.nome
        });

        if (movExistente.length === 0) {
          await base44.asServiceRole.entities.MovimentacaoProcesso.create({
            escritorio_id: processo.escritorio_id,
            processo_id,
            data: mov.dataHora?.split('T')[0],
            tipo: mov.nome,
            conteudo: mov.nome,
            origem: 'datajud'
          });
          stats.movimentos_novos++;
        }
      }
    }

    return Response.json({
      success: true,
      dados: stats,
      tribunal: endpoint,
      cnj_info: {
        tribunal_code: tribunalCode,
        classe: processoData.classe?.nome,
        orgao: processoData.orgaoJulgador?.nome
      }
    });

  } catch (error) {
    console.error('Erro em syncProcessoDatajud:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});