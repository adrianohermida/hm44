import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    if (!escritorioId) {
      return Response.json({ error: 'Escritório não encontrado' }, { status: 404 });
    }

    // Buscar processos que precisam sincronização
    // 1. Status pending
    // 2. Última sync há mais de 24h
    // 3. Nunca sincronizados
    const processos = await base44.asServiceRole.entities.Processo.filter({
      escritorio_id: escritorioId
    }, undefined, 1000);

    const agora = new Date();
    const umDiaAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

    const processosPraSincronizar = processos.filter(p => {
      if (!p.numero_cnj || p.numero_cnj.length !== 20) return false;
      if (p.sync_status === 'pending') return true;
      if (!p.ultima_sincronizacao_datajud) return true;
      const ultimaSync = new Date(p.ultima_sincronizacao_datajud);
      return ultimaSync < umDiaAtras;
    });

    console.log(`📊 Scheduler: ${processosPraSincronizar.length} processos para sincronizar`);

    const resultados = {
      total: processosPraSincronizar.length,
      sincronizados: 0,
      erros: 0,
      nao_encontrados: 0,
      logs: []
    };

    const token = Deno.env.get('DATAJUD_API_TOKEN');
    if (!token) {
      return Response.json({ 
        error: 'DATAJUD_API_TOKEN não configurado' 
      }, { status: 500 });
    }

    // Processar em lote (max 50 por vez para não sobrecarregar)
    const lote = processosPraSincronizar.slice(0, 50);

    for (const processo of lote) {
      try {
        const tribunal = processo.numero_cnj.substring(13, 15);
        const grau = processo.numero_cnj.substring(15, 17);
        
        const tribunalMap = {
          '01': 'STF', '02': 'CNJ', '03': 'STJ', '04': 'JF', '05': 'TRT',
          '06': 'TRE', '07': 'TM', '08': 'TJ', '09': 'TME'
        };

        const sigla = tribunalMap[tribunal];
        if (!sigla) {
          resultados.logs.push({
            processo_id: processo.id,
            numero_cnj: processo.numero_cnj,
            status: 'erro',
            mensagem: 'Tribunal não identificado'
          });
          resultados.erros++;
          continue;
        }

        // Determinar endpoint (simplificado - melhorar com CNJParser)
        const endpointAlias = `api_publica_${processo.tribunal?.toLowerCase() || 'tjsp'}`;
        const url = `https://api-publica.datajud.cnj.jus.br/${endpointAlias}/_search`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `APIKey ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: { match: { numeroProcesso: processo.numero_cnj } },
            size: 1
          })
        });

        if (!response.ok) {
          resultados.logs.push({
            processo_id: processo.id,
            numero_cnj: processo.numero_cnj,
            status: 'erro',
            mensagem: `HTTP ${response.status}`
          });
          resultados.erros++;
          
          await base44.asServiceRole.entities.Processo.update(processo.id, {
            sync_status: 'error',
            ultima_sincronizacao_datajud: new Date().toISOString()
          });
          continue;
        }

        const data = await response.json();
        const hit = data.hits?.hits?.[0];

        if (!hit) {
          resultados.logs.push({
            processo_id: processo.id,
            numero_cnj: processo.numero_cnj,
            status: 'nao_encontrado',
            mensagem: 'Processo não existe no DataJud'
          });
          resultados.nao_encontrados++;
          
          await base44.asServiceRole.entities.Processo.update(processo.id, {
            sync_status: 'not_found',
            ultima_sincronizacao_datajud: new Date().toISOString()
          });
          continue;
        }

        const source = hit._source;

        // Atualizar processo com dados do DataJud
        await base44.asServiceRole.entities.Processo.update(processo.id, {
          sync_status: 'synced',
          ultima_sincronizacao_datajud: new Date().toISOString(),
          datajud_raw: source,
          classe: source.classe?.nome || processo.classe,
          orgao_julgador: source.orgaoJulgador?.nome || processo.orgao_julgador,
          data_ajuizamento: source.dataAjuizamento || processo.data_ajuizamento,
          sistema: source.sistema?.nome || processo.sistema
        });

        resultados.logs.push({
          processo_id: processo.id,
          numero_cnj: processo.numero_cnj,
          status: 'sincronizado',
          mensagem: 'Dados atualizados com sucesso'
        });
        resultados.sincronizados++;

      } catch (error) {
        resultados.logs.push({
          processo_id: processo.id,
          numero_cnj: processo.numero_cnj,
          status: 'erro',
          mensagem: error.message
        });
        resultados.erros++;
      }
    }

    return Response.json({
      success: true,
      ...resultados,
      executado_em: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});