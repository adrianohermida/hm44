import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { monitorarTimeouts } from './utils/jobTimeoutMonitor.js';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobId } = await req.json();
    
    if (!jobId) {
      return Response.json({ error: 'jobId é obrigatório' }, { status: 400 });
    }

    console.log(`[Job ${jobId}] Requisição recebida de ${user.email}`);

    // Monitorar timeouts globalmente
    await monitorarTimeouts(base44);

    // Buscar job
    const jobs = await base44.asServiceRole.entities.JobImportacao.filter({ id: jobId });
    if (jobs.length === 0) {
      console.error(`[Job ${jobId}] Não encontrado no banco`);
      return Response.json({ error: 'Job não encontrado' }, { status: 404 });
    }

    const job = jobs[0];
    console.log(`[Job ${jobId}] Encontrado:`, {
      status: job.status,
      total: job.total_registros,
      temDados: !!job.dados,
      qtdDados: job.dados?.length || 0
    });

    // Verificar status
    if (job.status === 'cancelado') {
      return Response.json({ message: 'Job foi cancelado' });
    }

    if (job.status === 'processando') {
      return Response.json({ 
        message: 'Job já está sendo processado',
        progresso: job.progresso_percentual 
      });
    }

    if (job.status === 'concluido') {
      return Response.json({ 
        message: 'Job já foi concluído',
        resultados: {
          total: job.total_registros,
          sucessos: job.registros_sucesso,
          falhas: job.registros_falha
        }
      });
    }

    // Atualizar status para processando
    await base44.asServiceRole.entities.JobImportacao.update(jobId, {
      status: 'processando',
      tempo_inicio: new Date().toISOString()
    });
    
    console.log(`[Job ${jobId}] Status atualizado para 'processando'`);

    // 📢 NOTIFICAÇÃO: Job iniciado
    await base44.asServiceRole.entities.Notificacao.create({
      escritorio_id: job.escritorio_id,
      user_email: user.email,
      tipo: 'importacao_iniciada',
      titulo: '📥 Importação iniciada',
      mensagem: `Processando ${job.total_registros} processos em segundo plano`,
      lida: false,
      metadata: { jobId, total: job.total_registros }
    });

    // PROCESSAR EM BACKGROUND (não espera conclusão)
    processarEmBackground(jobId, job, base44, user.email)
      .then(() => console.log(`[Job ${jobId}] Background concluído`))
      .catch(err => console.error(`[Job ${jobId}] Erro no background:`, err));

    return Response.json({
      success: true,
      message: 'Job iniciado em background',
      jobId
    });

  } catch (error) {
    console.error('Erro crítico em processarJobImportacao:', error);
    return Response.json({ 
      success: false, 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});

async function processarEmBackground(jobId, job, base44, userEmail) {
  console.log(`[Background ${jobId}] Iniciando processamento`);
  const tempoInicio = Date.now();
  const resultados = {
    sucessos: 0,
    falhas: 0,
    erros: [],
    retries: 0
  };

  try {
    const dados = job.dados || job.dados_importacao || [];
    
    if (!dados || dados.length === 0) {
      throw new Error('Nenhum dado para processar');
    }
    
    const batchSize = job.opcoes?.batchSize || job.batch_size || 100;
    const parallelLimit = job.opcoes?.parallelLimit || Math.min(5, Math.ceil(batchSize / 20)); // Max 5 parallel
    const escritorioId = job.escritorio_id;
    const ignorarErros = job.opcoes?.ignorar_erros !== false;
    
    console.log(`[Background ${jobId}] Config:`, {
      total: dados.length,
      batch: batchSize,
      parallel: parallelLimit,
      ignorarErros,
      escritorioId
    });

    // Processar em lotes com paralelismo
    for (let i = 0; i < dados.length; i += batchSize) {
      // Verificar cancelamento
      const jobAtual = await base44.asServiceRole.entities.JobImportacao.filter({ id: jobId });
      if (jobAtual[0]?.status === 'cancelado') {
        throw new Error('Job cancelado pelo usuário');
      }

      const lote = dados.slice(i, i + batchSize);
      const batchNum = Math.floor(i / batchSize) + 1;
      const totalBatches = Math.ceil(dados.length / batchSize);
      
      console.log(`[Background ${jobId}] Batch ${batchNum}/${totalBatches} - ${lote.length} items (parallel=${parallelLimit})`);

      // Processar lote com paralelismo limitado
      const resultadosLote = await processarLoteParalelo(
        base44, 
        lote, 
        escritorioId, 
        parallelLimit,
        jobId
      );

      resultados.sucessos += resultadosLote.sucessos;
      resultados.falhas += resultadosLote.falhas;
      resultados.retries += resultadosLote.retries;
      
      // Processar erros
      for (const erro of resultadosLote.erros) {
        if (ignorarErros) {
          erro.ignorado = true;
          resultados.erros.push(erro);
        } else {
          resultados.erros.push(erro);
          if (resultados.falhas > dados.length * 0.5) {
            throw new Error(`Taxa de falha crítica: ${resultados.falhas}/${dados.length}`);
          }
        }
      }

      // Atualizar progresso
      const processados = Math.min(i + batchSize, dados.length);
      const progresso = Math.floor((processados / dados.length) * 100);

      await base44.asServiceRole.entities.JobImportacao.update(jobId, {
        registros_processados: processados,
        registros_sucesso: resultados.sucessos,
        registros_falha: resultados.falhas,
        erros: resultados.erros.slice(-100),
        progresso_percentual: progresso,
        opcoes: { ...job.opcoes, retries_executados: resultados.retries }
      });
      
      console.log(`[Background ${jobId}] ${progresso}% - ✅ ${resultados.sucessos} | ❌ ${resultados.falhas} | 🔄 ${resultados.retries}`);

      // Delay adaptativo entre batches
      const delayMs = resultados.retries > 10 ? 500 : 100;
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    // Finalizar job com sucesso
    const tempoFim = Date.now();
    const duracaoSegundos = Math.floor((tempoFim - tempoInicio) / 1000);
    
    await base44.asServiceRole.entities.JobImportacao.update(jobId, {
      status: 'concluido',
      registros_processados: dados.length,
      registros_sucesso: resultados.sucessos,
      registros_falha: resultados.falhas,
      erros: resultados.erros,
      progresso_percentual: 100,
      tempo_conclusao: new Date().toISOString(),
      duracao_segundos: duracaoSegundos
    });
    
    console.log(`[Background ${jobId}] ✅ CONCLUÍDO - ${resultados.sucessos} sucessos, ${resultados.falhas} falhas em ${duracaoSegundos}s`);

    // 📢 NOTIFICAÇÃO: Job concluído com sucesso
    await base44.asServiceRole.entities.Notificacao.create({
      escritorio_id: escritorioId,
      user_email: userEmail,
      tipo: 'importacao_concluida',
      titulo: '✅ Importação concluída',
      mensagem: `${resultados.sucessos} processos importados com sucesso${resultados.falhas > 0 ? ` (${resultados.falhas} erros)` : ''} em ${duracaoSegundos}s`,
      lida: false,
      metadata: { 
        jobId, 
        sucessos: resultados.sucessos, 
        falhas: resultados.falhas,
        duracao: duracaoSegundos
      }
    });

  } catch (error) {
    console.error(`[Background ${jobId}] ❌ ERRO FATAL:`, error);
    
    // Marcar job como falhou
    await base44.asServiceRole.entities.JobImportacao.update(jobId, {
      status: 'falhou',
      erro_mensagem: error.message,
      erros: [...resultados.erros, { erro: 'ERRO CRÍTICO: ' + error.message }],
      tempo_conclusao: new Date().toISOString()
    });

    // 📢 NOTIFICAÇÃO: Job falhou
    await base44.asServiceRole.entities.Notificacao.create({
      escritorio_id: escritorioId,
      user_email: userEmail,
      tipo: 'importacao_falhou',
      titulo: '❌ Importação falhou',
      mensagem: `Erro ao importar processos: ${error.message}`,
      lida: false,
      metadata: { 
        jobId, 
        erro: error.message,
        sucessos: resultados.sucessos,
        falhas: resultados.falhas
      }
    });
  }
}

async function processarLoteParalelo(base44, lote, escritorioId, parallelLimit, jobId) {
  const resultados = { sucessos: 0, falhas: 0, erros: [], retries: 0 };
  
  // Dividir lote em chunks para paralelismo controlado
  for (let i = 0; i < lote.length; i += parallelLimit) {
    const chunk = lote.slice(i, i + parallelLimit);
    
    const promises = chunk.map(row => 
      importarProcessoComRetry(base44, row, escritorioId, jobId)
        .then(() => {
          resultados.sucessos++;
          return { sucesso: true };
        })
        .catch(error => {
          resultados.falhas++;
          resultados.erros.push({
            numero_cnj: row.numero_cnj || 'N/A',
            erro: error.message,
            timestamp: new Date().toISOString()
          });
          return { sucesso: false, erro: error };
        })
    );

    const results = await Promise.allSettled(promises);
    
    // Contar retries (se implementado nos erros)
    results.forEach(r => {
      if (r.status === 'fulfilled' && r.value.retries) {
        resultados.retries += r.value.retries;
      }
    });
  }

  return resultados;
}

async function importarProcessoComRetry(base44, row, escritorioId, jobId, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await importarProcesso(base44, row, escritorioId);
      if (attempt > 1) {
        console.log(`[${jobId}] ✅ Sucesso após ${attempt} tentativas: ${row.numero_cnj}`);
      }
      return { retries: attempt - 1 };
    } catch (error) {
      lastError = error;
      
      // Não retentar erros de validação
      if (error.message.includes('CNJ inválido') || 
          error.message.includes('ausente') ||
          error.message.includes('dígitos')) {
        throw error;
      }
      
      // Retry com backoff exponencial
      if (attempt < maxRetries) {
        const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        console.log(`[${jobId}] 🔄 Retry ${attempt}/${maxRetries} em ${delayMs}ms: ${row.numero_cnj}`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
}

async function importarProcesso(base44, row, escritorioId) {
  let numero_cnj = row.numero_cnj || row.numero || row.processo_numero;
  
  if (!numero_cnj) {
    const dadosApi = parseJSON(row.dados_completos_api);
    if (dadosApi?.numero_cnj) numero_cnj = dadosApi.numero_cnj;
  }
  
  if (!numero_cnj) throw new Error('numero_cnj ausente');
  
  const cnj_limpo = numero_cnj.toString().replace(/[^\d]/g, '');
  if (cnj_limpo.length !== 20) throw new Error(`CNJ inválido: ${cnj_limpo.length} dígitos`);
  
  const processoData = {
    id: cnj_limpo,
    escritorio_id: row.escritorio_id || escritorioId,
    numero_cnj: cnj_limpo,
    titulo: row.titulo || row.titulo_polo_ativo || '',
    cliente_id: row.cliente_id || null,
    tribunal: row.tribunal || null,
    status: row.status || 'ativo',
    polo_ativo: row.polo_ativo || row.titulo_polo_ativo || null,
    polo_passivo: row.polo_passivo || row.titulo_polo_passivo || null,
    fonte_origem: row.fonte_origem || 'IMPORTACAO_CSV',
    dados_completos_api: parseJSON(row.dados_completos_api) || row
  };

  const existe = await base44.asServiceRole.entities.Processo.filter({ id: processoData.id });

  if (existe.length > 0) {
    await base44.asServiceRole.entities.Processo.update(processoData.id, processoData);
  } else {
    await base44.asServiceRole.entities.Processo.create(processoData);
  }

  await importarPartesEApensos(base44, cnj_limpo, row, escritorioId);
}

async function importarPartesEApensos(base44, processo_id, row, escritorioId) {
  const esc_id = row.escritorio_id || escritorioId;
  const fontes = parseJSON(row.fontes) || [];
  
  // CACHE: buscar todos clientes uma vez
  const todosClientes = await base44.asServiceRole.entities.Cliente.filter({ escritorio_id: esc_id });
  const clientesMap = new Map();
  todosClientes.forEach(c => {
    if (c.cpf_cnpj) clientesMap.set(c.cpf_cnpj, c);
  });

  // PARTES: deduplica + auto-link cliente
  const partesMap = new Map();
  
  for (const fonte of fontes) {
    for (const env of fonte.envolvidos || []) {
      const cpf_cnpj = env.cpf || env.cnpj || null;
      const key = cpf_cnpj || `${env.nome}_${env.polo}`;
      
      if (!partesMap.has(key)) {
        const cliente = cpf_cnpj ? clientesMap.get(cpf_cnpj) : null;
        
        partesMap.set(key, {
          processo_id,
          escritorio_id: esc_id,
          cliente_id: cliente?.id || null,
          e_cliente_escritorio: !!cliente,
          nome: env.nome,
          tipo_pessoa: env.tipo_pessoa === 'FISICA' ? 'fisica' : 'juridica',
          qualificacao: env.tipo_normalizado,
          tipo_parte: env.polo === 'ATIVO' ? 'polo_ativo' : 
                      env.polo === 'PASSIVO' ? 'polo_passivo' : 'terceiro_interessado',
          cpf_cnpj,
          advogados: (env.advogados || []).slice(0, 3).map(adv => ({
            nome: adv.nome,
            oab_numero: adv.oabs?.[0]?.numero?.toString(),
            oab_uf: adv.oabs?.[0]?.uf
          }))
        });
      }
    }
  }

  // BULK CREATE partes
  const partesArray = Array.from(partesMap.values());
  if (partesArray.length > 0) {
    try {
      await base44.asServiceRole.entities.ProcessoParte.bulkCreate(partesArray);
    } catch (e) {
      console.warn('Erro bulk partes, criando individual:', e.message);
      for (const parte of partesArray) {
        try {
          await base44.asServiceRole.entities.ProcessoParte.create(parte);
        } catch (err) {}
      }
    }
  }

  // APENSOS: processar em batch
  const apensosSet = new Set();
  
  // Extrair de processos_relacionados
  const relacionados = parseJSON(row.processos_relacionados) || [];
  relacionados.forEach(rel => {
    const cnj = rel.numero?.replace(/\D/g, '');
    if (cnj?.length === 20) apensosSet.add(cnj);
  });
  
  // Extrair de apensos_raw
  if (row.apensos_raw) {
    row.apensos_raw.split(',').forEach(a => {
      const cnj = a.trim();
      if (cnj.length === 20) apensosSet.add(cnj);
    });
  }

  // Criar apensos em batch
  for (const apenso_cnj of apensosSet) {
    try {
      const existe = await base44.asServiceRole.entities.Processo.filter({ numero_cnj: apenso_cnj });
      if (existe.length === 0) {
        await base44.asServiceRole.entities.Processo.create({
          id: apenso_cnj,
          escritorio_id: esc_id,
          numero_cnj: apenso_cnj,
          titulo: `Apenso`,
          processo_pai_id: processo_id,
          relation_type: 'apenso',
          status: 'ativo',
          fonte_origem: 'IMPORTACAO_APENSO'
        });
      }
    } catch (e) {}
  }
}



function parseJSON(value) {
  if (!value) return null;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}