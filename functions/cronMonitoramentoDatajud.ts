import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    // Buscar monitoramentos ativos que precisam verificação
    const agora = new Date();
    const monitoramentos = await base44.asServiceRole.entities.MonitoramentoDatajud.filter({
      ativo: true,
      proxima_verificacao: { $lte: agora.toISOString() }
    });

    const stats = {
      verificados: 0,
      novos_movimentos: 0,
      novas_publicacoes: 0,
      erros: []
    };

    for (const mon of monitoramentos) {
      try {
        // Parse CNJ para determinar endpoint
        const cnj = mon.numero_cnj.replace(/\D/g, '');
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
        if (!endpoint) continue;

        // Chamar API DataJud com paginação
        const apiUrl = `https://api-publica.datajud.cnj.jus.br/${endpoint}/_search`;
        const token = Deno.env.get('DATAJUD_API_TOKEN');
        
        const query = {
          query: { match: { numeroProcesso: cnj } },
          sort: [{ "@timestamp": { order: "desc" } }],
          size: 1
        };

        if (mon.ultimo_timestamp) {
          query.search_after = [mon.ultimo_timestamp];
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `APIKey ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(query)
        });

        if (!response.ok) continue;

        const data = await response.json();
        const hits = data?.hits?.hits || [];
        
        if (hits.length > 0) {
          const processoData = hits[0]._source;
          const sort = hits[0].sort;
          
          // Verificar novos movimentos
          if (processoData.movimentos) {
            for (const mov of processoData.movimentos) {
              const dataMovimento = mov.dataHora?.split('T')[0];
              
              // Verificar se movimento já existe
              const existentes = await base44.asServiceRole.entities.MovimentacaoProcesso.filter({
                processo_id: mon.processo_id,
                data: dataMovimento,
                codigo_tpu: mov.codigo
              });

              if (existentes.length === 0) {
                await base44.asServiceRole.entities.MovimentacaoProcesso.create({
                  escritorio_id: mon.escritorio_id,
                  processo_id: mon.processo_id,
                  data: dataMovimento,
                  tipo: mov.nome,
                  conteudo: mov.nome,
                  codigo_tpu: mov.codigo,
                  origem: 'datajud',
                  metadata: mov
                });
                
                stats.novos_movimentos++;
                
                // Criar notificação
                if (mon.notificar_usuario) {
                  await base44.asServiceRole.entities.Notificacao.create({
                    escritorio_id: mon.escritorio_id,
                    tipo: 'movimento_processo',
                    titulo: `Novo movimento: ${mov.nome}`,
                    mensagem: `Processo ${mon.numero_cnj}`,
                    link: `/ProcessoDetails?id=${mon.processo_id}`,
                    lida: false
                  });
                }
              }
            }
          }
          
          // Atualizar monitoramento
          await base44.asServiceRole.entities.MonitoramentoDatajud.update(mon.id, {
            ultima_verificacao: agora.toISOString(),
            proxima_verificacao: new Date(agora.getTime() + mon.frequencia_horas * 60 * 60 * 1000).toISOString(),
            total_verificacoes: (mon.total_verificacoes || 0) + 1,
            movimentos_encontrados: (mon.movimentos_encontrados || 0) + stats.novos_movimentos,
            ultimo_timestamp: sort ? sort[0] : mon.ultimo_timestamp
          });
        }
        
        stats.verificados++;
        
      } catch (error) {
        stats.erros.push({ processo_id: mon.processo_id, erro: error.message });
      }
    }

    return Response.json({
      success: true,
      ...stats
    });

  } catch (error) {
    console.error('Erro em cronMonitoramentoDatajud:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});