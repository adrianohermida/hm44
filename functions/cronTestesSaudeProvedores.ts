import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  const inicio = new Date();
  let execId = null;
  
  try {
    const base44 = createClientFromRequest(req);

    const escritorios = await base44.asServiceRole.entities.Escritorio.list();
    const escritorioId = escritorios[0]?.id;

    if (escritorioId) {
      execId = (await base44.asServiceRole.entities.CronExecution.create({
        escritorio_id: escritorioId,
        cron_name: 'cronTestesSaudeProvedores',
        status: 'executando',
        inicio: inicio.toISOString(),
        logs: ['Iniciando testes de saúde...']
      })).id;
    }
    
    // Buscar todos provedores ativos
    const provedores = await base44.asServiceRole.entities.ProvedorAPI.filter({ ativo: true });
    
    const resultados = [];
    
    for (const provedor of provedores) {
      const url = provedor.base_url_v2 || provedor.base_url_v1;
      
      if (!url) {
        resultados.push({ provedor_id: provedor.id, status: 'skipped', motivo: 'URL não configurada' });
        continue;
      }
      
      // Obter secret correto
      const apiKeyConfig = provedor.api_key_config || {};
      const secretName = apiKeyConfig.secret_name || provedor.secret_name;
      
      if (!secretName) {
        resultados.push({ provedor_id: provedor.id, status: 'skipped', motivo: 'Secret não configurado' });
        continue;
      }
      
      const token = Deno.env.get(secretName);
      
      if (!token) {
        resultados.push({ provedor_id: provedor.id, status: 'skipped', motivo: `Secret ${secretName} não existe` });
        continue;
      }
      
      const inicio = Date.now();
      
      try {
        // Construir URL e headers
        let testUrl = url;
        const headers = {};
        
        if (apiKeyConfig.query_param_name) {
          const separator = url.includes('?') ? '&' : '?';
          testUrl = `${url}${separator}${apiKeyConfig.query_param_name}=${token}`;
        } else {
          const headerName = apiKeyConfig.header_name || 'Authorization';
          const prefix = apiKeyConfig.prefix || 'Bearer';
          headers[headerName] = prefix ? `${prefix} ${token}` : token;
        }
        
        const response = await fetch(testUrl, {
          method: 'HEAD',
          headers,
          signal: AbortSignal.timeout(10000) // 10s timeout
        });
        
        const latencia = Date.now() - inicio;
        const saude = response.ok ? 'Saudável' : 'Degradado';
        
        // Obter escritório do provedor
        const escritorioId = provedor.escritorio_id;
        
        // Salvar histórico
        await base44.asServiceRole.entities.HistoricoSaudeProvedor.create({
          provedor_id: provedor.id,
          escritorio_id: escritorioId,
          saude,
          latencia_ms: latencia,
          http_status: response.status,
          tipo_teste: 'automatico',
          detalhes: {
            url_testado: testUrl,
            cron: true
          }
        });
        
        // Atualizar status no provedor
        await base44.asServiceRole.entities.ProvedorAPI.update(provedor.id, {
          saude_status: saude,
          latencia_media_ms: latencia,
          ultima_verificacao: new Date().toISOString()
        });
        
        // Se degradado ou indisponível, criar notificação
        if (saude !== 'Saudável') {
          // Buscar admins do escritório
          const admins = await base44.asServiceRole.entities.User.filter({ 
            role: 'admin'
          });
          
          for (const admin of admins) {
            await base44.asServiceRole.entities.Notificacao.create({
              tipo: 'alerta_api',
              titulo: `🚨 Provedor ${provedor.nome} ${saude}`,
              mensagem: `O provedor ${provedor.nome} está ${saude.toLowerCase()}. Status HTTP: ${response.status}. Latência: ${latencia}ms.`,
              user_email: admin.email,
              escritorio_id: escritorioId,
              link: `/AdminProvedores?provedor=${provedor.id}`
            });
          }
        }
        
        resultados.push({ 
          provedor_id: provedor.id, 
          nome: provedor.nome,
          status: 'testado', 
          saude, 
          latencia 
        });
        
      } catch (err) {
        const latencia = Date.now() - inicio;
        const saude = 'Indisponível';
        
        // Salvar histórico do erro
        await base44.asServiceRole.entities.HistoricoSaudeProvedor.create({
          provedor_id: provedor.id,
          escritorio_id: provedor.escritorio_id,
          saude,
          latencia_ms: latencia,
          http_status: 0,
          erro: err.message,
          tipo_teste: 'automatico',
          detalhes: {
            erro_stack: err.stack
          }
        });
        
        // Atualizar status
        await base44.asServiceRole.entities.ProvedorAPI.update(provedor.id, {
          saude_status: saude,
          latencia_media_ms: latencia,
          ultima_verificacao: new Date().toISOString()
        });

        // Verificar alertas configurados
        const alertas = await base44.asServiceRole.entities.AlertaConfig.filter({
          escritorio_id: provedor.escritorio_id,
          ativo: true
        });

        for (const alerta of alertas) {
          if (alerta.provedor_id && alerta.provedor_id !== provedor.id) continue;

          let disparar = false;

          if (alerta.tipo === 'latencia') {
            if (alerta.comparacao === 'maior_que' && latencia > alerta.threshold_value) disparar = true;
            if (alerta.comparacao === 'menor_que' && latencia < alerta.threshold_value) disparar = true;
          } else if (alerta.tipo === 'taxa_sucesso') {
            const taxa = saude === 'Saudável' ? 100 : saude === 'Degradado' ? 50 : 0;
            if (alerta.comparacao === 'menor_que' && taxa < alerta.threshold_value) disparar = true;
          }

          if (disparar) {
            if (alerta.canais.includes('sistema')) {
              for (const email of (alerta.destinatarios || [])) {
                await base44.asServiceRole.entities.Notificacao.create({
                  tipo: 'nova_mensagem',
                  titulo: `Alerta: ${provedor.nome}`,
                  mensagem: `${alerta.tipo} atingiu threshold (${latencia}ms > ${alerta.threshold_value})`,
                  user_email: email,
                  escritorio_id: provedor.escritorio_id
                });
              }
            }

            await base44.asServiceRole.entities.AlertaConfig.update(alerta.id, {
              ultima_notificacao: new Date().toISOString(),
              total_disparos: (alerta.total_disparos || 0) + 1
            });
          }
        }
        
        // Notificar admins
        const admins = await base44.asServiceRole.entities.User.filter({ role: 'admin' });
        for (const admin of admins) {
          await base44.asServiceRole.entities.Notificacao.create({
            tipo: 'alerta_api',
            titulo: `🚨 Provedor ${provedor.nome} Indisponível`,
            mensagem: `Erro ao testar ${provedor.nome}: ${err.message}`,
            user_email: admin.email,
            escritorio_id: provedor.escritorio_id,
            link: `/AdminProvedores?provedor=${provedor.id}`
          });
        }
        
        resultados.push({ 
          provedor_id: provedor.id, 
          nome: provedor.nome,
          status: 'erro', 
          erro: err.message 
        });
      }
    }

    const fim = new Date();
    const saudaveis = resultados.filter(r => r.saude === 'Saudável').length;
    const erros = resultados.filter(r => r.status === 'erro').length;

    if (execId) {
      await base44.asServiceRole.entities.CronExecution.update(execId, {
        status: 'sucesso',
        fim: fim.toISOString(),
        duracao_ms: fim - inicio,
        provedores_testados: resultados.length,
        provedores_saudaveis: saudaveis,
        provedores_com_erro: erros,
        logs: [`Testados: ${resultados.length}`, `Saudáveis: ${saudaveis}`, `Erros: ${erros}`]
      });
    }
    
    return Response.json({ 
      sucesso: true, 
      total_testados: resultados.length,
      saudaveis,
      erros,
      resultados 
    });
    
  } catch (error) {
    if (execId) {
      const base44 = createClientFromRequest(req);
      await base44.asServiceRole.entities.CronExecution.update(execId, {
        status: 'erro',
        fim: new Date().toISOString(),
        duracao_ms: new Date() - inicio,
        erro_mensagem: error.message,
        logs: [`Erro: ${error.message}`]
      });
    }

    return Response.json({ 
      sucesso: false, 
      erro: error.message 
    }, { status: 500 });
  }
});